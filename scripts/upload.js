const path = require('path')
const firebase = require('firebase-admin')
const sharp = require('sharp')

const serviceAccount = require('./serviceAccountKey.json')

const firebaseConfig = {
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://illusts-ktsn-dev-development.firebaseio.com',
  storageBucket: 'illusts-ktsn-dev-development.appspot.com',
}

const thumbnailSize = 300
const storagePrefix = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/`
const storageSuffix = '?alt=media'

firebase.initializeApp(firebaseConfig)

const db = firebase.database()
const bucket = firebase.storage().bucket()

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
  const thumbnailPath = `illusts/${key}/thumbnail.webp`
  const { width, height } = await sharp(originalImage).metadata()

  // Convert images
  const displayImage = await sharp(originalImage).webp().toBuffer()
  const thumbnailImage = await sharp(originalImage)
    .resize(thumbnailSize, thumbnailSize, {
      fit: 'outside',
    })
    .webp()
    .toBuffer()

  await Promise.all([
    upload(originalPath, originalImage),
    upload(displayPath, displayImage),
    upload(thumbnailPath, thumbnailImage),

    // Save DB record
    newData.then(async (ref) => {
      await ref.set({
        originalImageUrl: storageUrl(originalPath),
        displayImageUrl: storageUrl(displayPath),
        thumbnailImageUrl: storageUrl(thumbnailPath),
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
