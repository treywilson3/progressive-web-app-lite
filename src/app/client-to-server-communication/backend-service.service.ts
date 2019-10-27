import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatabaseObject } from '../interfaces/database-object.interface';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private http: HttpClient) {}

  async saveObject(object: DatabaseObject, path: string): Promise<void> {
    // Accept: I will accept the following formats from a response
    // Content type: can be used on both client and server headers. What type of data I'm sending to the server 
    // OR what type server is sending back
    const myHeaders = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const myInit: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(object)
    };

    const myRequest = new Request(`http://localhost:3000/api/${path}`, myInit);

    fetch(myRequest).then(response => {
      return response.json();
    }).then(responseJson => {
      console.log(responseJson);
    });
  }

  async getUser(userName: string): Promise<void> {
    // Accept: I will accept the following formats from a response
    // Content type: can be used on both client and server headers. What type of data I'm sending to the server 
    // OR what type server is sending back
    const myHeaders = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const myInit: RequestInit = {
      method: 'GET',
      headers: myHeaders
    };

    const myRequest = new Request(`https://api.github.com/search/users?q=${userName}`, myInit);

    const re = await fetch(myRequest).then((response) => response.json());
    return re;
  }

  async getSavedUsers(): Promise<any> {
    const myHeaders = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const myInit: RequestInit = {
      method: 'GET',
      headers: myHeaders
    };

    const myRequest = new Request(`http://localhost:3000/api/githubUserInfo`, myInit);

    return fetch(myRequest).then((response) => response.json()).then(response => response.savedUsers);
  }

  async deleteAllUsers(): Promise<any> {
    const myHeaders = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const myInit: RequestInit = {
      method: 'DELETE',
      headers: myHeaders
    };

    const myRequest = new Request(`http://localhost:3000/api/deleteAll/githubUserInfo`, myInit);

    return fetch(myRequest).then((response) => response.json());
  }
}
