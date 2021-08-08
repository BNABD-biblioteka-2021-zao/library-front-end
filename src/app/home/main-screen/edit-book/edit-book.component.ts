import {Component, Inject, OnInit} from '@angular/core';
import {config} from '../../../config';
import {Book} from '../../../models/book';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {

  bookPut: Book =  { } as Book;
  books: any = [];
  bookInput2Dialog: Book =  { } as Book;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getBooks().subscribe(value => {
      this.books = value;

      for (const book of this.books) {
        // tslint:disable-next-line:triple-equals
        if (book.id == this.data.bookCopyId){
          this.bookInput2Dialog = book;
        }
      }
    });
  }

  // tslint:disable-next-line:typedef
  saveEditedBook() {
    this.bookPut.id = this.data.bookCopyId;
    // @ts-ignore
    this.bookPut.title = document.getElementById('title').value;
    // @ts-ignore
    this.bookPut.genre = document.getElementById('genre').value;
    // @ts-ignore
    this.bookPut.author = document.getElementById('author').value;
    // @ts-ignore
    this.bookPut.description = document.getElementById('description').value;

    this.http.put(config.apiBookUrl,
      this.bookPut
    ).subscribe((value) => {
      console.log(value);
      location.reload();
    });
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(config.apiBookUrl + '/all');
  }
}
