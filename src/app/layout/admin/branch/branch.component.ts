import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BranchService } from '../../../shared/config/service/admin/branch.service';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';
import { Router } from '@angular/router';
import { from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Branch } from 'src/app/shared/config/model/admin/branch.model';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
  branchForm: FormGroup;
  util;
  branchToEdit: Branch;
  submitted = false;

  constructor(private router: Router, private fb: FormBuilder, private service: BranchService,  private snotify: SnotifyService) { }

  ngOnInit() {
    this.createForms();
    this.util = new NotifyUtil(this.snotify);
    this.getBranchToEdit();
  }

    createForms() {
      this.branchForm = this.fb.group({
        id: new FormControl(),
      timeCreated: new FormControl(),
      dateCreated: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      branchName: new FormControl(),
      address: new FormControl(),
      phoneNumber: new FormControl(),
      officePhone: new FormControl(),
      });
    }
    populateForm(branchToEdit: Branch) {
      this.branchForm.get('id').setValue(this.branchToEdit.id);
      this.branchForm.get('version').setValue(this.branchToEdit.version);
      this.branchForm.get('dateCreated').setValue(this.branchToEdit.dateCreated);
      this.branchForm.get('createdById').setValue(this.branchToEdit.createdById);
      this.branchForm.get('branchName').setValue(this.branchToEdit.branchName);
      this.branchForm.get('address').setValue(this.branchToEdit.address);
      this.branchForm.get('phoneNumber').setValue(this.branchToEdit.phoneNumber);
      this.branchForm.get('officePhone').setValue(this.branchToEdit.officePhone);
    }
getBranchToEdit() {
  this.service.getBranch().subscribe(
    branch => {
    this.branchToEdit = branch;
    }, error => {
      console.log(error.error);
    }
  );
  this.populateForm(this.branchToEdit);
}
get f() { return this.branchForm.controls; }

    submitValues(value) {
      this.submitted = true;
      if (this.branchForm.invalid) {
      return;
    }
      this.service.save(value).subscribe(
        result => {
          this.snotify.success(
            result.message,
            'Success',
            this.util.getNotifyConfig()
          );
          this.router.navigate(['/admin/branch-list']);
        },
        error => {
          this.snotify.error(
            'Error Encountered',
            'Error',
            this.util.getNotifyConfig()
          );
        }
      );
  }

}
