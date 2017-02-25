import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { Data } from '../../js/data.ts';

@Component({
  selector: 'page-ftac',
  templateUrl: 'ftac.html'
})
export class FTAC {
    items: any[] = [{},{},{}];

  constructor(public navCtrl: NavController) {
    this.initializeItems();
  }

  initializeItems(){
    var data = new Data();
    this.items[0] = data.period1;
    this.items[1] = data.period2;
    this.items[2] = data.period3;

    this.items[0].start_dt = this.toCorrectDateString(data.period1.start_dt);
    this.items[1].start_dt = this.toCorrectDateString(data.period2.start_dt);
    this.items[2].start_dt = this.toCorrectDateString(data.period3.start_dt);

    this.items[0].end_dt = this.toCorrectDateString(data.period1.end_dt);
    this.items[1].end_dt = this.toCorrectDateString(data.period2.end_dt);
    this.items[2].end_dt = this.toCorrectDateString(data.period3.end_dt);

    //order items
    this.items[0].subdivisions.sort((subdivision1, subdivision2) => {
      if (subdivision1.name < subdivision2.name) return -1;
      if (subdivision1.name > subdivision2.name) return 1;
      return 0;
    });

    this.items[1].subdivisions.sort((subdivision1, subdivision2) => {
      if (subdivision1.name < subdivision2.name) return -1;
      if (subdivision1.name > subdivision2.name) return 1;
      return 0;
    });

    this.items[2].subdivisions.sort((subdivision1, subdivision2) => {
      if (subdivision1.name < subdivision2.name) return -1;
      if (subdivision1.name > subdivision2.name) return 1;
      return 0;
    });
  }

  toCorrectDateString(strDate: string){
    var a = strDate.split(/[^0-9]/);
    //for (i=0;i<a.length;i++) { alert(a[i]); }
    var d=new Date (Number(a[0]),Number(a[1])-1,Number(a[2]),Number(a[3]),Number(a[4]),Number(a[5]) );
    return d;
  }

  getItems(ev: any){
    //Reset items back to all of the items
    this.initializeItems();

    //set val to the value of the searchbar
    let val = ev.target.value;

    //if the value is an empty string => don't filter the items
    if (val && val.trim() != ''){
      for (var i=0; i<3; i++){
        this.items[i].subdivisions = this.items[i].subdivisions.filter((item) => {
          return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        });
      }
    }
  }
}
