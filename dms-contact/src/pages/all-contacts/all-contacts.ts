import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Contacts, Contact, ContactFieldType, ContactFindOptions } from 'ionic-native';

@Component({
  selector: 'page-all-contacts',
  templateUrl: 'all-contacts.html'
})
export class AllContacts {

  items:Contact[];
  cachedItems : Contact[];
  debug : boolean = false;
  constructor(public navCtrl: NavController) {
    this.initializeItems();
  }

  getAllContacts(){
    let fields: ContactFieldType[] = ['displayName'];
    const options: ContactFindOptions = new ContactFindOptions();
    options.multiple = true;
    options.hasPhoneNumber = true;
    let promise = Contacts.find(fields,options).then((contacts)=>{
      this.items = contacts;
      this.items.sort((contact1, contact2)=> {
        if (contact1.displayName != null){
          if (contact1.displayName < contact2.displayName) return -1;
          if (contact1.displayName > contact2.displayName) return 1;
        }else if (contact1.name.formatted){
          if (contact1.name.formatted < contact2.name.formatted) return -1;
          if (contact1.name.formatted > contact2.name.formatted) return 1;
        }
        return 0;;
      });
      this.cachedItems = this.items;
      console.log('contacts: ' + JSON.stringify(contacts));
      if (this.debug){
        console.log('contacts list:\n');
        for (var i=0; i<contacts.length; i++){
          let contact: Contact = contacts[i];
          console.log('Display name: ' + contact.displayName + ' phoneNumbers: ' + JSON.stringify(contact.phoneNumbers) + '\n');
        }
      }
    });
  }

  initializeItems(){
    this.getAllContacts();
  }

  getItems(ev: any){
    //Reset items back to all of the items
    //this.initializeItems();

    //set val to the value of the searchbar
    let val = ev.target.value;

    //if the value is an empty string => don't filter the items
    if (val && val.trim() != ''){
      this.items = this.cachedItems.filter((item) => {
        if (item.displayName != null)
          //for android search
          return (item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
        else if (item.name.formatted !=null){
          //for iOS search
          return (item.name.formatted.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
      });
    }else{
      this.initializeItems();
    }
  }
}
