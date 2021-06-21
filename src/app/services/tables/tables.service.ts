import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  private Tablesurl = 'http://wokhouse.codesroots.com/api/restables/gettablesdata/';
  private orderUrl = 'http://wokhouse.codesroots.com/api/orders/add.json';  
  private checkOrderComplete = 'http://wokhouse.codesroots.com/api/orderdetails/getDetailsByOrder/';  

  constructor(private http: HttpClient) { }

  // get all tables positins

  getTablesPosition () {
    return this.http.get<any>(this.Tablesurl + localStorage.getItem("branch")+ ".json");
  }
  addOrder(orderArray){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.post<any>(this.orderUrl, JSON.stringify(orderArray), options);
  }

  checkOrderCompletes(tableid){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.get<any>(this.checkOrderComplete+tableid+".json", options);
  }
}
