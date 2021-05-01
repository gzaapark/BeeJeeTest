import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  BaseUrl = 'https://uxcandy.com/~shapoval/test-task-backend/v2/';

  Developer = 'Name';

  EditableTask: any;
  CreatedTaskId: number;
  UpdatedTaskId: number;

  TaskList = {
    Page: 1,
    SortField: 'id',
    SortDirection: 'desc'
  };

  TaskListReset(page, field, direction) {
    this.TaskList.Page = page;
    this.TaskList.SortField = field;
    this.TaskList.SortDirection = direction;
  }

  constructor() { }
}
