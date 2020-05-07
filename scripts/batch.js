const fs = require('fs')
const path = require('path')
const upload = require('./upload')

const args = process.argv.slice(2)

if (typeof args[0] !== 'string') {
  throw new Error('csv file path is required')
}

const csvPath = args[0]
const csv = fs
  .readFileSync(csvPath, 'utf8')
  .split('\n')
  .map((row) => row.split(','))

Promise.all(
  csv.map(async (row) => {
    const data = fs.readFileSync(row[0])
    const fileName = path.basename(row[0])
    const date = new Date(Number(row[1]))
    console.log('Start: ' + row[0] + ', createdAt: ' + date.toISOString())
    await upload(data, fileName, date)
    console.log('Finished: ' + row[0])
  })
)
  .then(() => {
    console.log('Upload finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
