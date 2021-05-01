import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  BaseUrl = 'https://uxcandy.com/~shapoval/test-task-backend/v2/';
  Developer = 'Name';
  CreatedTaskId: number;
  UpdatedTaskId: number;


  private editableTask: any;
  SetTaskEditState(editableTask: any) {
    this.editableTask = editableTask;
    this.setLocal('TASK_EDIT_STATE', this.editableTask);
  }
  GetTaskEditState() {
    return this.editableTask;
  }


  private taskListState: any;
  SetTaskListState(page: number, field: string, direction: string) {
    this.taskListState.Page = page;
    this.taskListState.SortField = field;
    this.taskListState.SortDirection = direction;
    this.setLocal('TASK_LIST_STATE', this.taskListState);
  }
  GetTaskListState() {
    return this.taskListState;
  }

  private setLocal(name, value) {
    if (!value)
      localStorage.removeItem(name);
    else
      localStorage.setItem(name, JSON.stringify(value));
  }
  private getLocal(name) {
    return JSON.parse(localStorage.getItem(name));
  }

  constructor() {
    this.taskListState = this.getLocal('TASK_LIST_STATE');
    if (!this.taskListState)
      this.taskListState = {
        Page: 1,
        SortField: 'id',
        SortDirection: 'desc'
      };
    this.editableTask = this.getLocal('TASK_EDIT_STATE');
  }
}
