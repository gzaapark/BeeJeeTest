import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private TASK_TOKEN = 'TASK_TOKEN';
  private TASK_TOKEN_DATE = 'TASK_TOKEN_DATE';

  constructor() { }

  getToken() {
    var datestring = localStorage.getItem(this.TASK_TOKEN_DATE);
    var token = localStorage.getItem(this.TASK_TOKEN);
    if (datestring && token) {
      var date = datestring ? new Date(datestring) : undefined;
      var now = new Date();
      var diff = Math.abs(now.getTime() - date.getTime()) / 1000 / 60 / 60;
      if (diff > 24) {
        this.removeToken();
        return undefined;
      }
      return token;
    }
    return undefined;
  }

  setToken(token: string) {
    localStorage.setItem(this.TASK_TOKEN, token);
    localStorage.setItem(this.TASK_TOKEN_DATE, formatDate(new Date(), 'yyyy-MM-ddThh:mm:ss', 'en'));
  }

  removeToken() {
    localStorage.setItem(this.TASK_TOKEN, undefined);
    localStorage.setItem(this.TASK_TOKEN_DATE, undefined);
    localStorage.removeItem(this.TASK_TOKEN);
    localStorage.removeItem(this.TASK_TOKEN_DATE);
  }

  isAuthorized() {
    const token = this.getToken();
    return token ? true : false;
  }

}
