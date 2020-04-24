
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
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
import * as Chart from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  // encapsulation: ViewEncapsulation.Native,
  selector: 'app-dashboard',
  moduleId: module.id,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dashForm: FormGroup;
  color = 'blue';
  roles: string[];
  util;
  list: any[];
  user: any;
  stats: any = {};
  randomColor1 = '#' + ((1 << 24) * Math.random() | 0).toString(16);
  randomColor2 = '#' + ((1 << 24) * Math.random() | 0).toString(16);
  randomColor3 = '#' + ((1 << 24) * Math.random() | 0).toString(16);
  randomColor4 = '#' + ((1 << 24) * Math.random() | 0).toString(16);

  // pie
  public pieChartOptions: Chart.ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['Waiting', 'Pending', 'Resolved'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: Chart.ChartType = 'pie';
  public pieChartLegend = false;
  public pieChartPlugins = [pluginDataLabels];

  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  // Bar chart
  public barChartOptions: Chart.ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  // public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartLabels: Label[] = [];
  public barChartType: Chart.ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: Chart.ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  // line chart

  public lineChartData: Chart.ChartDataSets[] = [
    { data: [ 56, 55, 4], label: 'Series A' },
    { data: [65, 59, 80, 23, 56, 36, 40], label: 'Series D' },
    // { data: [65, 59, 34, 81, 56, 55, 8], label: 'Series E' },
    // { data: [65, 23, 80, 81, 56, 88, 40], label: 'Series F' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    // { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Series C', yAxisID: 'y-axis-1' }
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: (Chart.ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;



  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private dataManService: DataManagementService,
              private fb: FormBuilder, private availableStockService: AvailableStockService, private branchService: BranchService,
              private dashService: DashboardService, private service: CrudService, private snotify: SnotifyService) { }
  redirect(value) {
    this.router.navigate([value]);
  }


  ngOnInit(): void {
    this.fetchQuiries()
    this.fetchStats();
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

    fetchStats() {
      this.service.getItem('/dashboard/get-stats').subscribe(
        data => {
          console.log(data);
          this.stats = data;
          this.barChartLabels = this.stats.mobileQueriesNames;
          this.barChartData[0].data =  this.stats.cardQueries;
          this.pieChartData = [this.stats.waiting, this.stats.pending, this.stats.resolved];
          console.log(this.barChartData);
        },
      error => {
       console.log(error);
      });
      }

    editQuery(userToEdit: any) {
      this.service.getItem(userToEdit);
      this.router.navigate(['queries']);
     }

    //  pie

}
