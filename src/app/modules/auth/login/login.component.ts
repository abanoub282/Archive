import { AuthenticationService } from './../../../core/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private loggedIn: boolean;
  loading = false;
  submitted = false;
  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router) {
    // redirect to home if already logged in
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.router.navigate(['/']);

      }
    })

  }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]

    });
  
  }
  get f() { return this.loginForm.controls; }
  onSubmit() {
    // if (this.loginForm.invalid) {
    //   return;
    // }

    this.submitted = true;
    if (this.loginForm.valid) {
      this.loading = true;
      // console.log(this.loginForm.value)

      this.authService.login(this.loginForm.value);
    }
  }
  signInWithGoogle(): void {
  }

  signInWithFB(): void {
  }

  signOut(): void {
  }
}
