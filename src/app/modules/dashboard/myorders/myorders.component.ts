import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders/orders.service';
import * as qz from 'qz-tray';
import { sha256 } from 'js-sha256';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss']
})
export class MyordersComponent implements OnInit {
 addedorders : any[] = [];
  constructor( public service: OrdersService) { 
    qz.api.setSha256Type(data => sha256(data));
    qz.api.setPromiseType(resolver => new Promise(resolver));
    qz.websocket.connect().then(function () {
      return qz.printers.find("HP LaserJet 2420"); // Pass the printer name into the next Promise
    }).then(function (printer) {
      console.log(printer,"lklkl")
      // this.printer = printer
    }).catch(function (e) { console.error(e); });


   }

  ngOnInit() {
    this.service.getMyOrderData()
    .subscribe((respons: any) => {
      this.addedorders = respons.data;
      console.log(this.addedorders)
    });
  }
  printAllOrder(id) {
    var vm = this;

    var stringarr = [];
   this.addedorders[id].orderdetails.forEach(function (e) {
     console.log(e)
     stringarr.push( e.item.name  +"         "+'\x1B' + '\x61' + '\x30',+  e.itemtotal  +"       "+'\x1B' + '\x61' + '\x30',+  e.itemamount +'\x0A') 
        });
    var data = [
      { type: 'raw', format: 'image', data: 'assets/images/62123932_340200260263485_2674160429353140224_n (2).png', options: { encoding: 'IBM864',language: "ESCPOS", dotDensity: 'double' } },
      '\x1B' + '\x40',          // init
      '\x1B' + '\x61' + '\x31',
      '\x1B' + '\x45' + '\x0D', // center align
      ' طلب رقم   : '+ this.addedorders[id].id + '\x0A',
    
      '  طرابيزة رقم : '+ this.addedorders[id].table_id + '\x0A',
      '\x0A',                   // line break
          // text and line break
           
                      // line break    
      '\x0A' +  '\x1B' + '\x61' + '\x32',
      
     'الاسم                      الكمية     السعر' + '\x0A','\x0A',
      '\x0A',// left align
     '------------------------------------------' ,'\x0A',
      stringarr.toString().replace(/,/g,""),
      '\x0A',
      '\x0A',
      '\x1B' + '\x61' + '\x30', // left align
      '\x0A',
      'Taxes    '  + Math.round(this.addedorders[id].service ) +  '\x0A',    
      '\x0A',  
      'DisCount    '  + Math.round(this.addedorders[id].discount)+"%" +  '\x0A',    
      '\x0A',  
      'Service   '  + Math.round(this.addedorders[id].taxes * 100) / 100  +  '\x0A',   
      '\x0A', 
      'Total   '  + Math.round(this.addedorders[id].total * 100) / 100  +  '\x0A',  
      
     
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

    console.log('AppComponent____________');
    const config = qz.configs.create(localStorage.getItem("printer").replace(/['"]+/g, ''), { encoding: "IBM864" }); // Create a default config for the found printer
    return qz.print(config, data).then(function(r){  
   }).catch(function(e) { alert("من فضلك قم بعمل اعادة لبرنامج qz tray"); console.error(e); });;
  }

}
