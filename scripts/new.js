const fs = require('fs')
const path = require('path')
const upload = require('./upload')

const args = process.argv.slice(2)

if (typeof args[0] !== 'string') {
  throw new Error('illust file path is required')
}

const filePath = args[0]
const data = fs.readFileSync(filePath)
const fileName = path.basename(filePath)

console.log('Uploading: ' + filePath)
upload(data, fileName)
  .then(() => {
    console.log('Finished: ' + filePath)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
