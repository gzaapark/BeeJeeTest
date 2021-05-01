import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  template: `<ng-content></ng-content>`
})
export class LogoutComponent implements OnInit {

  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
    this._auth.removeToken();
    this._router.navigate(['/']);
  }

}
