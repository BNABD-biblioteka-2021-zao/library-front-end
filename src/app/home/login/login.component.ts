import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserPrincipal} from '../../models/userprincipal';
import {Router} from '@angular/router';
import { AuthService } from '../../security/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  userP: UserPrincipal =  { } as UserPrincipal;

  /*
  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private router: Router) {
    this.form = this.formBuilder.group({
      username: '',
      password: ''
    });
  }*/
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.form = this.formBuilder.group({
      username: '',
      password: ''
    });
  }

  ngOnInit(): void {
  }

  onLogin(): void {
    this.authService.login(
      this.form.getRawValue()
    )
      .subscribe(success => {
        if (success){
          this.router.navigate(['/main']);
        }
      });
  }
/*
  onLogin(): void {
    console.log(this.form.getRawValue());
    this.http.post(this.baseUrl + '/login', this.form.getRawValue(), )
      .subscribe(response => {
        console.log(response);
        this.userP = (response as UserPrincipal);
        console.log(this.userP);
        sessionStorage.setItem('accessToken', this.userP.access_token);
        sessionStorage.setItem('refreshToken', this.userP.refresh_token);
        this.router.navigate(['/home']);
      });
  }*/
}
