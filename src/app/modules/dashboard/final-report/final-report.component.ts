import { Component, OnInit } from '@angular/core';
import { FinalReportService } from 'src/app/services/finalreport/final-report.service';
import { MainData } from 'src/app/Models/Reports/reports.model';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import * as qz from 'qz-tray';
import { DatePipe } from '@angular/common';
import { sha256 } from 'js-sha256';
import { config } from 'rxjs';
import * as shajs from 'sha.js';
import { data } from 'jquery';
@Component({
  selector: 'app-final-report',
  templateUrl: './final-report.component.html',
  styleUrls: ['./final-report.component.scss'],  providers:[DatePipe]
})
export class FinalReportComponent implements OnInit {
   alltotal;
   services;
   taxes;
   discount;
   expenses;
   staffpayments;
   Expenses;
   isExpresesVisible = false;

   categories: any[] = [];
   maindata: MainData  ;
   model: NgbDateStruct;
   printers;
    date;
    
 
     locationsSum() {
      return this.categories.map(tag => tag.SumTotal).reduce((a, b) => a + b, 0);
    }
   selectToday() {
     this.model = this.calendar.getToday();
   }
  constructor(public service : FinalReportService,private calendar: NgbCalendar,public datePipe: DatePipe) { 
    qz.api.setSha256Type(data => sha256(data));
    qz.api.setPromiseType(resolver => new Promise(resolver));
    qz.websocket.connect().then(function () {
      return qz.printers.find("HP LaserJet 2420"); // Pass the printer name into the next Promise
    }).then(function (printer) {
      console.log(printer)
      // this.printer = printer
    }).catch(function (e) { console.error(e); });
  }

  ngOnInit() {
    this.getdayreport()
  }
getdayreport(){
  var  orderdetails: any[] = [];

  orderdetails.push({
       branch_id :localStorage.getItem("branch")
    }
  );
  this.service.getdayreport(orderdetails) 
  .subscribe(respone => {
    this.maindata = respone
this.alltotal =   Math.round((this.maindata.allsales[0].SumTotal) * 100) / 100;
this.services =   Math.round((this.maindata.allsales[0].TaxesTotal) * 100) / 100;
this.taxes = Math.round((this.maindata.allsales[0].ServiceTotal) * 100) / 100;
this.discount =  Math.round((this.maindata.allsales[0].DiscountTotal) * 100) / 100;
console.log(this.maindata.offerdetailsarray)
    this.categories = this.maindata.query
  });
  this.service.ExpensesByDays(orderdetails) 
  .subscribe(respone => {
console.log(respone)
this.expenses = Math.round((respone.query[0].SumTotal) * 100) / 100;
  });

  this.service.StaffPaymentsByDays(orderdetails) 
  .subscribe(respone => {
console.log(respone)
this.staffpayments = Math.round((respone.query[0].SumTotal) * 100) / 100;
  });

  this.service.GetMyExpensesByDate(orderdetails) 
  .subscribe(respone => {
console.log(respone)
this.Expenses = respone.query;
  });

  this.service.GetMyBorrowByDate(orderdetails) 
  .subscribe(respone => {
console.log(respone)
this.Expenses = respone.query;
  });
}
ServiceChanged(event){
  this.date = event.target.value
  var  orderdetails: any[] = [];

  orderdetails.push({
      date: this.date   ,   branch_id :localStorage.getItem("branch"),

     
    }
  );

  this.service.getdayreportByDate(orderdetails)
    
  .subscribe(respone => {
    this.maindata = respone
this.alltotal =  Math.round((this.maindata.allsales[0].SumTotal) * 100) / 100;
this.services =   Math.round((this.maindata.allsales[0].TaxesTotal) * 100) / 100;
this.taxes =  Math.round((this.maindata.allsales[0].ServiceTotal) * 100) / 100;
this.discount =  Math.round((this.maindata.allsales[0].DiscountTotal) * 100) / 100;
console.log(this.discount)
    this.categories = this.maindata.query
  });
  this.service.ExpensesByDaysDate(orderdetails) 
  .subscribe(respone => {
console.log(respone)
this.expenses = Math.round((respone.query[0].SumTotal) * 100) / 100;
  });

  this.service.GetMyExpensesByDate(orderdetails) 
  .subscribe(respone => {
console.log(respone)
this.Expenses = Math.round((respone.query[0].SumTotal) * 100) / 100;
  });

  this.service.StaffPaymentsByDaysDate(orderdetails) 
  .subscribe(respone => {
console.log(respone)
this.staffpayments = Math.round((respone.query[0].SumTotal) * 100) / 100;
  });
    }
    printAllOrder(PrinterName) {
  
  
  if (this.date == null) {
    this.date =  this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm'); 

  }
  
      var stringarr = [];
     this.categories.forEach(function (e) {
       stringarr.push( e.item.subcategory.category.name +"                      "+  e.SumTotal +'\x0A') 
          });
          console.log(stringarr.toString().replace(/,/g,""))
      var data = [
        { type: 'raw', format: 'image', data: 'assets/images/62123932_340200260263485_2674160429353140224_n (2).png', options: { encoding: 'IBM864',language: "ESCPOS", dotDensity: 'double' } },
        '\x1B' + '\x40',          // init
        '\x1B' + '\x61' + '\x32',
        
        // center align
        'مبيعات  : '+ Math.round((this.maindata.allsales[0].SumTotal) * 100) / 100 + '\x0A','\x0A','\x0A','\x0A',
      
        
                         // line break
            // text and line break
             
        this.date + '\x0A',
                        // line break    
        '\x0A' +  
       'القسم                      المبيعات' + '\x0A','\x0A',
        '\x0A',// left align
       '------------------------------------------' ,'\x0A',
        stringarr.toString().replace(/,/g,""),
        '\x0A',
        '\x0A',
 
        
       
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
      return qz.print(config, data).catch(function(e) { console.error(e); });; 
    }
    showProducts() {
      this.isExpresesVisible = true;  

    
    }
    handleCancelisExpresesVisible() {
      this.isExpresesVisible = false;
    }
    
}