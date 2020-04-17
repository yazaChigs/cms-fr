import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/config/service/crud.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SnotifyService, SnotifyToast } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';
import { ChangePasswordDialogComponent } from '../users/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  list: any[];
  util;
  constructor(private service: CrudService, private router: Router, public dialog: MatDialog,
              private snotify: SnotifyService) { }

  ngOnInit() {
    this.util = new NotifyUtil(this.snotify);
    this.fetchCategories();
  }

  fetchCategories() {
  this.service.getAll('/category/get-all').subscribe(
    data => {
      console.log(data);
    this.list = data;
    },
  error => {
   console.log(error);
  });
  }


   editCategory(userToEdit: any) {
    this.service.getItem(userToEdit);
    this.router.navigate(['admin/user/edit']);
   }

  deleteCategory(id: number, index: number) {
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

   /**
   *Event Triggered by Yes Action on confirm Dialog
   */

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

  getItem(id: number) {
    localStorage.setItem('id', id.toString());
    this.addNew();
  }

  delete(id) {
    this.service.delete('/category/delete?id=' + id).subscribe(
      data => {
        console.log(data);
        this.snotify.success(data.message, 'Success', this.util.getNotifyConfig());
        // localStorage.setItem('url', '/admin/config/symptom');
        this.router.navigateByUrl('/admin/user/dummy');
      },
      error => {
        console.log(error.error);
      }
    );
  }

  addNew() {
    this.router.navigateByUrl('/admin/category-new')
  }

  

}
