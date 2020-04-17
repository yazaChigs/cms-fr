
import { Component, OnInit } from '@angular/core';
import { map, first } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { StorageKey } from 'src/app/util/key';
// import { UserRoleService } from 'src/app/shared/config/service/admin/user-role.service';
import { DataManagementService } from '../../shared/config/service/admin/dataManagement.service';
import { BranchDailyMinimalCapacity } from '../../shared/config/model/admin/branch-daily-minimal-capacity.model';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { NoDaysRequiremets } from '../../shared/config/model/admin/no-days-requirements.model';
import { AvailableStockService } from '../../shared/config/service/available-stock.service';
import { resultMemoize } from '@ngrx/store';
import { StockAvailable } from 'src/app/shared/config/model/stock-available.model';
import { QuarantinedStockService } from '../../shared/config/service/quarantined-stock.service';
import { StockQuarantined } from '../../shared/config/model/Stock-quarantined.model';
import { BranchService } from '../../shared/config/service/admin/branch.service';
import { Branch } from 'src/app/shared/config/model/admin/branch.model';
import { DashboardService } from 'src/app/shared/config/service/dashboard.service';
import { MatDatepickerInputEvent } from '@angular/material';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';
import { BloodGroupsDistributionsComponent } from './charts/blood-groups-distributions/blood-groups-distributions.component';
import { constructor } from 'jspdf';
import { CrudService } from 'src/app/shared/config/service/crud.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // date = new FormControl(new Date().toLocaleDateString());
  /** Based on the screen size, switch from standard to one column per row */
  column = 2;
  fontSize;
  iconSize;
  dashForm: FormGroup;
  color = 'blue';
  branchId: number;
  allBranches: Branch[] = [];
  formFilter: any = { branchName: '' };
  selectedBranches: any[] = [];
  branchesInfo: any = {};
  yesterdayDate: Date;
  roles: string[];
  util;
  collections = 0;
  firstRun = true;
  grayFields = true;
  list: any[];
  selectedCheckBox = [];
  bloodGroupContributions: BloodGroupsDistributionsComponent = new BloodGroupsDistributionsComponent();
  user: any;


  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private dataManService: DataManagementService,
              private fb: FormBuilder, private availableStockService: AvailableStockService, private branchService: BranchService,
              private dashService: DashboardService, private service: CrudService, private snotify: SnotifyService) { }
  redirect(value) {
    this.router.navigate([value]);
  }


  ngOnInit(): void {
    this.fetchQuiries()
  //   this.branchId = Number(localStorage.getItem('BRANCH_ID'));
  //   this.setYesterdayDate();
  //   this.createFormBloodStockManagementAnalysisForm();
  //   // this.getNoDaysRequrements();
  //   this.getAvailableStockForm();
  //   this.getQuarantinedStock();
  //   this.getBranchDailyMinimalCapacity();
  //   this.createFilterDataForm();
  //   this.getAllUnSubmitedQuarantineStock();
  //   this.getAllUnSubmitedAvailableStock();
  //   this.util = new NotifyUtil(this.snotify);

    // this.user = JSON.parse(localStorage.getItem('USER'));
  //   this.roles = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));
  // //   if (this.roles.includes('ROLE_USER') || this.roles.includes('ROLE_SUPERVISOR')) {
  // //     this.getUserBranch();
  // //   } else {
  //   this.getAllBranches();
  // }
  }
  fetchQuiries() {
    this.service.getAll('/query/get-all').subscribe(
      data => {
        this.list = data;
      },
    error => {
     console.log(error);
    });
    }
    editQuery(userToEdit: any) {
      this.service.getItem(userToEdit);
      this.router.navigate(['queries']);
     }

}
