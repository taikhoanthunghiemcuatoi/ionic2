import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import { HistoryDB } from '../../js/HistoryDB.ts';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class History{

  items: Array<Object>;

  constructor(){
    let historyDB = new HistoryDB();
    historyDB.getAll((items)=>{this.items = items});
  }
}
