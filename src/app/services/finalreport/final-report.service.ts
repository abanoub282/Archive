import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FinalReportService {
  showProducts(orderdetails: any[]) {
    throw new Error('Method not implemented.');
  }
  private categoriesUrl = 'http://wokhouse.codesroots.com/api/orderdetails/getSellsByCategory.json';  
  private categoriesUrlByDate = 'http://wokhouse.codesroots.com/api/orderdetails/getSellsByCategoryByDate.json';  
  private ExpensesByDay = 'http://wokhouse.codesroots.com/api/expenses/getDailyExpenses.json';  
  private ExpensesByDayByDate = 'http://wokhouse.codesroots.com/api/expenses/getDailyExpensesByDate.json';  
  private PaymentStaffByDay = 'http://wokhouse.codesroots.com/api/StaffPayments/getDailyStaffPayments.json';  
  private EaymentStaffByDayByDate = 'http://wokhouse.codesroots.com/api/StaffPayments/getDailyStaffPaymentsByDate.json'; 
  private MyExpensesDay = 'http://wokhouse.codesroots.com/api/Expenses/getDailyExpenses.json'; 
  private MyBorrowByDay = 'http://wokhouse.codesroots.com/api/StaffPayments/getDailyStaffPayments.json'; 
  private headers = new HttpHeaders({'Content-Type': 'application/json' });
  private options = { headers: this.headers };  
  TimeByExpenses: string;
  constructor(private http: HttpClient) { }
  getdayreport(date){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.post<any>(this.categoriesUrl, JSON.stringify(date),options);    
  }
  getdayreportByDate(date){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.post<any>(this.categoriesUrlByDate, JSON.stringify(date),options);
 
  }
  ExpensesByDaysDate(date){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.post<any>(this.ExpensesByDayByDate, JSON.stringify(date),options);
 
  }

  ExpensesByDays(date){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.post<any>(this.ExpensesByDay, JSON.stringify(date),options);
 
  }

  StaffPaymentsByDaysDate(date){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.post<any>(this.EaymentStaffByDayByDate, JSON.stringify(date),options);
 
  }
  StaffPaymentsByDays(date){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.post<any>(this.PaymentStaffByDay, JSON.stringify(date),options);
 
  }

  GetMyExpensesByDate(date){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.get<any>(this.MyExpensesDay,options);
 
  }

  GetMyBorrowByDate(date){
    let headers = new HttpHeaders({'Content-Type': 'application/json' });
    let options = { headers: headers };
    return this.http.get<any>(this.MyBorrowByDay,options);
 
  }

}
