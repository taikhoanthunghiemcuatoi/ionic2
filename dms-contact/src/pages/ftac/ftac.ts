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
