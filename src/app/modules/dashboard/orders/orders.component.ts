import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { OrdersService } from 'src/app/services/orders/orders.service';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import * as qz from 'qz-tray';
import * as eps from 'escpos';

import { sha256 } from 'js-sha256';
import { config } from 'rxjs';
import * as shajs from 'sha.js';
import {Router} from "@angular/router"

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],  providers:[DatePipe]
})
export class OrdersComponent implements OnInit {

  // control the type of order

  table_id;
  check;
  clicked
  order_id;
 offer;
  printers;
delivry;
marketers;
paymentways;
  // variables for styling
  selectedMarketer ;
  selectedPaymentways;
  isReadyToShow = false;

  // variables for categories and items

  categories: any[] = [];
  items: any[] = [];
  subs: any[] = [];
  offeritems: any[] = [];
  selectedLevel;

  addItems: any[] = [];
  tblItems: any[] = [];
  itemTax = 0;
  itemPrice = 0;
  itemTotal = 0;
  VAT = 0;
  serviceTax = 0;
addedItemsForPrint: any[] = [];
lastitemPrice;
lastVAT;
lastserviceTax;
discount = 0;
isearchByName = 0;

  // variables for adding new client



  constructor(public route: ActivatedRoute, public service: OrdersService,public datePipe: DatePipe,public router: Router) {
    qz.api.setSha256Type(data => sha256(data));
    qz.api.setPromiseType(resolver => new Promise(resolver));

    qz.websocket.connect().then(function () {
      return qz.printers.find("HP LaserJet 2420"); // Pass the printer name into the next Promise
    }).then(function (printer) {
      console.log(printer,"lklkl")
      // this.printer = printer
    }).catch(function (e) { console.error(e); });
    this.route.paramMap
    .subscribe(parm => {
      this.table_id = parm.get('table_id');
      this.order_id = parm.get('order_id');
      this.check = parm.get('check');

    });
  }

  ngOnInit() {

   // localStorage.clear();
    // get type of order


    this.service.getMarketersAndPaymentway().subscribe(respone => {
      console.log(respone)
      this.marketers = respone.marketers
      this.paymentways = respone.paymentsways
      this.selectedPaymentways = respone.paymentsways[0].id
      this.selectedMarketer = respone.marketers[0].id
      })

    // get categories
    this.service.getCategoriesData()
      .subscribe((respons: any) => {
        this.categories.push(respons.data);
      });
      if (this.check == 1){
          this.service.checkOrderCompletesById(this.order_id).subscribe(respone => {
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
                  if ( this.addItems[z].tax.service > 0){
    console.log(this.addItems[z])
                  this.serviceTax += Math.round(((respone.query[0].orderdetails[z].itemtotal * this.addItems[z].tax.service) / 100) * 100) / 100;
                  }

                }

            }
                   
                  this.itemTotal = Math.round((this.itemPrice + this.VAT + this.serviceTax) * 100) / 100;

          })
        }
  }

  // get items by category

  getItemsByCategory(event) {
    let arrayIndex = event;
    console.log(arrayIndex)
if (event == 2) {
  this.offer = 1
}else {
  this.offer = 0
}
    let checkSubID = this.categories[0][event].subcategories;
    this.offeritems = [];
    this.items = [];
    this.subs = [];
    this.subs.push(checkSubID);
    console.log(this.categories)

 
  }
  searchItem(search) {
    console.log(search)
    this.isearchByName = 1
    let mob = {
      id : search.value   ,offer :this.offer 
    }
    this.service.searchItems(mob)
      .subscribe((respons:any) => {
        console.log(respons.data);
        this.subs = [];
        this.offeritems = []
        this.items = respons.data;
      });
  }

  // get items data

  getItems(event, i) {
 
    console.log( event.target.getAttribute('id'))
    this.service.getItems(event)
      .subscribe((respons: any) => {
       
          this.subs = [];
          this.items = [];
          console.log(respons.data)

          this.items = respons.data;     
       
      });
    
  }
  getoffersitems(event, i) {
    this.service.getoffersitems(event)
      .subscribe((respons: any) => {
   
          this.subs = [];
          this.items = [];
          console.log(respons.data)

          this.offeritems = respons.data;  
          for (let i = 0; i <= this.offeritems.length - 1; i++) {
            for (let z = 0; z <= this.offeritems[i].subcategory.items.length - 1; z++) {
console.log(this.offeritems[i].subcategory.items[z])
this.items.push(this.offeritems[i].subcategory.items[z])
            }
          }
          this.offer = 0   
        } 
      );
  }
  PutItemForSell( event, i,x){
    if (this.offer == 0 ){
      if (this.offeritems.length > 0 ){
console.log(this.offeritems[x])
        this.addItems.push(this.offeritems[x].subcategory.items[i]);

      }else {
        this.addItems.push(this.items[i]);

      }

      this.addItems[this.addItems.length - 1].totalamount = 1
    this.itemTax = this.items[i].tax.percentage;
          this.itemPrice += Math.round((this.items[i].price) * 100) / 100;
          if ( this.itemTax > 0){
          this.VAT = Math.round((this.itemPrice * this.itemTax / 100) * 100) / 100;
          }
if (this.delivry != 1 && this.items[i].tax.service > 0){
          this.serviceTax = Math.round(((this.itemPrice * this.items[i].tax.service) / 100) * 100) / 100;
}
          this.itemTotal = Math.round((this.itemPrice + this.VAT + this.serviceTax) * 100) / 100;
    }else {
      
      this.addItems.push(this.items[i]);
      this.addItems[this.addItems.length - 1 ].totalamount = 1
    this.itemTax = this.items[i].tax.percentage;
          this.itemPrice += Math.round((this.items[i].price) * 100) / 100;
          if ( this.itemTax > 0){
          this.VAT = Math.round(((this.itemPrice * this.itemTax) / 100) * 100) / 100;
          }
          if (this.delivry != 1 && this.items[i].tax.service > 0){
            this.serviceTax = Math.round(((this.itemPrice * this.items[i].tax.service) / 100) * 100) / 100;
  }
            this.itemTotal = Math.round((this.itemPrice + this.VAT + this.serviceTax) * 100) / 100;
          if (this.isearchByName == 0) {
            this.items = []

            this.getoffersitems(event, i)

          }
     
    }
  }
  // update item quantity

  updateItems(event, i) {

    let arrayIndex = i;
    let elementValue = event.target.value;
    let valuAttr = event.target.getAttribute('value');

   
    this.itemPrice -= Math.round((this.addItems[arrayIndex].price * this.addItems[arrayIndex].totalamount) * 100) / 100;;
    this.itemPrice += Math.round((this.addItems[arrayIndex].price * elementValue) * 100) / 100;;
    if (this.addedItemsForPrint.length > 0){
      this.addedItemsForPrint[arrayIndex].totalamount = elementValue 
    }
    this.addItems[arrayIndex].totalamount = elementValue 
    console.log(this.addItems)

    if ( this.addItems[arrayIndex].tax.percentage > 0){

    this.VAT = Math.round((this.itemPrice * this.addItems[arrayIndex].tax.percentage ) / 100) * 100 / 100;
    }
    if (this.delivry != 1 && this.addItems[arrayIndex].tax.service > 0){
      this.serviceTax = Math.round((this.itemPrice * this.addItems[arrayIndex].tax.service) / 100) * 100 / 100;
}
    this.itemTotal = Math.round((this.itemPrice + this.VAT + this.serviceTax) * 100) / 100;


  }

  // remove item from the array

  removeRow(event, i) {
    let arrayIndex = i;
    let price = this.addItems[arrayIndex].price;
    let quantity = this.addItems[arrayIndex].totalamount;
console.log(this.addItems[arrayIndex])
if (this.addItems[arrayIndex].price > 0 ) {
  

this.itemPrice -= Math.round((this.addItems[arrayIndex].price * this.addItems[arrayIndex].totalamount) * 100) / 100;;
if ( this.addItems[arrayIndex].tax.percentage > 0){

    this.VAT -= (this.addItems[arrayIndex].price * this.addItems[arrayIndex].tax.percentage * this.addItems[arrayIndex].totalamount) / 100;
    }
    if (this.delivry != 1 && this.addItems[arrayIndex].tax.service > 0){
      console.log(this.addItems[arrayIndex].price)
      this.serviceTax -= Math.round((this.addItems[arrayIndex].price * this.addItems[arrayIndex].tax.service * this.addItems[arrayIndex].totalamount) / 100) * 100 / 100;
}
console.log(this.serviceTax) 

    this.itemTotal = Math.round((this.itemPrice + this.VAT + this.serviceTax) * 100) / 100;
}
this.addedItemsForPrint = this.arrayRemove(this.addedItemsForPrint, this.addItems[arrayIndex].index);

    this.addItems.splice(arrayIndex, 1);

  }

  // highlight the row
  highlighted(event,id) {
   
    event.target.parentNode.parentNode.classList.toggle ('highlighted');
    if (event.target.parentNode.parentNode.classList.contains('highlighted')){
      this.addedItemsForPrint.push(id)
      this.addedItemsForPrint[this.addedItemsForPrint.length - 1 ].index = this.makeid(7)

      console.log("added")

    
    }else {
      console.log("deleted")
      console.log(id.index)

    this.addedItemsForPrint = this.arrayRemove(this.addedItemsForPrint, id.index);
    }

    console.log(this.addedItemsForPrint)
  }
  makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
   arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele.index != value;
    });
 
  }
 
  // add order

  addOrder() {
    var vm = this;

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

        var stringarr = [];
       this.addItems.forEach(function (e) {
         console.log(e.name)
         stringarr.push( e.name  +"         "+'\x1B' + '\x61' + '\x30',+  e.price * e.totalamount +"       "+'\x1B' + '\x61' + '\x30',+  e.totalamount +'\x0A') 
            });
           var date =  this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm'); 
        var data = [
          { type: 'raw', format: 'image', data: 'assets/images/62123932_340200260263485_2674160429353140224_n (2).png', options: { encoding: 'IBM864',language: "ESCPOS", dotDensity: 'double' } },
          '\x1B' + '\x40',          // init
          '\x1B' + '\x61' + '\x31',
          '\x1B' + '\x45' + '\x0D', // center align
          ' طلب رقم   : '+ this.order_id + '\x0A',
        
          '  طرابيزة رقم : '+ this.table_id + '\x0A',
          '\x0A',                   // line break
              // text and line break
               
          date + '\x0A',
                          // line break    
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
        
          '\x0A',  
          'DisCount    '  + Math.round(this.discount * 100) / 100+  '\x0A',    
          '\x0A',  
          'Service   '  + Math.round(this.serviceTax * 100) / 100  +  '\x0A',   
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
          vm.router.navigate(['/tables'])

        }).catch(function(e) { alert("من فضلك قم بعمل اعادة لبرنامج qz tray"); console.error(e);

      });;

      }

      });

  }

  AddOrderForKitchen(){
var context = this
 
    if(confirm("تاكيد الطباعه")) {
      var  orderdetails: any[] = [];

      for (let i = 0; i <= context.addedItemsForPrint.length - 1; i++) {
        let quantity = 'quantity-' + i;
        let totalQuantity = localStorage.getItem(quantity) ? parseInt(localStorage.getItem(quantity)) : 1;
      orderdetails.push({
          itemamount: context.addedItemsForPrint[i].totalamount,
          itemtotal: context.addedItemsForPrint[i].price  * context.addedItemsForPrint[i].totalamount,
          item_id: context.addedItemsForPrint[i].id,
          order_id:parseInt(context.order_id)
        }
      );
      }
      context.service.adddetailsOrder(orderdetails)
      .subscribe(respone => {
        if (respone.id != 0) {
         

      if (this.table_id == null){
        this.table_id = "T.K"
      }
          var stringarr = [];
         this.addedItemsForPrint.forEach(function (e) {
           console.log(e.name)
           stringarr.push( e.name  +"         "+'\x1B' + '\x61' + '\x30',+ e.price * e.totalamount +"       "+'\x1B' + '\x61' + '\x30',+  e.totalamount +'\x0A') 
              });
             var date =  this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm'); 
          var data = [
            { type: 'raw', format: 'image', data: 'assets/images/Screen Shot 2019-10-21 at 12.35.58 AM.png', options: { encoding: 'IBM864',language: "ESCPOS", dotDensity: 'double' } },
            '\x1B' + '\x40',          // init
            '\x1B' + '\x61' + '\x31',
            '\x1B' + '\x45' + '\x0D', // center align
            'طلب رقم   : '+ this.order_id + '\x0A',
            '\x0A',
            '  طرابيزة رقم : '+ this.table_id  + '\x0A',
            '\x0A',                   // line break            // line break
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
            
           
            '------------------------------------------' ,'\x0A','\x0A','\x0A',
            '\x1B' + '\x61' + '\x30', // left align
            '\x0A' + '\x0A' + '\x0A' ,
            '\x1B' + '\x69',          // cut paper (old syntax)
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
          console.log(localStorage.getItem("printer").replace(/['"]+/g, ''))
          const config = qz.configs.create(localStorage.getItem("printer").replace(/['"]+/g, ''), { encoding: "IBM864" }); // Create a default config for the found printer
          return qz.print(config, data).then(function(r){  
          
           
          }).catch(function(e) { 
           
            
            alert("من فضلك قم بعمل اعادة لبرنامج qz tray"); console.error(e);
          
          });;   
     
        console.log(respone);
        alert("تم حفظ الطلب"); ;

      }else {

        alert("لم يتم حفظ الطلب"); ;

      }
    
    });
  }
  }
  CompleteOrder(){
    var  orderdetails: any[] = [];

    for (let i = 0; i <= this.addedItemsForPrint.length - 1; i++) {
      let quantity = 'quantity-' + i;
      let totalQuantity = localStorage.getItem(quantity) ? parseInt(localStorage.getItem(quantity)) : 1;
    orderdetails.push({
        itemamount: this.addedItemsForPrint[i].totalamount,
        itemtotal: this.addedItemsForPrint[i].price  * this.addedItemsForPrint[i].totalamount,
        item_id: this.addedItemsForPrint[i].id,
        order_id:this.order_id,
        marketer_id:this.selectedMarketer,
        paymenttype_id:this.selectedPaymentways,
        platform_id:1

      }
    );
    }
    this.service.addOrder(orderdetails)
    .subscribe(respone => {
      console.log(respone);
      this.addedItemsForPrint = []
    });
  }
  print(PrinterName) {
    var vm = this;
  this.AddOrderForKitchen()

  }
  printAllOrder(PrinterName) {
    this.addOrder() 
  }

  MakeDiscount(event){

   var discount  = event.target.value
if (this.itemPrice  < this.lastitemPrice){
    this.itemPrice  = this.lastitemPrice 
    this.VAT =this.lastVAT 
    this.serviceTax  =this.lastserviceTax 
  }else {
    this.lastitemPrice = this.itemPrice 
    this.lastVAT = this.VAT 
    this.lastserviceTax = this.serviceTax 
  }
    this.itemPrice -= this.itemPrice * discount / 100;

    this.VAT -= this.VAT * discount / 100;
    this.serviceTax -= this.serviceTax * discount / 100;
  this.itemTotal = Math.round((this.itemPrice + this.VAT + this.serviceTax) * 100) / 100;
    this.discount =  this.itemTotal * event.target.value / 100
    console.log(this.discount)


        
  }
  selectedPaymentway(Paymentways){
this.selectedPaymentways = Paymentways

  }
  selectedMarketers(Marketers){
    this.selectedMarketer = Marketers

  }
}
