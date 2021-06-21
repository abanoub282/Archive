import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  posts : [any];
  constructor(private http:HttpClient){

  }
  
  title = 'mata3em';

  url : string = 'https://jsonplaceholder.typicode.com/posts';

  ngOnInit(): void {
    this.http.get(this.url).subscribe( response=>{
      console.log(response);
    })
  }
}
