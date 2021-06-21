import { Component, OnInit } from '@angular/core';
import { TablesService } from 'src/app/services/tables/tables.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from "@angular/router"

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  // save tables in variable

  tables: any[] = [];

  constructor(private service: TablesService,private router: Router) { }

  ngOnInit() {

    // get all tables positions

    this.service.getTablesPosition()
    .subscribe(respons => {
      this.tables = respons.data
      console.log(this.tables);
    });

  }

addOrder(events){


  let tableId = events.target.getAttribute('id');

  this.service.checkOrderCompletes(tableId).subscribe(respone => {

    var  orderArray = {
      typeorder: 0,
      total: 0,
      user_id: localStorage.getItem("userid"),
      waiter_id: 1,
      table_id: parseInt(tableId),      branch_id :localStorage.getItem("branch"),

     
    };
  if (respone.query.length > 0){
    console.log(respone.query[0].orderdetails)
    this.router.navigate(['/orders/'+tableId+'/'+respone.query[0].id+'/1'])

  }
  else {
    this.service.addOrder(orderArray)
    .subscribe(respone => {
     this.router.navigate(['/orders/'+tableId+'/'+respone.data.id])
    });
  }
  })
  

}
}
