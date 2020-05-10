const path = require('path')
const fs = require('fs-extra')

let key = 0

module.exports = {
  database: {
    ref() {
      return {
        push() {
          const p = Promise.resolve({
            set() {},
          })

          p.key = ++key

          return p
        },
      }
    },
  },

  bucket: {
    file(p) {
      return {
        save(file) {
          return fs.outputFile(path.join('dry_run/', p), file)
        },
      }
    },
  },
}
