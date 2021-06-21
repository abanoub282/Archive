import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './marginals/header/header.component';
import { SidebarComponent } from './marginals/sidebar/sidebar.component';
import { BodyComponent } from './body/body.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { TablesComponent } from './tables/tables.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { FinalReportComponent } from './final-report/final-report.component';
import { MyordersComponent } from './myorders/myorders.component';
import { NgZorroAntdModule, NzModalModule } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [HeaderComponent,FinalReportComponent, SidebarComponent, BodyComponent, OrdersComponent, TablesComponent, DeliveryComponent,MyordersComponent],
  imports: [
    CommonModule,

    NzModalModule,
    NgZorroAntdModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
