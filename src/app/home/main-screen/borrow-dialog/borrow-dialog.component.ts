import {Component, Inject, Input, OnInit} from '@angular/core';
import { MainScreenComponent } from '../main-screen.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {config} from '../../../config';
import {Borrowings} from '../../../models/borrowings';
import {Observable} from 'rxjs';
import {User} from '../../../models/user';
import {HttpClient} from '@angular/common/http';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Book} from '../../../models/book';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-borrow-dialog',
  templateUrl: './borrow-dialog.component.html',
  styleUrls: ['./borrow-dialog.component.css']
})
export class BorrowDialogComponent implements OnInit {

  borrowing: Borrowings =  { } as Borrowings;
  users: any = [];
  userName: any;
  usersCtrl = new FormControl();
  endTime: Date;
  end: any;
  pipe = new DatePipe('en-US');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
  ) {
    this.users = this.usersCtrl.valueChanges
      .pipe(
        startWith(''),
        map(users => users ? this._filterStates(users) : this.users.slice())
      );
  }

  ngOnInit(): void {
    this.getAllUsers().subscribe(value => {
      // @ts-ignore
      this.users = value;
      console.log(this.users);
    });

    this.endTime = new Date();
    this.endTime.setDate( this.endTime.getDate() + 30 );
    this.end = this.endTime.toString();
    this.end = this.pipe.transform(this.end , 'yyyy-MM-dd');
  }

  // tslint:disable-next-line:typedef
  onSaveBorrow() {
    // @ts-ignore
    this.userName = document.getElementById('userName').value;
    console.log(this.userName);
    for (const user of this.users) {
      // tslint:disable-next-line:triple-equals
      if (user.name == this.userName) {
        // @ts-ignore
        this.borrowing.user = user;
        // console.log('User', this.borrowing.user);
      }
    }

    this.borrowing.bookCopy = this.data.bookCopyId;
    this.borrowing.borrowEndTime = this.end;

    this.http.post(config.apiBorrowing + '/add',
      this.borrowing
    ).subscribe((value) => {
      console.log(value);
      location.reload();
    });
  }

  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(config.apiUser + '/all');
  }


  private _filterStates(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.users.filter(users => users.name.toLowerCase().includes(filterValue));
  }
}
