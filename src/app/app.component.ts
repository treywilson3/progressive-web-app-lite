import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { BackendService } from './client-to-server-communication/backend-service.service';
import { IndexedDBService } from './indexedDB/indexed-db-service.service';
import { WebSocketService } from './web-socket/web-socket-service.service';
import { ServiceWorkerInitializingService } from './service-worker-compileable/service-worker-initialization';
import store from './redux-store/store';
import { addUsers, removeUsers } from './redux-store/actions/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('inputBoi') inputBoi: ElementRef;
  @ViewChild('title') title: ElementRef;
  @ViewChild('body') body: ElementRef;
  usersAddedInSession: Array<any> = [];
  savedUsers: Array<any> = [];
  indexedDbUsers: Array<any> = [];
  storeUsers: Array<any> = [];

  constructor(
    private backEndService: BackendService,
    private indexedDBService: IndexedDBService,
    private webSocketService: WebSocketService) {}

  async ngOnInit(): Promise<void> {
    const unsubscribe = store.subscribe(() => this.storeUsers = store.getState().users);

    this.indexedDBService.initializeIndexedDb(() => {
      this.indexedDBService.getUsers(users => {
        this.indexedDbUsers = users;
        store.dispatch(addUsers(users));
      });
    });
    this.savedUsers = await this.backEndService.getSavedUsers();
    store.dispatch(addUsers(this.savedUsers));
    this.webSocketService.connect();
    this.webSocketService.observeAddedUsers().subscribe(data => {
      this.usersAddedInSession = [...this.usersAddedInSession, ...data];
      store.dispatch(addUsers(data));
    });
  }

  async searchForUser(): Promise<void> {
    const apiResponse = await this.backEndService.getUser(this.inputBoi.nativeElement.value);
    this.webSocketService.emitEvent('addUser', {login: apiResponse['items'][0]['login'], htmlUrl: apiResponse['items'][0]['html_url']});
    this.indexedDBService.addUsers([apiResponse['items'][0]]);
  }

  async deleteAllUsers(): Promise<void> {
    try {
      await this.backEndService.deleteAllUsers();
      store.dispatch(removeUsers(this.savedUsers));
      this.savedUsers = [];
    } catch(error) {
      console.error('Error deleting all users', error);
    }
  }

  sendPushNotification(): void {
    ServiceWorkerInitializingService.sendPushNotification('boiiii', {body: 'got emmmm'});
  }
}
