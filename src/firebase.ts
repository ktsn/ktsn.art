import * as _firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/analytics'

const firebase = (_firebase as any).default as typeof _firebase

// TODO: move the config to env vars
const firebaseConfig = __DEV__
  ? {
      apiKey: 'AIzaSyAFdt0Q1I55BGnoAm6e_sPD6uog9P3FxRo',
      authDomain: 'illusts-ktsn-dev-development.firebaseapp.com',
      databaseURL: 'https://illusts-ktsn-dev-development.firebaseio.com',
      projectId: 'illusts-ktsn-dev-development',
      storageBucket: 'illusts-ktsn-dev-development.appspot.com',
      messagingSenderId: '317423780761',
      appId: '1:317423780761:web:0df9a213898852af200908',
      measurementId: 'G-WZZTX7308Y',
    }
  : {
      apiKey: 'AIzaSyDY9ZeVVWzdIPQL12vKAN_SxWsazxo63SU',
      authDomain: 'illust-ktsn-dev.firebaseapp.com',
      databaseURL: 'https://illust-ktsn-dev.firebaseio.com',
      projectId: 'illust-ktsn-dev',
      storageBucket: 'illust-ktsn-dev.appspot.com',
      messagingSenderId: '182006812020',
      appId: '1:182006812020:web:d39a3fba26465f39c9f021',
      measurementId: 'G-1JNZFCG5YL',
    }

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}
if (firebase.analytics) {
  firebase.analytics()
}

export const db = firebase.database()
