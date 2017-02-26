import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Contacts, Contact, ContactFieldType, ContactFindOptions, IContactField } from 'ionic-native';
import { Data } from '../../js/data.ts';
import { DBStorage } from '../../js/db-storage.ts';
import { HistoryDB } from '../../js/HistoryDB.ts';

@Component({
  selector: 'page-update-contact',
  templateUrl: 'update.html'
})
export class UpdateContacts{

  items: any[] = [{},{},{}];
  debug : boolean = false;
  db = new DBStorage();
  historyDB = new HistoryDB();
  historyItems : Array<Object>;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController){

//    this.initializeItems();
    this.historyDB.getAll(
      (items)=>{this.historyItems = items;
      this.getAllContacts();
     });

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

    for (var i=0; i<len; i++){
      var contact : Contact = allContacts[i];
      var phoneNumbers : IContactField[] = contact.phoneNumbers;
      if (phoneNumbers != null){
        for (var j=0; j<phoneNumbers.length; j++){
          var phoneNumberField : IContactField = phoneNumbers[j];
          for (var k=0; k<period.subdivisions.length; k++){
            var sd = period.subdivisions[k];
            var otac = "0" + sd.otac.trim();
            var tac = "0" + sd.tac.trim();
            if (this.debug){
              var otac = "016";
              var tac = "0166";
            }
            var phoneNumberValue = phoneNumberField.value.trim();
            let numberPatt = /\d+/g;
            phoneNumberValue = phoneNumberValue.match(numberPatt).join("");

            if (this.debug)
              console.log('phoneNumberValue=' + phoneNumberValue);

            if (phoneNumberValue.indexOf('+') == 0)
              console.log('Will not handle the phone number: ' + phoneNumberValue);

            if (this.isPhoneNumberInHistory(phoneNumberValue)){
              continue;
            };

            if (phoneNumberValue.indexOf(otac) == 0){
              var oldTel = phoneNumberField.value.trim();

              var newTel = '(' + tac + ') ' + this.insertHyphen(3, phoneNumberValue.substring(otac.length));
              var record = {"name": sd.name, "otac": sd.otac, "tac": sd.tac, "oldTel":oldTel,"newTel":newTel,"contact":contact};
              results[results.length] = record;
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

  insertHyphen(step: number, str: string): string{
    var chars = str.split("").reverse().join("");
    console.log('[before insertHyphen] str: ' + str);
    var array = [];
    var count = 0;
    var step = 3;
    while(chars.length > 0){
    var temp = chars.substring(0,step);
     chars = chars.substring(temp.length);
     array[count++] = temp + '-';
    }
    var temp = array.join("");
    if (temp.charAt(temp.length-1) == '-'){
      temp = temp.substring(0,temp.length-1);
    }
    temp = temp.split("").reverse().join("");
    console.log('after: ' + str);
    console.log('[after insertHyphen] chars: ' + temp);
    return temp;
  }

  isPhoneNumberInHistory(phoneNumber: string):boolean{
    console.log('historyItems: ' + JSON.stringify(this.historyItems));
    let numberPatt = /\d+/g;

    let len = this.historyItems.length;
    for (var i=0; i<len; i++){
      let item : any = this.historyItems[i];
      var hisPhoneNumber = item.new_data;
      hisPhoneNumber = hisPhoneNumber.match(numberPatt).join("");
      if (phoneNumber == hisPhoneNumber)
        return true;
    }
    return false;
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
          if (contact.birthday == null){
            console.log("contact's birthday is NULL. Will set it to 1-Jan-1970");
            contact.birthday = new Date(0);
            console.log("contact's birday: " + JSON.stringify(contact.birthday));
          }
          contact.save().then(
            ()=> {
              //DO NOT KNOW WHY THIS FUNCTION NEVER CALLED.
              /*
              console.log('Contact saved! ', contact);
              this.addToHistory(info.oldTel, info.newTel);

              console.log('will remove phone number from GUI');
              this.removePhoneNumberUI(info);
              this.presentToast('Contact saved!');
              */
            },
            (error:any)=> {
//DO NOT KNOW WHY APP SAVED CONTACT OK BUT ALWAYS THROW UNDEFINED ERROR (CODE = 0) => WILL COPY CODE AFTER SAVING OK TO HERE
              /*
              console.error('Error saving contact: ' + JSON.stringify(error));
              this.presentToast('Error saving contact');
              */

              console.log('Contact saved! ', contact);
              this.addToHistory(info.oldTel, info.newTel);

              console.log('will remove phone number from GUI');
              this.removePhoneNumberUI(info);
              this.presentToast('Contact saved!');
            })
            .catch(error=>{console.log('Error Details: ' + JSON.stringify(error.message));});
        }
      }
    }
  }

  presentToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  addToHistory(old_data: string, new_data: string){
    console.log('will add to history table: old_data=' + old_data + ' new_data=' + new_data);
    let hisType = "ftac";
    var old_data = old_data;
    var new_data = new_data;
    var sql = "insert into history(his_type, old_data, new_data, dtcreated_dt) values(?,?,?,?)";
    sql = sql.replace("?", "'" + hisType + "'");
    sql = sql.replace("?", "'" + old_data + "'");
    sql = sql.replace("?", "'" + new_data + "'");
    sql = sql.replace("?", "'" + Date.now() + "'");
    this.db.executeSql(sql).then((result)=>{console.log('data: ' + JSON.stringify(result));});
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
