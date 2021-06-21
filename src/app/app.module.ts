import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrdersService } from './services/orders/orders.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxPrintModule } from 'ngx-print';
import {DatePipe} from '@angular/common';
import { NgbModule ,NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './modules/auth/auth.module';
import { ErrorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';
import { ApiPrefixInterceptor } from './core/interceptors/api-prefix.interceptor';
import {  HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './core/guards';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { NgZorroAntdModule, NZ_I18N, en_US, NzModalModule } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ErrorPopupComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPrintModule, 
    FormsModule,
    NzModalModule,
    NgZorroAntdModule,
    BrowserAnimationsModule,

    AuthModule,
    NgbModule.forRoot()
  ],
  providers: [
    OrdersService,AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
