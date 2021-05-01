import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html'
})
export class TaskAddComponent implements OnInit {

  Error: any;
  TaskForm: FormGroup;

  constructor(
    private _form: FormBuilder,
    private _task: TaskService,
    private _state: StateService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.TaskForm = this._form.group({
      text: [
        undefined,
        [Validators.required]
      ],
      email: [
        undefined,
        [Validators.required]
      ],
      username: [
        undefined,
        [Validators.required]
      ]
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.TaskForm.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  }

  cancel() {
    this._router.navigate(['/']);
  }

  onSubmit() {
    const controls = this.TaskForm.controls;

    if (this.TaskForm.invalid) {
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
      return;
    }

    return this._task.AddTask(
      controls['username'].value,
      controls['email'].value,
      controls['text'].value
    ).subscribe(
      data => {
        if (data.status === 'ok') {
          this._state.CreatedTaskId = data.message.id;
          this._state.SetTaskListState(1, 'id', 'desc');
          this._router.navigate(['/']);
        }
        else this.Error = data.message;
      },
      error => {
        this.Error = error;
      }
    );
  }
}
