import * as _firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/analytics'

const firebase = (_firebase as any).default as typeof _firebase

const firebaseConfig = {
  apiKey: 'AIzaSyAFdt0Q1I55BGnoAm6e_sPD6uog9P3FxRo',
  authDomain: 'illusts-ktsn-dev-development.firebaseapp.com',
  databaseURL: 'https://illusts-ktsn-dev-development.firebaseio.com',
  projectId: 'illusts-ktsn-dev-development',
  storageBucket: 'illusts-ktsn-dev-development.appspot.com',
  messagingSenderId: '317423780761',
  appId: '1:317423780761:web:0df9a213898852af200908',
  measurementId: 'G-WZZTX7308Y',
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()

export const db = firebase.database()
