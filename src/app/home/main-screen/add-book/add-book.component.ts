import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { MatDialog, matDialogAnimations, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Book} from '../../../models/book';
import { config } from 'src/app/config';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit{
  book: Book =  { } as Book;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  onAddBook() {
    // @ts-ignore
    this.book.author = document.getElementById('author').value;
    // @ts-ignore
    this.book.description = document.getElementById('description').value;
    // @ts-ignore
    this.book.genre = document.getElementById('genre').value;
    // @ts-ignore
    this.book.title = document.getElementById('title').value;

    console.log(this.book);

    this.http.post(config.apiBookUrl,
      this.book
    ).subscribe((value) => {
      console.log(value);
      location.reload();
    });
  }
}
