import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from 'src/app/shared/enums/status';
import { Priority } from 'src/app/shared/enums/priority';
import { UserService } from '../../../shared/config/service/admin/user.service';
import { CrudService } from '../../../shared/config/service/crud.service';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy  {
  taskForm: FormGroup;
  sub: any;
  task: any = {};
  taskId: any;
  user: any[] = [];
  status = Status;
  statusKeys: any[];
  priority = Priority;
  priorityKeys: any[];
  util;
  editForm = true;
//   working = new FormControl('', [
//     Validators.required
// ]);
  serverError: any;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private userService: UserService,
              private service: CrudService, private snotify: SnotifyService, private router: Router) {
    this.statusKeys = Object.keys(this.status).filter(Number);
    this.priorityKeys = Object.keys(this.priority).filter(Number);
  }

  ngOnDestroy() {
    this.updateValues(this.taskForm.value);
  }

  ngOnInit() {
    this.getCurrentUser();
    this.createForm();
    this.util = new NotifyUtil(this.snotify);
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.taskId = +params['task'] || null;
        console.log(this.taskId);
      });
    this.getTaskData();

  }
  populateForm() {
    if (this.task !== null && this.user !== null) {
      this.taskForm.get('id').setValue(this.task.id);
      this.taskForm.get('timeCreated').setValue(this.task.timeCreated);
      this.taskForm.get('dateCreated').setValue(this.task.dateCreated);
      this.taskForm.get('version').setValue(this.task.version);
      this.taskForm.get('createdById').setValue(this.task.createdById);
      this.taskForm.get('assignee').setValue(this.user[0]);
      this.taskForm.get('priority').setValue(this.task.priority);
      this.taskForm.get('status').patchValue(this.task.status);
      this.taskForm.get('spentTime').setValue(this.task.spentTime);
      this.taskForm.get('startTime').setValue(this.task.startTime);
      this.taskForm.get('query').setValue(this.task.query);
      this.taskForm.get('actualTimeSpent').setValue(this.task.actualTimeSpent);
      this.taskForm.get('working').setValue(this.task.working);
    }
  }
  getTaskData() {
    this.service.getItem( '/task/get-item?id=' + this.taskId).subscribe(
      data => {
        this.task = data;
        if(this.user[0].id !== this.task.assignee.id) {
          this.editForm = false;
        }
        this.populateForm();
      },
    error => {
     console.log(error);
    });
  }

  editTime(value) {
    if (value === 'START') {
    if (this.taskForm.value.startTime === null || this.taskForm.value.startTime === undefined) {
        this.taskForm.get('startTime').setValue(new Date());
      } else if (this.taskForm.value.actualTimeSpent !== null) {
        this.taskForm.get('startTime').setValue(new Date());
      }
    } else if (value === 'PAUSE') {
      this.taskForm.get('actualTimeSpent').setValue(
        (
        this.taskForm.value.actualTimeSpent +
        (+(new Date()) - +(this.taskForm.value.startTime)) / 3600000 // in hours
        ).toFixed(4)
        );
    } else if (value === 'DONE') {

    }
  }

  createForm() {
    this.taskForm = this.fb.group({
      id: new FormControl(),
      timeCreated: new FormControl(),
      dateCreated: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      assignee: new FormControl(this.user),
      status: new FormControl(),
      priority: new FormControl('RESOLVED'),

      managersNotes: new FormControl(),
      working: new FormControl(),
      assigneeNotes: new FormControl(),
      spentTime: new FormControl(),
      startTime: new FormControl(),
      actualTimeSpent: new FormControl(),
      query: new FormControl(),
    });
  }
  getCurrentUser() {
    this.userService.getCurrentUser().subscribe(
      data => {
        this.user.push(data);
      },
    error => {
     console.log(error);
    });
  }
  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.id === f2.id;
  }
  submitValues(value) {
    value.status = 'RESOLVED';
    this.service.save(value, '/task/save').subscribe(
      result => {
        this.snotify.success(
          result.message,
          'Success',
          this.util.getNotifyConfig()
        );
        this.router.navigate(['/tasks']);
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
      }
    );
  }

  updateValues(value) {
    this.service.save(value, '/task/update').subscribe(
      result => {
        this.snotify.success(
          result.message,
          'Success',
          this.util.getNotifyConfig()
        );
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
      }
    );
  }
}
