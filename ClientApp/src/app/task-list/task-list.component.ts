import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { StateService } from '../services/state.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {

  Error: any;

  TaskList: any;
  TaskListCount: number;
  IsAuthoRized: boolean;

  private _sub: Subscription;

  Page: any;
  SortField: any;
  SortDirection: any;

  constructor(
    private _taskService: TaskService,
    private _route: ActivatedRoute,
    private _auth: AuthService,
    private _state: StateService,
    private _router: Router
  )
  {
    this.IsAuthoRized = _auth.isAuthorized();
  }

  ngOnInit() {
    if (this._state.CreatedTaskId) {
      this.Error = 'Создана задача с id=' + this._state.CreatedTaskId;
      this._state.CreatedTaskId = undefined;
    }
    if (this._state.UpdatedTaskId) {
      this.Error = 'Отредактирована задача с id=' + this._state.UpdatedTaskId;
      this._state.UpdatedTaskId = undefined;
    }
    this._sub = this._route.params.subscribe(params => {
      this.Page = params['page'];
      this.SortField = params['sort_field'];
      this.SortDirection = params['sort_direction'];
      this.getTaskList();
    });
  }

  getTaskList() {
    this._taskService.GetTaskList(this.Page, this.SortField, this.SortDirection).subscribe(
      data => {
        if (data.status === 'ok') {
          this.TaskList = data.message.tasks;
          this.TaskListCount = data.message.total_task_count;
          this.generatePagination();
        }
        else
          this.Error = data.message;
      },
      error => this.Error = error
    );
  }

  Pagination: number[];
  PaginationPrevious: number;
  PaginationNext: number;

  generatePagination() {
    const allPages = Math.ceil(this.TaskListCount / 3);
    const currentPage = this.Page;
    var first = 1;
    var last = 10;
    for (let i = 0; i < allPages; i += 10) {
      first = i + 1;
      last = i + 10;
      if (currentPage >= first && currentPage <= last)
        break;
    }
    const pagination = [];
    for (let i = first; i <= last; i++)
      pagination.push(i);
    this.Pagination = pagination;
    this.PaginationPrevious = first > 1 ? first - 1 : undefined;
    this.PaginationNext = last < allPages ? last + 1 : undefined;
  }

  fieldSort(field, direction) {
    this._state.TaskListReset(this.Page, field, direction);
    this._router.navigate(['/task-list', this.Page, field, direction]);
  }

  fieldShow(field, direction) {
    return !(field === this.SortField && direction === this.SortDirection);
  }

  rePage(p) {
    this._state.TaskListReset(p, this.SortField, this.SortDirection);
    this._router.navigate(['/task-list', p, this.SortField, this.SortDirection]);
  }

  editTask(task) {
    this._state.EditableTask = task;
    this._router.navigate(['/task-edit'])
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

}
