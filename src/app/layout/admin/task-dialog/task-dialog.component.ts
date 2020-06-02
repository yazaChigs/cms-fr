import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from '../../../shared/config/service/admin/user.service';
import { Priority } from 'src/app/shared/enums/priority';
import { Status } from 'src/app/shared/enums/status';
import { CrudService } from '../../../shared/config/service/crud.service';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit {

  taskForm: FormGroup;
  users: any[] = [];
  status = Status;
  statusKeys: any[];
  priority = Priority;
  priorityKeys: any[];
  util;
  user = {};
  serverError: any;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;
  task: any;


  constructor(public dialogRef: MatDialogRef<TaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private service: CrudService,
              private userService: UserService, private router: Router, private snotify: SnotifyService,) {
    this.statusKeys = Object.keys(this.status).filter(Number);
    this.priorityKeys = Object.keys(this.priority).filter(Number);
   }

  ngOnInit() {
    console.log(this.data);
    this.getTask();
    // this.createForm();
    // this.getUsersByManager();
    this.util = new NotifyUtil(this.snotify);
  }

  createForm() {
    this.taskForm = this.fb.group({
      id: new FormControl(),
    timeCreated: new FormControl(),
    dateCreated: new FormControl(),
    version: new FormControl(),
    createdById: new FormControl(),
    assignee: new FormControl(this.users),
    status: new FormControl('PENDING'),
    priority: new FormControl(this.data.value.priority),
    managersNotes: new FormControl(),
    spentTime: new FormControl(),
    query: new FormControl(this.data.value),
    assigneeNotes: new FormControl(),
    actualTimeSpent: new FormControl(),
    }

    );
  }

  getTask() {
    this.service.getItem('/task/get-by-query?id=' + this.data.value.id).subscribe(
      data => {
        this.task = data;
        console.log(data);
        if (this.task !== null && this.task !== undefined) {
          this.users.push(data.assignee);
          // this.taskForm.get('assignee').setValue(this.users[0]);
        } else {
          this.getUsersByManager();
        }
      },
    error => {
     console.log(error);
    });
  }

  getUsersByManager() {
    this.userService.getUsersByManager().subscribe(
      data => {
        this.users = data;
      },
    error => {
     console.log(error);
    });
  }
  submitValues(value) {
    value.status = 'PENDING';
    value.query.status = 'WAITING';
    this.service.save(value,'/task/save').subscribe(
      result => {
        this.snotify.success(
          result.message,
          'Success',
          this.util.getNotifyConfig()
        );
        this.dialogRef.close();
        // this.router.navigate(['/admin/user/list']);
      },
      error => {
        const errorObject = error.error;
        if (error.status === 400) {
          this.serverError = errorObject;
        }
        this.snotify.error(
          errorObject.message,
          'Error',
          this.util.getNotifyConfig()
        );
      } ,
      () => {
        window.location.reload();
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.id === f2.id;
  }
}
