import * as SQLite from 'expo-sqlite';

import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

function configureLocalStorage() {
    const storage = new Storage({
        // maximum capacity, default 1000
        size: 1000,
    
        // Use AsyncStorage for RN apps, or window.localStorage for web apps.
        // If storageBackend is not set, data will be lost after reload.
        storageBackend: AsyncStorage, // for web: window.localStorage
    
        // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
        // can be null, which means never expire.
        defaultExpires: null,
    
        // cache data in the memory. default is true.
        enableCache: false,
    
        // if data was not found in storage or expired data was found,
        // the corresponding sync method will be invoked returning
        // the latest data.
        sync: {
            // we'll talk about the details later.
        }
        });
    
        // I suggest you have one (and only one) storage instance in global scope.
    
        // for web
        // window.storage = storage;
    
        // for react native
        global.localStorage = storage;
}

export default function configureDB() {
    configureLocalStorage()
    // Make indexeddbshim happy with React Native's environment
    if (global.window.navigator.userAgent === undefined) {
      global.window.navigator = { ...global.window.navigator, userAgent: '' };
    }
    // Import after RN initilization otherwise we get an exception about process not being defined
    global.window.openDatabase = SQLite.openDatabase;
    // babel-polyfill is Needed on Android otherwise indexeddbshim complains
    // about Object.setPrototypeOf missing
    require('babel-polyfill');
    require('indexeddbshim');
    global.shimIndexedDB.__setConfig({ checkOrigin: false });
  
    const Dexie = require('dexie');
    const db = new Dexie('my_db');
  
    // schema
    db.version(1).stores({
      friends: 'name,shoeSize'
    });
  






    return db;
}