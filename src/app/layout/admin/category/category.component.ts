import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CrudService } from '../../../shared/config/service/crud.service';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { NotifyUtil } from 'src/app/util/notifyutil';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  form: FormGroup;
  util;
  serverError: any;

  constructor(private fb: FormBuilder, private service: CrudService,  private snotify: SnotifyService, private router: Router) { }

  ngOnInit() {
    this.util = new NotifyUtil(this.snotify);
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      id: new FormControl(),
    timeCreated: new FormControl(),
    dateCreated: new FormControl(),
    version: new FormControl(),
    createdById: new FormControl(),
    name: new FormControl(),
    queryType: new FormControl(),
    description: new FormControl(),
    });
  }



  submitMobile(value) {
    this.service.save(value,'/category/save-mobile').subscribe(
      result => {
        this.snotify.success(
          result.message,
          'Success',
          this.util.getNotifyConfig()
        );
        this.router.navigate(['/admin/category']);
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

  submit(value) {
    this.service.save(value,'/category/save').subscribe(
      result => {
        this.snotify.success(
          result.message,
          'Success',
          this.util.getNotifyConfig()
        );
        this.router.navigate(['/admin/category']);
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
