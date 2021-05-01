import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { KeyValue } from '@angular/common';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private queryParams(params: KeyValue<string, string>[]) {
    const queryParams = [];
    queryParams.push('developer=' + this.state.Developer);
    params.forEach(p => {
      if (p.value)
        queryParams.push(p.key + '=' + p.value);
    });
    return '?' + queryParams.join('&');
  }

  constructor(private http: HttpClient, private auth: AuthService, private state: StateService) { }

  GetTaskList(page, sort_field, sort_direction): Observable<TaskServiceResponse> {

    const params = this.queryParams([
      { key: 'page', value: page ? String(page) : undefined },
      { key: 'sort_field', value: sort_field },
      { key: 'sort_direction', value: sort_direction }
    ]);

    const url = this.state.BaseUrl + params;
    return this.http.get<TaskServiceResponse>(url, this.httpOptions);
  }

  Login(login, password): Observable<TaskServiceResponse> {
    const params = this.queryParams([]);

    const formData = new FormData();
    formData.append('username', login);
    formData.append('password', password);

    return this.http.post<TaskServiceResponse>(this.state.BaseUrl + 'login/' + params, formData);
  }

  EditTask(id, text, status): Observable<TaskServiceResponse> {
    const params = this.queryParams([]);

    const formData = new FormData();
    formData.append('text', text);
    formData.append('status', status);
    formData.append('token', this.auth.getToken());

    return this.http.post<TaskServiceResponse>(this.state.BaseUrl + 'edit/' + id + '/' + params, formData);
  }

  AddTask(username, email, text): Observable<TaskServiceResponse> {
    const params = this.queryParams([]);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('text', text);

    return this.http.post<TaskServiceResponse>(this.state.BaseUrl + 'create/' + params, formData);
  }
}

interface TaskServiceResponse {
  status: string,
  message: any
}
