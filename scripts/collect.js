const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)

if (typeof args[0] !== 'string') {
  throw new Error('image directory path is required')
}

const dir = args[0]

const files = fs.readdirSync(dir).filter((file) => {
  return ['.png', '.jpg'].includes(path.extname(file))
})
const data = files.map((file) => {
  const filePath = path.resolve(dir, file)
  const stat = fs.statSync(filePath)

  return [filePath, stat.birthtimeMs]
})

fs.writeFileSync('output.csv', data.map((row) => row.join(',')).join('\n'))
