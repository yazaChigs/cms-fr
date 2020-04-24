import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';
import { StorageKey } from 'src/app/util/key';
import { BaseAdminComponent } from '../base-admin/base-admin.component';
import { UserService } from '../../../shared/config/service/admin/user.service';
import { Label, SingleDataSet, Color, BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { CrudService } from '../../../shared/config/service/crud.service';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent extends BaseAdminComponent implements OnInit {
  column = 3;
  fontSize;
  iconSize;
  roles: string[];
  users: any[] = [];

  // PolarArea
  public barChartOptions: ChartOptions = {
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
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'waiting' },
    { data: [], label: 'complete' }
  ];
  stats: any;

  // Line chart

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Expected time' },
    { data: [], label: 'Spent Time' },
    { data: [], label: 'Efficiency', yAxisID: 'y-axis-1' }
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
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
  // public lineChartColors: Color[] = [
  //   { // grey
  //     backgroundColor: 'rgba(148,159,177,0.2)',
  //     borderColor: 'rgba(148,159,177,1)',
  //     pointBackgroundColor: 'rgba(148,159,177,1)',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  //   },
  //   { // dark grey
  //     backgroundColor: 'rgba(77,83,96,0.2)',
  //     borderColor: 'rgba(77,83,96,1)',
  //     pointBackgroundColor: 'rgba(77,83,96,1)',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: 'rgba(77,83,96,1)'
  //   },
  //   { // red
  //     backgroundColor: 'rgba(255,0,0,0.3)',
  //     borderColor: 'red',
  //     pointBackgroundColor: 'rgba(148,159,177,1)',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  //   }
  // ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, ) chart: BaseChartDirective;
  
  constructor(private breakpointObserver: BreakpointObserver, public router: Router, private userService: UserService,
              private permissionsService: NgxPermissionsService, private service: CrudService)  {
                super(router);
    }

  ngOnInit() {
    // this.roles  = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));
    // this.permissionsService.loadPermissions(this.roles);
    this.getUsersByManager();
    this.fetchStats();
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
  fetchStats() {
    this.service.getItem('/admin/dashboard/get-stats').subscribe(
      data => {
        console.log(data);
        this.stats = data;
        this.barChartLabels = this.stats.userNames;
        this.barChartData[0].data =  this.stats.pendingList;
        this.barChartData[1].data =  this.stats.resolvedList;
        this.lineChartLabels = this.stats.userNames;
        this.lineChartData[0].data = this.stats.expectedTime;
        this.lineChartData[1].data = this.stats.totalSpentTime;
        this.lineChartData[2].data = this.stats.efficiency;
      },
    error => {
     console.log(error);
    });
    }
  redirect(value) {
    this.router.navigate([value]);
  }
}
