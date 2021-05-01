import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
    const id = editableTask ? editableTask.id : undefined;
    const text = editableTask ? editableTask.text : undefined;
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

  onSubmit() {
    const controls = this.TaskForm.controls;
    const editableTask = this._state.GetTaskEditState();

    if (this.TaskForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }

    const wasChanged = controls['text'].dirty;
    const wasExecuted = controls['executed'].value;

    var status = editableTask.status;
    if (wasChanged && wasExecuted)
      status = '11';
    else if (wasExecuted)
      status = Math.max(10, status) + '';
    else if (wasChanged)
      status = '1';
    else
      status = '0';

    return this._taskService.EditTask(
      controls['id'].value,
      controls['text'].value,
      status
    ).subscribe(
      data => {
        if (data.status === 'ok') {
          this._state.UpdatedTaskId = editableTask.id;
          this._state.SetTaskEditState(undefined);
          this.router.navigate(['/']);
        }
        else this.Error = data.message;
      },
      error => {
        this.Error = error;
      }
    );
  }
}
