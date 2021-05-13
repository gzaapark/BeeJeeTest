import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html'
})
export class TaskEditComponent implements OnInit {

  Error: any;
  TaskForm: FormGroup;

  constructor(
    private router: Router,
    private _route: ActivatedRoute,
    private _taskService: TaskService,
    private _state: StateService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    const editableTask = this._state.GetTaskEditState();
    const id = editableTask ? editableTask.id : null;
    const text = editableTask ? editableTask.text : null;
    const executed = editableTask && (editableTask.status === 10 || editableTask.status === 11);
    this.TaskForm = this.fb.group({
      id: [
        id
      ],
      text: [
        text,
        [Validators.required]
      ],
      executed: [
        executed
      ]
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.TaskForm.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  }

  cancel() {
    this.router.navigate(['/']);
  }

  private updatedTask(t) {
    if(t) this._state.UpdatedTaskId = t.id;
    this._state.SetTaskEditState(undefined);
    this.router.navigate(['/']);
  }

  private nextStatus(wasChanged, wasExecuted, status) {
    if (!wasChanged && !wasExecuted) {
      if (status == 10)
        return 0;
      else if (status == 11)
        return 1;
      else
        return status;
    }
    else if (!wasChanged && wasExecuted) {
      if (status == 0)
        return 10;
      else if (status == 1)
        return 11;
      else
        return status;
    }
    else if (wasChanged && !wasExecuted) {
      return 1;
    }
    else if (wasChanged && wasExecuted) {
      return 11;
    }
    return status;
  }

  onSubmit() {
    if (this.TaskForm.dirty) {
      const controls = this.TaskForm.controls;
      const editableTask = this._state.GetTaskEditState();

      if (this.TaskForm.invalid) {
        Object.keys(controls)
          .forEach(controlName => controls[controlName].markAsTouched());
        return;
      }

      const wasChanged = controls['text'].dirty;
      const wasExecuted = controls['executed'].value;

      const status = this.nextStatus(wasChanged, wasExecuted, editableTask.status);

      return this._taskService.EditTask(
        controls['id'].value,
        controls['text'].value,
        status
      ).subscribe(
        data => {
          if (data.status === 'ok')
            this.updatedTask(editableTask);
          else
            this.Error = data.message;
        },
        error => {
          this.Error = error;
        }
      );
    }
    else {
      this.updatedTask(undefined);
    }
  }
}
