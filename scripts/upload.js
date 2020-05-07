const path = require('path')
const firebase = require('firebase-admin')
const smartcrop = require('smartcrop-sharp')
const sharp = require('sharp')

const serviceAccount = require('./serviceAccountKey.json')

const thumbnailSize = 300

const firebaseConfig = {
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://illusts-ktsn-dev-development.firebaseio.com',
  storageBucket: 'illusts-ktsn-dev-development.appspot.com',
}

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

  // Crop
  const { topCrop: crop } = await smartcrop.crop(originalImage, {
    width,
    height,
  })

  // Convert images
  const displayImage = await sharp(originalImage).webp().toBuffer()
  const thumbnailImage = await sharp(originalImage)
    .extract({
      width: crop.width,
      height: crop.height,
      left: crop.x,
      top: crop.y,
    })
    .resize(thumbnailSize, thumbnailSize)
    .webp()
    .toBuffer()

  await Promise.all([
    upload(originalPath, originalImage),
    upload(displayPath, displayImage),
    upload(thumbnailPath, thumbnailImage),

    // Save DB record
    newData.then(async (ref) => {
      await ref.set({
        originalImage: originalPath,
        displayImage: displayPath,
        thumbnailImage: thumbnailPath,
        createdAt: createdAt.getTime(),
      })
    }),
  ])
}

function upload(path, file) {
  const fileRef = bucket.file(path)
  return fileRef.save(file)
}
