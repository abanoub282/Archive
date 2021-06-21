import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  // set headers

  private headers = new HttpHeaders({'Content-Type': 'application/json' });
  private options = { headers: this.headers };  

  // categories api

  private categoriesUrl = 'http://wokhouse.codesroots.com/api/Categories/getitemcategories.json';  

  // subcategory data api

  private itemUrl = 'http://wokhouse.codesroots.com/api/items/getitemsbytype';

  // add client api

  private clientUrl = 'http://wokhouse.codesroots.com/api/users/add.json';

  // find client api

  private findClientUrl = 'http://wokhouse.codesroots.com/api/users/searchbyname.json';

  // find item  by name
  private findItemUrl = 'http://wokhouse.codesroots.com/api/items/getitemsbyname';

  // add order api

  private orderUrl = 'http://wokhouse.codesroots.com/api/Orders/add.json';  

// add order details
  private orderdetailsUrl = 'http://wokhouse.codesroots.com/api/orderdetails/add.json';  


  // get offers items
  private getoffersUrl = 'http://wokhouse.codesroots.com/api/offerscat/GetcatForOffers';  

  // edit order total 
  private checkOrderComplete = 'http://wokhouse.codesroots.com/api/orderdetails/getDetailsByOrder/';  
  private checkOrderCompleteId = 'http://wokhouse.codesroots.com/api/orderdetails/getDetailsByOrderId/';  
  private checkOrderNotCompleteId = 'http://wokhouse.codesroots.com/api/orderdetails/getDetailsByLastOrder/';  

    private EditorderUrl = 'http://wokhouse.codesroots.com/api/Orders/edit';  
  constructor(private http: HttpClient) { }


  private MyorderUrl = 'http://wokhouse.codesroots.com/api/Orders/index';  
  private getMarketersAndPaymentways = 'http://wokhouse.codesroots.com/api/marketers/getMarketersAndPaymentways.json';  

  // get categoies data

  getCategoriesData() {
    return this.http.get<any>(this.categoriesUrl);
  }
  getMyOrderData() {
    return this.http.get<any>(this.MyorderUrl  + '/' + localStorage.getItem("branch") +'.json');
  }
  // get items by category

  getItemsByCategory(event){
    let getUrl = this.itemUrl + '/' + event.target.getAttribute('id') + '/' + '0.json';
    return this.http.get<any>(getUrl);    
  }

// getMarketersAndPaymentways
getMarketersAndPaymentway() {
  let getUrl = this.getMarketersAndPaymentways ;    
  return this.http.get<any>(getUrl);
}
  // get items by subcategory

  getItems(event) {
    let getUrl = this.itemUrl + '/' + event.target.getAttribute('id') + '/' + '1.json';    
    return this.http.get<any>(getUrl);
  }
// add order for kitchen 
getoffersitems(event) {
  let getUrl = this.getoffersUrl + '/' + event.target.getAttribute('id') + '.json';    
  return this.http.get<any>(getUrl);
}
adddetailsOrder(orderArray){
  let headers = new HttpHeaders({'Content-Type': 'application/json' });
  let options = { headers: headers };
  return this.http.post<any>(this.orderdetailsUrl, orderArray, options);
}
  // add order in the resturant

  addOrder(orderArray){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.post<any>(this.orderUrl, JSON.stringify(orderArray), options);
  }
  EditOrder(orderArray,id){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.post<any>(this.EditorderUrl+'/'+id+'.json', JSON.stringify(orderArray), options);
  }
  // add new client

  addClient(clientArr){  
    
    return this.http.post<any>(this.clientUrl, JSON.stringify(clientArr), this.options);
  }

  // search fro client

  searchClient(mob) {
    return this.http.post<any>(this.findClientUrl, JSON.stringify(mob), this.options);
  }
  searchItems(mob) {
    return this.http.post<any>(this.findItemUrl+".json", JSON.stringify(mob), this.options);
  }
  checkOrderCompletes(tableid){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.get<any>(this.checkOrderComplete+tableid+".json", options);
  }
  checkOrderCompletesById(ID){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.get<any>(this.checkOrderCompleteId+ID+".json", options);
  }

getLastNotCompeleteOrder(ID){
  let headers = new HttpHeaders({'Content-Type': 'application/json' });
  let options = { headers: headers };
  return this.http.get<any>(this.checkOrderNotCompleteId+ID+".json", options);
}
}