const path = require('path')
const firebase = require('firebase-admin')
const sharp = require('sharp')
const mocks = require('./mocks')

const project =
  process.env.NODE_ENV !== 'production'
    ? 'illusts-ktsn-dev-development'
    : 'illust-ktsn-dev'

const serviceAccount = require('./serviceAccountKey.json')

const firebaseConfig = {
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: `https://${project}.firebaseio.com`,
  storageBucket: `${project}.appspot.com`,
}

const thumbnailSize = 300
const storagePrefix = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/`
const storageSuffix = '?alt=media'

firebase.initializeApp(firebaseConfig)

const db = process.env.DRY_RUN ? mocks.database : firebase.database()
const bucket = process.env.DRY_RUN ? mocks.bucket : firebase.storage().bucket()

module.exports = async function uploadIllust(
  originalImage,
  fileName,
  createdAt
) {
  // Create DB record
  const illusts = db.ref('illusts')
  const newData = illusts.push()
  const key = newData.key

  // Image metadata
  const ext = path.extname(fileName)
  const originalPath = `illusts/${key}/original${ext}`
  const displayPath = `illusts/${key}/display.webp`
  const displayFallbackPath = `illusts/${key}/display${ext}`
  const thumbnailPath = `illusts/${key}/thumbnail.webp`
  const thumbnailFallbackPath = `illusts/${key}/thumbnail${ext}`

  // Convert images
  const displayImage = await sharp(originalImage).webp().toBuffer()
  const displayFallbackImage = originalImage
  const thumbnail = sharp(originalImage).resize(thumbnailSize, thumbnailSize, {
    fit: 'outside',
  })
  const thumbnailImage = await thumbnail.webp().toBuffer()
  const thumbnailFallbackImage = await thumbnail.toBuffer()

  await Promise.all([
    upload(originalPath, originalImage),
    upload(displayPath, displayImage),
    upload(displayFallbackPath, displayFallbackImage),
    upload(thumbnailPath, thumbnailImage),
    upload(thumbnailFallbackPath, thumbnailFallbackImage),

    // Save DB record
    newData.then(async (ref) => {
      await ref.set({
        originalImageUrl: storageUrl(originalPath),
        displayImageUrl: storageUrl(displayPath),
        displayImageFallbackUrl: storageUrl(displayFallbackPath),
        thumbnailImageUrl: storageUrl(thumbnailPath),
        thumbnailImageFallbackUrl: storageUrl(thumbnailFallbackPath),
        createdAt: createdAt.getTime(),
      })
    }),
  ])
}

function upload(path, file) {
  const fileRef = bucket.file(path)
  return fileRef.save(file)
}

function storageUrl(path) {
  return `${storagePrefix}${encodeURIComponent(path)}${storageSuffix}`
}
