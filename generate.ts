import * as fse from 'fs-extra'
import * as path from 'path'
import { renderToString } from '@vue/server-renderer'
import * as firebase from 'firebase/app'
import 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDY9ZeVVWzdIPQL12vKAN_SxWsazxo63SU',
  authDomain: 'illust-ktsn-dev.firebaseapp.com',
  databaseURL: 'https://illust-ktsn-dev.firebaseio.com',
  projectId: 'illust-ktsn-dev',
  storageBucket: 'illust-ktsn-dev.appspot.com',
  messagingSenderId: '182006812020',
  appId: '1:182006812020:web:d39a3fba26465f39c9f021',
  measurementId: 'G-1JNZFCG5YL',
}

firebase.initializeApp(firebaseConfig)
export const db = firebase.database()

interface GenerateOptions {
  baseHtmlPath: string
  outputDir: string
  routes: () => Promise<string[]>
}

async function generatePages(options: GenerateOptions) {
  const ssrBundlePath = (await fse.readdir('dist-ssr')).find((f) =>
    f.endsWith('.js')
  )!
  const { createApp } = require('./' + path.join('dist-ssr', ssrBundlePath))

  const baseHtml = (await fse.readFile(options.baseHtmlPath, 'utf8')).replace(
    /<script ([^>]*)>/g,
    '<script async $1>'
  )
  const dir = options.outputDir
  const routes = await options.routes()

  await Promise.all(
    routes.map(async (route) => {
      const { app, router } = createApp(true)
      await router.push(route)
      const content = await renderToString(app)

      const replacedHtml = baseHtml.replace(
        '<div id="app"></div>',
        `<div id="app">${content}</div>`
      )
      const output = path.join(dir, route, 'index.html')
      await fse.outputFile(output, replacedHtml)
      console.log('Wrote: ' + output)
    })
  )
}

generatePages({
  baseHtmlPath: './dist/index.html',
  outputDir: './dist',
  routes: () => {
    return new Promise((resolve) => {
      db.ref('illusts').once('value', (snapshot) => {
        const routes = ['/']
        snapshot.forEach((ref) => {
          routes.push('/' + ref.key)
        })
        resolve(routes)
      })
    })
  },
})
  .then(() => {
    console.log('Done.')
    process.exit(0)
  })
  .catch((e: any) => {
    console.error(e)
    process.exit(1)
  })
