import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite, Globalization } from 'ionic-native';
import { TranslateService } from '@ngx-translate/core';

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
  static translate: TranslateService;
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Home;

  pages: Array<{title: string, component: any}>;

  db = new DBStorage();

  constructor(public platform: Platform, private translate: TranslateService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Menu.Home', component: Home},
      { title: 'Menu.AllContacts', component: AllContacts},
      { title: 'Menu.CodesMapping', component: FTAC},
      { title: 'Menu.InvalidCodes', component: UpdateContacts},
      { title: 'Menu.History', component: History},
      { title: 'Menu.Help', component: Help},
      { title: 'Menu.About', component: About }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      Globalization.getPreferredLanguage().then(result => {
        var language = result.value;
        console.log('language: ' + language + '\n');

        //setup TranslateService
        this.setupTranslateService(language);
      }).catch(e => console.log(e));

      //database
      this.db.openDatabase().then(()=>{this.createTables();},()=>{});
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);

  }

  setupTranslateService(lang: string){
      console.log('calling setupTranslateService');
      MyApp.translate = this.translate;
      console.log('lang=' + lang);
      MyApp.translate.setDefaultLang('en-US');
      MyApp.translate.use(lang);
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
      //this.db.executeSql(dropSql);

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
