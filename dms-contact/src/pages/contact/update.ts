import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Contacts, Contact, ContactFieldType, ContactFindOptions, IContactField } from 'ionic-native';
import { Data } from '../../js/data.ts';

@Component({
  selector: 'page-update-contact',
  templateUrl: 'update.html'
})
export class UpdateContacts{

  items: any[] = [{},{},{}];
  debug : boolean = false;
  constructor(public navCtrl: NavController){

//    this.initializeItems();
    this.getAllContacts();
  }

  initializeItems(){
      var data = new Data();
      this.items[0] = data.period1;
      this.items[1] = data.period2;
      this.items[2] = data.period3;
  }

  getAllContacts(){
    let fields: ContactFieldType[] = ['displayName'];
    const options: ContactFindOptions = new ContactFindOptions();
    options.multiple = true;
    options.hasPhoneNumber = true;
    if (this.debug){
      this.afterGettingAllContacts(null);
    }else{
      Contacts.find(fields,options).then((contacts)=>{this.afterGettingAllContacts(contacts);});
    }
  }

  afterGettingAllContacts(allContacts: Contact[]){
    var data = new Data();
    if (this.debug)
      allContacts = data.initializeContactsList();
    var result1 = {
      "name":data.period1.name,
      "start_dt":data.period1.start_dt,
      "end_dt":data.period1.end_dt,
      "infoArray":this.updateContact(allContacts,data.period1)
      };
    this.items[0] = result1;

    var result2 = {
      "name":data.period2.name,
      "start_dt":data.period2.start_dt,
      "end_dt":data.period2.end_dt,
      "infoArray":this.updateContact(allContacts,data.period2)
      };
      this.items[1] = result2;

    var result3 = {
      "name":data.period3.name,
      "start_dt":data.period3.start_dt,
      "end_dt":data.period3.end_dt,
      "infoArray":this.updateContact(allContacts,data.period3)
      };
    this.items[2] = result3;
  }

  updateContact(allContacts: Contact[], period: any): any{
    var len = allContacts.length;
    var results : any[] = [];
    var count = 0;
    for (var i=0; i<len; i++){
      var contact : Contact = allContacts[i];
      var phoneNumbers : IContactField[] = contact.phoneNumbers;
      if (phoneNumbers != null){
        for (var j=0; j<phoneNumbers.length; j++){
          var phoneNumberField : IContactField = phoneNumbers[j];
          for (var k=0; k<period.subdivisions.length; k++){
            var sd = period.subdivisions[k];
            var otac = "0" + sd.otac;
            var tac = "0" + sd.tac;
            if (this.debug){
              var otac = "016";
              var tac = "0166";
            }
            let phoneNumberValue = phoneNumberField.value.trim();
            let phoneNumberCodeIndex = phoneNumberValue.indexOf('-');
            var phoneNumberCode = phoneNumberValue.substring(0,phoneNumberCodeIndex);
            if (phoneNumberValue.indexOf('(') == 0 && phoneNumberValue.indexOf(')') > 0){
              let startIndex = phoneNumberValue.indexOf('(');
              let endIndex = phoneNumberValue.indexOf(')');
              phoneNumberCode = phoneNumberValue.substring(startIndex+1, endIndex);
            }

            if (this.debug)
              console.log('phoneNumberValue=' + phoneNumberValue + ' phoneNumberCode=' + phoneNumberCode);

            if (phoneNumberValue.indexOf('+') == 0)
              console.log('Will not handle the phone number: ' + phoneNumberValue);

            if (phoneNumberCode == otac){
              var oldTel = phoneNumberValue;
              var newTel = tac + phoneNumberValue.substring(otac.length);
              if (phoneNumberValue.indexOf('(') == 0 && phoneNumberValue.indexOf(')') > 0){
                let startIndex = phoneNumberValue.indexOf('(');
                let endIndex = phoneNumberValue.indexOf(')');
                newTel = '(' + tac + ')' + phoneNumberValue.substring(endIndex + 1);
              }
              var record = {"name": sd.name, "otac": sd.otac, "tac": sd.tac, "oldTel":oldTel,"newTel":newTel,"contact":contact};
              results[count] = record;
              count = count + 1;
              break;
            }
          }
        }
      }
    }

    if (results != null && results.length > 1){
      results.sort((info1, info2) => {
        if (info1.contact.displayName < info2.contact.displayName) return -1;
        if (info1.contact.displayName > info2.contact.displayName) return 1;
        return 0;
      });
    }
    return results;
  }

  updatePhoneNumber(event: any, info: any){
    var contact : Contact = info.contact;
    if (this.debug)
      console.log('contact: ' + JSON.stringify(contact));
    console.log('update phone number: ' + info.oldTel + '=>' + info.newTel);

    if (!this.debug){
      for (var i=0; i<contact.phoneNumbers.length;i++){
        var phoneNumberField : IContactField = contact.phoneNumbers[i];
        var phoneNumberValue : string = phoneNumberField.value.trim();
        if (phoneNumberValue.length > 0 && phoneNumberValue == info.oldTel){
          phoneNumberField.value = info.newTel;
          contact.save().then(
            ()=>console.log('Contact saved! ', contact),
            (error:any)=> console.error('Error saving contact.', error)
            );
        }
      }
    }

    console.log('will remove phone number UI');
    this.removePhoneNumberUI(info);

  }

  removePhoneNumberUI(info: any){
    let index = -1;
    let oldTel : string = info.oldTel;
    for (var i=0; i<this.items.length; i++){
      let internalItem : any = this.items[i];
      for (var j=0; j<internalItem.infoArray.length; j++){
        let internalInfo : any = internalItem.infoArray[j];
        let internalOldTel : string = internalInfo.oldTel;
        if (oldTel == internalOldTel){
          index = j;
          internalItem.infoArray.splice(index,1);
          console.log('removed phone number UI');
          break;
        }
      }
    if (index > -1)
      break;
    }
  }
}
