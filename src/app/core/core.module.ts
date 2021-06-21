import { AuthenticationService } from './authentication/authentication.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,


  ],
  providers:[AuthenticationService]
})
export class CoreModule { }
