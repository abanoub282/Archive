import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.prod";
import { User } from "src/app/Models/user.model";

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  currentUser = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {
    if (localStorage.getItem("currentUser")) {
      this.currentUser.next(JSON.parse(localStorage.getItem("currentUser")))
    }
  }

  login(loginData) {
    this.http
      .post<any>(environment.serverUrl + "users/token.json", loginData)
      .subscribe(
        (res: User) => {
          // store user details and token in local storage to keep user logged in between page refreshes
          this.setToken(res.data.token);
          this.setBranch(res.data.branchid)
          this.setUserId(res.data.id)
          this.setPrinter(res.data.printer)
console.log(res.data.printer)
          this.currentUser.next(res);
          // this.router.navigate(['/']);
        },
        err => {
          // console.log(err);
        }
      );
  }
  register(registerData) {
    this.http
      .post<any>(environment.serverUrl + "users/add.json", registerData)
      .subscribe(
        (res: User) => {
          // store user details and token in local storage to keep user logged in between page refreshes
          this.setToken(res.data.token);
          this.setBranch(res.data.branchid)
          this.currentUser.next(res);
          this.router.navigate(['/']);
        },
        err => {
          // console.log(err);
        }
      );
  }
  getToken() {
    if (JSON.parse(localStorage.getItem("currentUser"))) {
      const token = JSON.parse(localStorage.getItem("currentUser"));
      return token;
    } else {
      const token = "";
      return token;
    }
  }
  setToken(token) {
    localStorage.setItem("currentUser", JSON.stringify(token));
  }
  setBranch(token) {
    localStorage.setItem("branch", JSON.stringify(token));
  }
  setUserId(token) {
    localStorage.setItem("userid", JSON.stringify(token));
  }
  setPrinter(token) {
    localStorage.setItem("printer", JSON.stringify(token));
  }
  logOut() {
    // remove user from local storage and set current user to null
    localStorage.removeItem("currentUser");
    // location.reload(true)
    this.currentUser.next(null);
    location.reload()
  }
  passReset(email) {
    return this.http
      .post<any>(environment.serverUrl + "users/add.json", email);
  }
}
