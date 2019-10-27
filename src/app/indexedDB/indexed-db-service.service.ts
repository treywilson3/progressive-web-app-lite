
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {

  initializeIndexedDb(callback: Function) {
    if (!('indexedDB' in self)) {
      console.error('This browser doesn\'t support IndexedDB');
      return;
    }

    const request = indexedDB.open('ProgressiveWebAppLite');

    request.onerror = event => console.error('Why didn\'t you allow my web app to use IndexedDB?!');

    request.onupgradeneeded = event => {
      const database = event['target']['result'];
      if (!database.objectStoreNames.contains('githubUserInfo')) {
        const githubUserInfoOS = database.createObjectStore('githubUserInfo', {keyPath: 'id'});
        githubUserInfoOS.createIndex('login', 'login', {unique: true});
        githubUserInfoOS.createIndex('htmlUrl', 'htmlUrl', {unique: true});
      }
    };

    request.onsuccess = event => callback();
  }

  getUsers(callback: Function) {
    const request = indexedDB.open('ProgressiveWebAppLite');
    request.onsuccess = event => {
      const database = event['target']['result'];
      const transaction = database.transaction(['githubUserInfo']);
      const objectStore = transaction.objectStore('githubUserInfo');
      const request2 = objectStore.getAll();
      request2.onerror = event => console.error('Error getting all users', event);
      request2.onsuccess = event => callback(request2.result);
    };
  }

  addUsers(users: Array<any>, callback?: Function) {
    const request = indexedDB.open('ProgressiveWebAppLite');
    request.onsuccess = event => {
      const database = event['target']['result'];
      const transaction = database.transaction(['githubUserInfo'], 'readwrite');
      // Note: Older experimental implementations use the deprecated constant IDBTransaction.READ_WRITE instead of "readwrite".
      // In case you want to support such an implementation, you can write:
      // const transaction = this.database.transaction(["customers"], IDBTransaction.READ_WRITE);
      // Do something when all the data is added to the database.
      transaction.oncomplete = event => console.log('All Done');

      transaction.onerror = event => console.error('Error occurred while adding user', event);

      const objectStore = transaction.objectStore('githubUserInfo');

      users.forEach(user => {
        const request2 = objectStore.add({id: user.id, login: user.login, htmlUrl: user.html_url});
        request2.onsuccess = event => console.log('User successfully IndexedDB\'d', event);
      });
    }
  }
}
