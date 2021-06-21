import { AuthenticationService } from './../../../core/authentication/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  passresetForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService) { }

  ngOnInit() {
    this.passresetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],


    });
  }
  get f() {
    return this.passresetForm.controls;
  }
  onSubmit() {
    if (this.passresetForm.valid) {
      this.authService.passReset(this.passresetForm.value).subscribe(res => {

      }, err => {

      })
    }
  }
}
