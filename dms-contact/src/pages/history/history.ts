import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import { DBStorage } from '../../js/db-storage.ts';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class History{

  db = new DBStorage();
  items: Array<Object>;

  constructor(){
    let sql : string = "SELECT his_type, old_data, new_data, dtcreated_dt FROM history where his_type='ftac'";
    this.db.executeSql(sql).then(
      (result)=>{
        this.items = [];
        console.log('result: ' + JSON.stringify(result));
        if(result.rows.length > 0) {
            for(var i = 0; i < result.rows.length; i++) {
                var dtString = result.rows.item(i).dtcreated_dt;//'1487417651803';
                let dtNumber = parseInt(dtString);
                let dt = new Date(dtNumber);
                this.items.push({
                  old_data: result.rows.item(i).old_data,
                  new_data: result.rows.item(i).new_data,
                  dtcreated_dt: dt.toLocaleString()
                });
            }
        }
      });
  }
}
