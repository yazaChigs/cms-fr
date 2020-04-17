import { CrudService } from './../../../shared/config/service/crud.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SnotifyService, SnotifyToast } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';
import { ChangePasswordDialogComponent } from '../users/change-password-dialog/change-password-dialog.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { StorageKey } from 'src/app/util/key';

@Component({
  selector: 'app-query-list',
  templateUrl: './query-list.component.html',
  styleUrls: ['./query-list.component.css']
})
export class QueryListComponent implements OnInit {
  public  = localStorage.getItem('COLOR');
  list: any[];
  roles: string[];
  util;
  doneList: any[];
  pendingList: any[];
  constructor(private service: CrudService, private router: Router, public dialog: MatDialog,
              private snotify: SnotifyService, ) {
    this.roles = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));

               }

  ngOnInit() {
    this.util = new NotifyUtil(this.snotify);
    this.fetchQuiries();
    this.fetchProgressQuiries();
    this.fetchCompletedQuiries();
  }

  fetchQuiries() {
  this.service.getAll('/query/get-all').subscribe(
    data => {
      console.log(data);
      this.list = data;
    },
  error => {
   console.log(error);
  });
  }
  fetchProgressQuiries() {
    this.service.getAll('/query/get-all-pending').subscribe(
      data => {
        this.pendingList = data;
      },
    error => {
     console.log(error);
    });
    }
    fetchCompletedQuiries() {
      this.service.getAll('/query/get-all-completed').subscribe(
        data => {
          console.log(data);
          this.doneList = data;
        },
      error => {
       console.log(error);
      });
    }

    sendMessageToUser(value) {
      console.log(value);
    }


   editQuery(id) {
    this.router.navigate(['/queries'], { queryParams: { query: id } });
    // this.service.getItem(id).subscribe
    // this.router.navigate(['queries']);
   }

  deleteQuery(id: number, index: number) {
    const noAction = (toast: SnotifyToast) => {
      this.snotify.remove(toast.id);
    };
    const yesAction = (toast: SnotifyToast) => {
        this.deleteItem(id, index);
    };
    this.snotify.confirm('Are you sure?', 'Delete Action', {
      ...this.util.getNotifyConfigPrompt(),
      buttons: [
        {text: 'Yes', action: yesAction, bold: true },
        {text: 'No', action: noAction },
      ],
    });
  }

  deleteItem(id, index: number) {
    this.service.delete(id).subscribe(
      result => {
        this.list = this.list.filter(item => item.id !== id);
        this.snotify.success(result.message, 'Success', this.util.getNotifyConfig());
      },
      error => {
        console.log(error);
      });
  }


  openDialog(value): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '850px',
      data: {value}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
