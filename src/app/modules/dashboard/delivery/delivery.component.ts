import { Component, OnInit, ViewChild  } from '@angular/core';
import { OrdersService } from 'src/app/services/orders/orders.service';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import * as qz from 'qz-tray';
import { sha256 } from 'js-sha256';
import { config } from 'rxjs';
import * as shajs from 'sha.js';
import { OrdersComponent } from '../orders/orders.component';
import { DatePipe } from '@angular/common';
import {Router} from "@angular/router";

@Component({
  selector: 'app-orders',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],  providers:[DatePipe]
})
export class DeliveryComponent extends OrdersComponent implements OnInit {
  clientName;
  clientPhone;
  clientAddress;

  // variables for check client

  clientArray: any[] = [];
  clientId;
clicked;
  // variables for client info

  clientExistName;
  clientExistAddress;
  clientExistPhone;
  constructor(public route: ActivatedRoute, public service: OrdersService,public datePipe: DatePipe,public router: Router) {
    super(route,service,datePipe,router)
    qz.api.setSha256Type(data => sha256(data));
    qz.api.setPromiseType(resolver => new Promise(resolver));

    this.service.getLastNotCompeleteOrder(localStorage.getItem("branch")).subscribe(respone => {

if (respone.query == null) {
    this.addOrders()
   }else {
     this.order_id = respone.query.id
     console.log(this.order_id)
     this.service.checkOrderCompletesById(this.order_id).subscribe(respone => {
       if (respone.query[0].orderdetails != null ) {
      for (let z = 0; z <= respone.query[0].orderdetails.length - 1; z++) {
        this.addItems.push(respone.query[0].orderdetails[z].item)
        this.itemTax = this.addItems[z].tax.percentage;
        this.addItems[z].totalamount = respone.query[0].orderdetails[z].itemamount
        if ( respone.query[0].orderdetails[z].itemtotal == 0
          ){
            this.addItems[z].price = 0

          }else {
            this.itemPrice += respone.query[0].orderdetails[z].itemtotal;
            if ( this.addItems[z].tax.percentage > 0){
              console.log(this.addItems[z])

              this.VAT += Math.round(((respone.query[0].orderdetails[z].itemtotal * this.itemTax) / 100) * 100) / 100;

            }
          }
      }
             
            this.itemTotal = Math.round((this.itemPrice + this.VAT + this.serviceTax) * 100) / 100;
    }
    })
   }
  })
   this.delivry = 1
  }
  // set client name
  addOrders(){
   var  orderArray = {
      typeorder: 1,
      total: 0,
      user_id: 1,
      waiter_id: 1,
      table_id: 0,  
      branch_id :localStorage.getItem("branch")

     
    };
  
    this.service.addOrder(orderArray)
    .subscribe(respone => {
     this.order_id = respone.data.id
     localStorage.setItem('orderid',this.order_id)
    });
  }
  setClientName(n){
    this.clientName = n.value;
  }

  // set client phone

  setClientPhone(p){
    this.clientPhone = p.value;
  }

  // set client address

  setClientAddress(d){
    this.clientAddress = d.value;
  }

  addClient(clientArr) {

    clientArr = {
      firstname : this.clientName,
      mobile : this.clientPhone,
      address : this.clientAddress,
      username : this.clientName,
      branch_id :localStorage.getItem("branch"),
      password : '123456',
      email : 'a@a.com',
      email_verified : 1,
      active : 1
    }

    console.log(JSON.stringify(clientArr));

    this.service.addClient(clientArr)
      .subscribe(response => {
        console.log(response);
        if (response.data != null ) {
          alert('تم اضافة العميل بنجاح')

                }else {
alert('موجود من قبل')
        }
      },Error => {alert('موجود من قبل')
    });

  }
   lastvalue;
  ServiceChanged($event){
if (this.lastvalue > 0 ){
this.itemTotal = (this.itemTotal - parseInt(this.lastvalue))
}
this.lastvalue = $event.target.value
this.serviceTax = parseInt($event.target.value)
this.itemTotal = (this.itemTotal + parseInt($event.target.value))
  }
  // search for client
  printAllOrder(PrinterName) {
    console.log(this.order_id)
var vm = this;
   if (this.clientExistName != null) {

    var orderArray = {
      total: this.itemTotal   , 
     service :this.serviceTax ,
     taxes :this.VAT ,discount:this.discount,
     branch_id :localStorage.getItem("branch"),
     marketer_id:this.selectedMarketer,
     paymenttype_id:this.selectedPaymentways,
     platform_id:1
    };

    console.log(orderArray);
    console.log(this.order_id)

    this.service.EditOrder(orderArray,this.order_id)
      .subscribe(respone => {
if (respone.success == true){

   console.log(this.order_id)

   localStorage.removeItem('orderid')

    var stringarr = [];
   this.addItems.forEach(function (e) {
     console.log(e.name)
     stringarr.push( e.name  +"         "+'\x1B' + '\x61' + '\x30',+ e.totalamount +"       "+'\x1B' + '\x61' + '\x30',+ e.price * e.totalamount +'\x0A') 
        });
        this.addItems = []
       var date =  this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm'); 
    var data = [
      { type: 'raw', format: 'image', data: 'assets/images/62123932_340200260263485_2674160429353140224_n (2).png', options: { encoding: 'IBM864',language: "ESCPOS", dotDensity: 'double' } },
      '\x1B' + '\x40',          // init
      '\x1B' + '\x61' + '\x32',
      
      // center align
      ' طلب رقم   : '+ this.order_id + '\x0A',
    
      '  إسم العميل  : '+ this.clientExistName + '\x0A',
      '\x0A',     
      '  رقم العميل  : '+ this.clientExistPhone + '\x0A', '\n',
      '\x0A',    
      '  عنوان العميل  : '+ this.clientExistAddress + '\x0A', '\n',
      '\x0A',                     // line break
          // text and line break
           
      date + '\x0A',
                      // line break    
      '\x0A' +  
      '\x0A' +  '\x1B' + '\x61' + '\x32',
      
      'الاسم                      الكمية     السعر' + '\x0A','\x0A',
       '\x0A',// left align
      '------------------------------------------' ,'\x0A',
       stringarr.toString().replace(/,/g,""),
      '\x0A',
      '\x0A',
      '\x1B' + '\x61' + '\x30', // left align
      'SubTotal   '+  Math.round(this.itemPrice * 100) / 100  +  '\x0A',  //print special char symbol after numeric
      '\x0A',
      
      'DisCount    '  + Math.round(this.discount * 100) / 100+"%" +  '\x0A',    
      '\x0A', 
      'Service   '  + Math.round(this.serviceTax * 100) / 100  +  '\x0A',   
      '\x0A', 
      '\x0A', 
          'Taxes   '  + Math.round(this.VAT * 100) / 100  +  '\x0A',   
          '\x0A', 
      'Total   '  + Math.round(this.itemTotal * 100) / 100  +  '\x0A',  
      
     
      '\x0A',  '\x0A',  '\x0A',
      '------------------------------------------' ,'\x0A','\x0A','\x0A',
      '\x1B' + '\x61' + '\x30', // left align
      '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A' + 
      '\x1B' + '\x69',          // cut paper (old syntax),'\x0A',
   // '\x1D' + '\x56'  + '\x00' // full cut (new syntax)
   // '\x1D' + '\x56'  + '\x30' // full cut (new syntax)
   // '\x1D' + '\x56'  + '\x01' // partial cut (new syntax)
   // '\x1D' + '\x56'  + '\x31' // partial cut (new syntax)
      '\x10' + '\x14' + '\x01' + '\x00' + '\x05',  // Generate Pulse to kick-out cash drawer**
                                                   // **for legacy drawer cable CD-005A.  Research before using.
                                                   // see also http://keyhut.com/popopen4.htm
   ];

    this.printers = [];
    console.log('AppComponent____________');
    const config = qz.configs.create(localStorage.getItem("printer").replace(/['"]+/g, ''), { encoding: "IBM864" }); // Create a default config for the found printer
    return qz.print(config, data).then(function(r){  
      // vm.addOrder()
      vm.router.navigate(['/tables'])

    }).catch(function(e) { alert("من فضلك قم بعمل اعادة لبرنامج qz tray"); console.error(e); });; 
      }
    })
  }else {

    alert('من فضلك ادخل معلومات العميل')
  }
  }
  // search fro client

  searchClient(search) {
    console.log(search)
    let mob = {
      mobile : search    
    }
    console.log(JSON.stringify(mob));
    this.service.searchClient(mob)
      .subscribe((respons:any) => {
        console.log(respons.data);
        this.clientArray = respons.data;
      });
  }

  // get existing client info

  clientInfo(i){
    this.clientExistName = this.clientArray[i].username;
    this.clientExistAddress = this.clientArray[i].address;
    this.clientExistPhone = this.clientArray[i].mobile;
    this.clientId = this.clientArray[i].id;
    this.clientArray = []

  }


}
