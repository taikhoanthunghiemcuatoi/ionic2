import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocalNotifications } from 'ionic-native';
import { TranslateService } from '@ngx-translate/core';
import { MyApp } from '../../app/app.component.ts';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home{

  translate : TranslateService = MyApp.translate;

  constructor(public navCtrl: NavController /*, public translate: TranslateService*/){
    let isAndroid:boolean = true;
    let key: string = "Hello World";
// Schedule delayed notification
    LocalNotifications.schedule({
       id: 1,
       title: 'Put title here',
       text: 'Put text here',
       at: new Date(new Date().getTime() + 120000),//deliver notification after 2m
       led: 'FF0000',
       sound: null});
    LocalNotifications.on("click",(notification)=>{this.cancelNotification(notification.id);});
    //translate.setDefaultLang('vn');
  }

  cancelNotification(id: number){
    LocalNotifications.cancel(id);
  }
}
