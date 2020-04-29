import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadFile, UploadEvent, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { CrudService } from '../../../shared/config/service/crud.service';

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.css']
})
export class UploadFileDialogComponent implements OnInit {

  labFileForm: FormGroup;
  public files: UploadFile[] = [];
  public validatedFile: any;
  public theme = localStorage.getItem('COLOR');
  constructor(private fb: FormBuilder,  private service: CrudService,
              public dialogRef: MatDialogRef<UploadFileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmitForm(value) {
    }

    public dropped(event: UploadEvent) {
      this.files = event.files;
      if (this.files.length === 1) {
        for (const droppedFile of event.files) {

          if (droppedFile.fileEntry.isFile) {
            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
            fileEntry.file((file: File) => {
              console.log(file);
              this.validatedFile = file;

            });
          } else {
            const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
            console.log(droppedFile.relativePath, fileEntry);
          }
        }
      }
    }

    public fileOver(event) {
     // console.log(event);
    }

    public fileLeave(event) {
    //  console.log(event);
    }
  submit() {
    console.log(this.validatedFile);
    this.service.uploadFile(this.validatedFile, this.data.id, '/query/upload-file').subscribe(
      result => {
        this.dialogRef.close({
          data: result.data
        });
      },
      error => {
        console.log(error);
      }
    );
  //  this.labService.uploadFile()
  }
}
