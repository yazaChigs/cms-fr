import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../../shared/config/service/crud.service';
import { Router } from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-my-queries',
  templateUrl: './my-queries.component.html',
  styleUrls: ['./my-queries.component.css']
})
export class MyQueriesComponent implements OnInit {
  myQueries: any[];
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
    { data: [8], label: 'Pending' },
    { data: [6], label: 'Resolved' }
  ];
  stats: any;


  constructor(private service: CrudService, private router: Router) { }

  ngOnInit() {
    this.getByUser();
    this.getStats();
  }

  getByUser() {
    this.service.getItem('/query/get-by-user').subscribe(
      result => {
        this.myQueries = result;
      },
      error => {
        console.log(error.error);
      }
    );
  }

  getStats() {
    this.service.getItem('/query/get-user-stats').subscribe(
      data => {
        this.barChartData[0].data = [];
        this.barChartData[1].data = [];
        this.barChartData[0].data.push(data.pending);
        this.barChartData[1].data.push(data.resolved);
      },
      error => {
        console.log(error.error);
      }
    );
  }
  editQuery(id) {
    this.router.navigate(['/queries'], { queryParams: { query: id } });
   }

}
