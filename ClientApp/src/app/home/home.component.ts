import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-logout',
  template: `<ng-content></ng-content>`
})
export class HomeComponent implements OnInit {

  constructor(private state: StateService, private router: Router) { }

  ngOnInit() {
    this.router.navigate(['/task-list', this.state.TaskList.Page, this.state.TaskList.SortField, this.state.TaskList.SortDirection]);
  }

}
