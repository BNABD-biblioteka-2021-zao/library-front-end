import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  baseUrl =  '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: '',
      name: '',
      password: ''
    });
  }

  ngOnInit(): void {
  }

  submit(): void {
    console.log(this.form.getRawValue());

    this.http.post(this.baseUrl, this.form.getRawValue())
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/login']);
      });
  }
}
