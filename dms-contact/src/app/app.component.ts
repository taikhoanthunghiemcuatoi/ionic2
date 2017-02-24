import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { Home } from '../pages/home/home';
import { History } from '../pages/history/history';
import { Help } from '../pages/help/help';
import { About } from '../pages/about/about';
import { AllContacts} from '../pages/all-contacts/all-contacts';
import { UpdateContacts} from '../pages/contact/update';
import { FTAC } from '../pages/ftac/ftac';
import { DBStorage } from '../js/db-storage.ts';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;

  pages: Array<{title: string, component: any}>;

  db = new DBStorage();

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Page One', component: Page1 },
      { title: 'Page Two', component: Page2 },
      { title: 'Home', component: Home},
      { title: 'All Contacts', component: AllContacts},
      { title: 'Update Contacts', component: UpdateContacts},
      { title: 'Codes List', component: FTAC},
      { title: 'History', component: History},
      { title: 'Help', component: Help},
      { title: 'About', component: About }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      //database
      this.db.openDatabase().then(()=>{this.createTables();},()=>{});
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);

  }

  createTables(){
    let dropTables: string[] = [
      'DROP TABLE IF EXISTS history'
    ];
    let createTables: string[] = [
      'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, his_type TEXT, old_data TEXT, new_data TEXT, dtcreated_dt INTEGER)'
    ];

    for (var i=0; i<dropTables.length; i++){
      let dropSql = dropTables[i];
      this.db.executeSql(dropSql);

      let createSql = createTables[i];
      this.db.executeSql(createSql);
      //this.db.executeSql(createSql).then(()=>{this.createDemoData();});
    }
  }

  createDemoData(){
    console.log('will insert data into the history table');
    let hisType = "ftac";
    var old_data = "old number";
    var new_data = "new number";
    var hisRecords : string[] = [];
    for (var i=0; i<10; i++){
      var sql = "insert into history(his_type, old_data, new_data, dtcreated_dt) values(?,?,?,?)";
      sql = sql.replace("?", "'" + hisType + "'");
      sql = sql.replace("?", "'" + old_data + " " + i + "'");
      sql = sql.replace("?", "'" + new_data + " " + i + "'");
      sql = sql.replace("?", "'" + Date.now() + "'");
      hisRecords[i] = sql;
      console.log('sql: ' + hisRecords[i]);
      this.db.executeSql(sql).then((result)=>{console.log('data: ' + JSON.stringify(result));});
    }
  }
}
