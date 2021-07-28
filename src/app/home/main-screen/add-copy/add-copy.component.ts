import { Component, OnInit } from '@angular/core';
import {Book} from '../../../models/book';
import {BookCopy} from '../../../models/bookcopy';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {config} from '../../../config';

@Component({
  selector: 'app-add-copy',
  templateUrl: './add-copy.component.html',
  styleUrls: ['./add-copy.component.css']
})
export class AddCopyComponent implements OnInit {
  bookcopy: BookCopy =  { } as BookCopy;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog
  ){ }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  onAddBookCopy() {
    // @ts-ignore
    this.bookcopy.isbn = document.getElementById('isbn').value;
    // @ts-ignore
    this.bookcopy.page_amount = document.getElementById('page_amount').value;
    // @ts-ignore
    this.bookcopy.publish_date = document.getElementById('publish_date').value;
    // @ts-ignore
    this.bookcopy.publisher = document.getElementById('publisher').value;

    console.log(this.bookcopy);

    this.http.post(config.apiBookUrl,
      this.bookcopy
    ).subscribe((value) => {
      console.log(value);
      location.reload();
    });
  }
}
