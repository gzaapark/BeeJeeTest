import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  Error: any;
  LoginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _taskService: TaskService,
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.LoginForm = this.fb.group({
      login: [undefined, [
        Validators.required
      ]],
      password: [undefined, [
        Validators.required
      ]]
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.LoginForm.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  }

  onSubmit() {
    const controls = this.LoginForm.controls;

    if (this.LoginForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }

    return this._taskService.Login(controls['login'].value, controls['password'].value)
      .subscribe(
        data => {
          if (data.status === 'ok') {
            this._authService.setToken(data.message.token);
            this._router.navigate(['/']);
          }
          else
            this.Error = data.message;
        },
        error => {
          this.Error = error;
        }
      );
  }
}
