import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskService } from './services/task.service'; 
import { AuthService } from './services/auth.service';

import { AuthRouterService } from './services/auth-router.service';
import { LoginComponent } from './login/login.component';
import { TaskAddComponent } from './task-add/task-add.component';
import { LogoutComponent } from './logout/logout.component';
import { StateService } from './services/state.service';
import { HomeComponent } from './home/home.component';
import { StatusPipe } from './services/status.pipe';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptorService } from './services/loader-interceptor.service';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    TaskListComponent,
    TaskEditComponent, LoginComponent, TaskAddComponent, LogoutComponent, HomeComponent, StatusPipe, LoaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'task-list/:page/:sort_field/:sort_direction',
        component: TaskListComponent
      },
      {
        path: 'task-add',
        component: TaskAddComponent
      },
      {
        path: 'task-edit',
        component: TaskEditComponent,
        canActivate: [AuthRouterService]
      }, 
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'logout',
        component: LogoutComponent
      }
    ])
  ],
  providers: [
    TaskService,
    AuthService,
    AuthRouterService,
    StateService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
