import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BodyComponent } from './body/body.component';
import { OrdersComponent } from './orders/orders.component';
import { TablesComponent } from './tables/tables.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { FinalReportComponent } from './final-report/final-report.component';
import { MyordersComponent } from './myorders/myorders.component';

const routs: Routes = [{
  path: '', component: BodyComponent, children: [
    {
      path: 'orders/:table_id/:order_id/:check',
      
      component: OrdersComponent
    } ,   {
      path: 'orders/:table_id/:order_id',
      
      component: OrdersComponent
    }
    ,
    {
      path: 'tables',
      component: TablesComponent
    }
    ,
    {
      path: 'delivery',
      component: DeliveryComponent      
    }
    ,
    {
      path: 'report',
      component: FinalReportComponent      
    }
    ,
    {
      path: 'myorders',
      component: MyordersComponent      
    }
  ]
}]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routs)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
