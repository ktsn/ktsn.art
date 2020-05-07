const path = require('path')
const firebase = require('firebase-admin')

const serviceAccount = require('./serviceAccountKey.json')

const firebaseConfig = {
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://illusts-ktsn-dev-development.firebaseio.com',
  storageBucket: 'illusts-ktsn-dev-development.appspot.com',
}

firebase.initializeApp(firebaseConfig)

const db = firebase.database()
const bucket = firebase.storage().bucket()

module.exports = async function uploadIllust(image, fileName, createdAt) {
  // Create DB record
  const illusts = db.ref('illusts')
  const newData = illusts.push()
  const key = newData.key

  // Upload image
  const ext = path.extname(fileName)
  const imagePath = `illusts/${key}/image${ext}`
  const thumbnailPath = `illusts/${key}/thumbnail${ext}`

  await Promise.all([
    // Don't convert thumbnail for now...
    upload(imagePath, image),
    upload(thumbnailPath, image),

    // Save DB record
    newData.then((ref) => {
      return ref.set({
        image: imagePath,
        thumbnail: thumbnailPath,
        createdAt: createdAt.getTime(),
      })
    }),
  ])
}

function upload(path, file) {
  const fileRef = bucket.file(path)
  return fileRef.save(file)
}
