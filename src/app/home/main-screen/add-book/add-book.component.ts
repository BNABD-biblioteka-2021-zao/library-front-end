import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { MatDialog, matDialogAnimations, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit{

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

}
