import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../../shared/config/service/crud.service';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks: any[];
  myTasks: any[];
  overdueTasks: any[];
  util;

  constructor(private service: CrudService, private router: Router, private snotify: SnotifyService) { }


  ngOnInit() {
    this.util = new NotifyUtil(this.snotify);
    this.fetchTasks();
    this.getMyTasks();
    this.fetchOverdue();
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

    fetchOverdue() {
      this.service.getAll('/task/get-overdue').subscribe(
        data => {
          console.log(data);
          this.overdueTasks = data;
          if ( this.overdueTasks.length > 0) {
            this.snotify.warning(
              'There are OverDue Queries Still Pending',
              'Waring',
              this.util.getNotifyConfig()
              );
            }
        },
      error => {
       console.log(error);
      });
      }

    getMyTasks() {
      this.service.getAll('/task/get-my-tasks').subscribe(
        data => {
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
