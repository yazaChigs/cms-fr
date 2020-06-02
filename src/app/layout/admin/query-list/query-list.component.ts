import { CrudService } from './../../../shared/config/service/crud.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SnotifyService, SnotifyToast } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';
import { ChangePasswordDialogComponent } from '../users/change-password-dialog/change-password-dialog.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { StorageKey } from 'src/app/util/key';
import { ExcelExportService } from 'src/app/shared/shared-service/excel-export.service';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-query-list',
  templateUrl: './query-list.component.html',
  styleUrls: ['./query-list.component.css']
})
export class QueryListComponent implements OnInit {
  public  = localStorage.getItem('COLOR');
  list: any[];
  roles: string[];
  util;
  doneList: any[];
  pendingList: any[];
  overdueList: any[];
  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'resolved',
    options: {
      jsPDF: {
        orientation: 'landscape'
      },
      pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }
  };

  constructor(private service: CrudService, private router: Router, public dialog: MatDialog,  private exportAsService: ExportAsService,
              private snotify: SnotifyService,  private excelService: ExcelExportService, ) {
    this.roles = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));

               }

  ngOnInit() {
    this.util = new NotifyUtil(this.snotify);
    this.fetchQuiries();
    this.fetchProgressQuiries();
    this.fetchCompletedQuiries();
    this.fetchOverDueQuiries();
  }

  fetchQuiries() {
  this.service.getAll('/query/get-all').subscribe(
    data => {
      console.log(data);
      this.list = data;
    },
  error => {
   console.log(error);
  });
  }
  fetchProgressQuiries() {
    this.service.getAll('/query/get-all-pending').subscribe(
      data => {
        this.pendingList = data;
      },
    error => {
     console.log(error);
    });
    }

    fetchOverDueQuiries() {
    this.service.getAll('/query/get-all-overdue').subscribe(
      data => {
        console.log(data);
        this.overdueList = data;
        if ( this.overdueList.length > 0) {
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
    fetchCompletedQuiries() {
      this.service.getAll('/query/get-all-completed').subscribe(
        data => {
          this.doneList = data;
        },
      error => {
       console.log(error);
      });
    }

    sendMessageToUser(value) {
      console.log(value);
    }


   editQuery(id) {
    this.router.navigate(['/queries'], { queryParams: { query: id } });
   }

  deleteQuery(id: number, index: number) {
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


  openDialog(value): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '850px',
      data: {value}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

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

pdfCallbackFn(pdf: any) {
  // example to add page number as footer to every page of pdf
  const noOfPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= noOfPages; i++) {
    pdf.setPage(i);
    pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30);
  }
}

exportAs(type: SupportedExtensions, id: string, opt?: string) {
  this.config.type = type;
  if (opt) {
    this.config.options.jsPDF.orientation = opt;
  }
  const todaysDate = new Date().toLocaleDateString();
  // this.config.elementIdOrContent = id;
  this.exportAsService.save(this.config, id + '_' + todaysDate).subscribe(() => {
    this.snotify.info(
      'Opening PDF, please wait...',
      'Information',
      this.util.getNotifyConfig()
      );
  });
}

createPdf(id) {
    const data = document.getElementById(id);
    html2canvas(data).then(canvas => {
        // Few necessary setting options
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
        const position = 0;
        const todaysDate = new Date().toLocaleDateString();
        const filename = id + '_' + todaysDate + '_queries.pdf';
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save(filename); // Generated PDF
    });
}

}
