import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';
import { Router } from '@angular/router';
import { CrudService } from '../../../../shared/config/service/crud.service';

@Component({
  selector: 'app-text-messaging',
  templateUrl: './text-messaging.component.html',
  styleUrls: ['./text-messaging.component.css']
})
export class TextMessagingComponent implements OnInit {
  textMessagingForm: FormGroup;
  credits: any;
  testMessaging: any;
  util;

  constructor(private fb: FormBuilder, private snotify: SnotifyService, private router: Router, private service: CrudService) {
    this.util = new NotifyUtil(this.snotify);
  }

  ngOnInit() {
    this.createForm();
    this.getCreditInfo();
    this.getMessagingInfo();
  }

  createForm() {
    // const controls = this.roles.map(r => new FormControl(false));
    this.textMessagingForm = this.fb.group({
      id: new FormControl(),
      dateCreated: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      username: new FormControl(),
      webServiceToken: new FormControl(),
      message: new FormControl(),
      instructions: new FormControl(),
    });
  }

  populateForm(value) {
    if (value !== undefined) {
    this.textMessagingForm.get('id').setValue(value.id);
    this.textMessagingForm.get('version').setValue(value.version);
    this.textMessagingForm.get('dateCreated').setValue(value.dateCreated);
    this.textMessagingForm.get('createdById').setValue(value.createdById);
    this.textMessagingForm.controls['username'].setValue(value.username);
    this.textMessagingForm.controls['webServiceToken'].setValue(value.webServiceToken);
    this.textMessagingForm.controls['message'].setValue(value.message);
    this.textMessagingForm.controls['instructions'].setValue(value.instructions);
    }

  }

  save(value) {
    this.service.save(value,'/sms/save-message-info').subscribe(
      result => {
        this.testMessaging = result;
        this.snotify.success(
          result['message'],
          'Saved',
          this.util.getNotifyConfig()
        );
      }
      ,
      error => {
        this.snotify.error(
          error.error['message'],
          error.error.messages,
          this.util.getNotifyConfig()
        );
      }
      ,
      () => {
        this.getMessagingInfo();
        this.getCreditInfo();
      }
    );
  }

  getCreditInfo() {
    this.service.getItem('/sms/get-credit').subscribe(
      result => {
this.credits = result.credit;
      }
    );

  }
  cancel() {
    this.router.navigate(['/admin']);
  }

  getMessagingInfo() {
    this.service.getItem('/sms/get-messaging').subscribe(
      result => {
        this.testMessaging = result;
      }
      ,
      error => {
        console.log(error.error);
      }
      ,
      () => {
        this.populateForm(this.testMessaging);
      }
    );

  }

}
