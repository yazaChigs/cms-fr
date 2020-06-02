import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../../shared/config/service/crud.service';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';
import { ExcelExportService } from 'src/app/shared/shared-service/excel-export.service';
import { StorageKey } from 'src/app/util/key';
import { User } from 'src/app/shared/config/model/admin/user.model';
import { Global } from 'src/app/global';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks: any[];
  myTasks: any[];
  overdueTasks: any[];
  util;
  user: any;
  quotePdfLink: string;
  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: '',
    options: {
      jsPDF: {
        orientation: 'landscape'
      },
      pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }
  };
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
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
  public pieChartLabels: Label[] = ['Pending', 'Resolved'];
  public pieChartData: number[] = [300, 500];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)'],
    },
  ];

  constructor( private excelService: ExcelExportService, private service: CrudService,  private exportAsService: ExportAsService,
               private router: Router, private snotify: SnotifyService,  public global: Global, ) {
                this.user = JSON.parse(localStorage.getItem(StorageKey.USER));
                }


  ngOnInit() {
    this.util = new NotifyUtil(this.snotify);
    this.fetchTasks();
    this.getMyTasks();
    this.fetchOverdue();
    this.getStats();
  }

  fetchTasks() {
    this.service.getAll('/task/get-all').subscribe(
      data => {
        this.tasks = data;
      },
    error => {
     console.log(error);
    });
    }

    fetchOverdue() {
      this.service.getAll('/task/get-overdue').subscribe(
        data => {
          console.log(data);
          this.overdueTasks = data;
          if ( this.overdueTasks.length > 0) {
            this.snotify.warning(
              'There are OverDue Queries Still Pending',
              'Waring',
              this.util.getNotifyConfig()
              );
            }
        },
      error => {
       console.log(error);
      });
      }

    getMyTasks() {
      this.service.getAll('/task/get-my-tasks').subscribe(
        data => {
          this.myTasks = data;
        },
      error => {
       console.log(error);
      }
      );
    }
    getStats() {
      this.service.getItem('/task/get-assignee-stats').subscribe(
        data => {
        console.log(data);
        this.pieChartData = [];
        this.pieChartData.push(data.pending);
        this.pieChartData.push(data.resolved);
      },
        error => {
          console.log(error.error);
        }
      );
    }
     editTasks(value) {
      this.router.navigate(['/task-edit'], { queryParams: { task: value.id } }); }

      // excel

      exportAsXLSX(value, name) {
        const filtered = JSON.parse(JSON.stringify(value));
        filtered.forEach(obj => {
          delete obj.createdById;
          delete obj.uuid;
          delete obj.deleted;
          delete obj.active;
          delete obj.version;
          delete obj.branch;
          delete obj.category;
          delete obj.fullAddress;
          delete obj.dateCreated;
          delete obj.dateModified;
          delete obj.createdByName;
          delete obj.id;
        });
        this.excelService.exportAsExcelFile(filtered, name);
     }

    //  pdf

    openQuotePdf() {
      this.quotePdfLink = '/api/task/pdf';
      const url = this.global.baseUrl + this.quotePdfLink;
      window.open(url, '_blank');
    }

    pdfCallbackFn (pdf: any) {
      // example to add page number as footer to every page of pdf
      const noOfPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= noOfPages; i++) {
        pdf.setPage(i);
        pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
      }
    }

    exportAs(type: SupportedExtensions, opt?: string) {
      this.config.type = type;
      if (opt) {
        this.config.options.jsPDF.orientation = opt;
      }
      const todaysDate = new Date().toLocaleTimeString();
      this.config.elementIdOrContent = 'mytable';
      this.exportAsService.save(this.config, this.user.firstName + '_' +this.user.lastName + '_Tasks' + todaysDate).subscribe(() => {
        this.snotify.warning(
          'Opening PDF',
          'Information',
          this.util.getNotifyConfig()
          );
      });
    }


}
