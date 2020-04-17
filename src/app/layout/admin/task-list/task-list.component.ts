import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../../shared/config/service/crud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks: any[];
  myTasks: any[];

  constructor(private service: CrudService, private router: Router) { }


  ngOnInit() {
    this.fetchTasks();
    this.getMyTasks();
  }

  fetchTasks() {
    this.service.getAll('/task/get-all').subscribe(
      data => {
        this.tasks = data;
      },
    error => {
     console.log(error);
    });
    }

    getMyTasks() {
      this.service.getAll('/task/get-my-tasks').subscribe(
        data => {
          console.log(data);
          this.myTasks = data;
        },
      error => {
       console.log(error);
      }
      );
    }
     editTasks(value) {
      this.router.navigate(['/task-edit'], { queryParams: { task: value.id } }) }
}
