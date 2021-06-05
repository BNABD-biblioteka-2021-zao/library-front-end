import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {AddBookComponent} from './add-book/add-book.component';
import {AddCopyComponent} from './add-copy/add-copy.component';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {

  constructor(public dialog: MatDialog) {}


  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  openAddBookDialog() {
    this.dialog.open(AddBookComponent);
  }

  // tslint:disable-next-line:typedef
  openCopyBookDialog() {
    this.dialog.open(AddCopyComponent);
  }
}
