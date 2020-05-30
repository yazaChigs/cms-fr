import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Branch } from 'src/app/shared/config/model/admin/branch.model';
import { BranchService } from '../../../shared/config/service/admin/branch.service';
import { CrudService } from 'src/app/shared/config/service/crud.service';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';
import { Router, ActivatedRoute } from '@angular/router';
import { Status } from 'src/app/shared/enums/status';
import { Gender } from 'src/app/shared/enums/gender';
import { Priority } from 'src/app/shared/enums/priority';
import { MatDialog } from '@angular/material';
import { UploadFileDialogComponent } from '../upload-file-dialog/upload-file-dialog.component';
import { Global } from 'src/app/global';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {

  newQueryForm: FormGroup;
  util;
  branches: Branch[] = [];
  serverError: any;
  categories: any = []
  status = Status;
  statusKeys: any[];
  priority = Priority;
  priorityKeys: any[];
  filePath: '';
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;
  sub: any;
  queryId: number;
  selectedQuery: any = {};
  user: any;

  constructor( private fb: FormBuilder, private snotify: SnotifyService, private service: CrudService,
               private router: Router,  private route: ActivatedRoute, private branchService: BranchService,
               public dialog: MatDialog , public global: Global ) {
                this.user = JSON.parse(localStorage.getItem('USER'));
                this.sub = this.route
                .queryParams
                .subscribe(params => {
                  // Defaults to 0 if no query param provided.
                  this.queryId = +params['query'] || null;
                });
                this.statusKeys = Object.keys(this.status).filter(Number);
                this.priorityKeys = Object.keys(this.priority).filter(Number);

                }

  ngOnInit() {
    this.createForm();
    this.fetchBranches();
    // this.fetchCategories();
    this.util = new NotifyUtil(this.snotify);
    if(this.queryId!== null) {
      this.getQuery();
    }
  }
  createForm() {
    this.newQueryForm = this.fb.group({
    id: new FormControl(),
    timeCreated: new FormControl(),
    dateCreated: new FormControl(),
    version: new FormControl(),
    createdById: new FormControl(),
    fullname: new FormControl(),
    phone: new FormControl('',
    Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]{10}$')
    ])),
    priority: new FormControl(),
    status: new FormControl({value: 'WAITING'}),
    accountNumber: new FormControl(),
    branch: new FormControl({
      value: this.user.branch,
      // disabled: true
    }),
    category: new FormControl(),
    queryType: new FormControl(),
    stanNo: new FormControl('',
    Validators.compose([
      Validators.required,
      Validators.pattern('^[0-9]{6}$')
    ])),
    complaintDetails: new FormControl(),
    description: new FormControl(),
    phoneHome: new FormControl(),
    amount: new FormControl(),
    actionTaken: new FormControl(),
    phoneBusiness: new FormControl(),
    fileName: new FormControl(),
    });
  }

  onSubmitUserDetails(value) {
    // console.log(value);
    value.status = 'WAITING';
    this.service.save(value, '/query/save').subscribe(
      result => {
        this.snotify.success(
          result.message,
          'Success',
          this.util.getNotifyConfig()
        );
        // this.router.navigate(['/query-list']);
        this.populateForm(result.data);
        this.openUploadDialog(result.data.id);
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
  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.id === f2.id;
  }

  fileOk() {
    this.snotify.info(
      'getting file, please wait...',
      'Information',
      this.util.getNotifyConfig()
    );
  }

  fetchBranches() {
    // this.branchService.getAll().subscribe(
    //   result => {
    //   this.branches = result;
    //     },
    //     error => {
    //       console.log(error);
    //     });
    this.branches.push(this.user.branch);
    this.newQueryForm.get('branch').patchValue(this.user.branch);
    }

    fetchCategories(value) {
      this.service.getAll('/category/get-all-by-type?type=' + value).subscribe(
        data => {
          this.categories = data;
        },
      error => {
       console.log(error);
      });
      }

      populateForm(value) {
        if (value !== null && value !== undefined) {
          if (value.fileInfos.length !== 0 && value.fileInfos!== null && value.fileInfos !== undefined) {
            this.filePath = value.fileInfos[0].path;
          }
          this.newQueryForm.get('id').setValue(value.id);
          this.newQueryForm.get('timeCreated').setValue(value.timeCreated);
          this.newQueryForm.get('dateCreated').setValue(value.dateCreated);
          this.newQueryForm.get('version').setValue(value.version);
          this.newQueryForm.get('createdById').setValue(value.createdById);
          this.newQueryForm.get('fullname').setValue(value.fullname);
          this.newQueryForm.get('phone').setValue(value.phone);
          this.newQueryForm.get('priority').setValue(value.priority);
          this.newQueryForm.get('status').setValue(value.status);
          this.newQueryForm.get('accountNumber').setValue(value.accountNumber);
          this.newQueryForm.get('branch').setValue(this.user.branch);
          this.newQueryForm.get('amount').setValue(this.user.amount);
          this.newQueryForm.get('category').setValue(value.category);
          this.newQueryForm.get('queryType').setValue(value.queryType);
          this.newQueryForm.get('stanNo').setValue(value.stanNo);
          this.newQueryForm.get('complaintDetails').setValue(value.complaintDetails);
          this.newQueryForm.get('description').setValue(value.description);
          this.newQueryForm.get('phoneHome').setValue(value.phoneHome);
          this.newQueryForm.get('phoneBusiness').setValue(value.phoneBusiness);
          this.newQueryForm.get('fileName').setValue(value.fileName);
        }
      }


      getQuery() {
        this.service.getItem('/query/get-item?id=' + this.queryId).subscribe(
          data => {
            console.log(data);
            this.selectedQuery = data;
            this.populateForm(this.selectedQuery);
          },
        error => {
         console.log(error);
        });
      }

      openUploadDialog(id): void {
        const dialogRef = this.dialog.open(UploadFileDialogComponent, {
          width: '850px',
          data: {id}
        });
        dialogRef.afterClosed().subscribe(result => {
          // console.log('The dialog was closed');
          // // this.animal = result;
          this.router.navigate(['/query-list']);
        });
      }
}
