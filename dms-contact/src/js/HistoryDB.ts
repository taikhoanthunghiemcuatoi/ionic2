import { DBStorage } from './db-storage.ts';

export class HistoryDB {

  db = new DBStorage();
  constructor(){
    this.db.openDatabase();
  }

  getAll(done: (items)=>{}){
    let sql = "SELECT his_type, old_data, new_data, dtcreated_dt FROM history";
    this.db.executeSql(sql).then(
      (result)=>{
        var items: Array<Object> = [];
        let len = result.rows.length;

        for (var i=0; i<len; i++){
          var dtString = result.rows.item(i).dtcreated_dt;//'1487417651803';
          let dtNumber = parseInt(dtString);
          let dt = new Date(dtNumber);
          items.push({
            his_type: result.rows.item(i).his_type,
            old_data: result.rows.item(i).old_data,
            new_data: result.rows.item(i).new_data,
            dtcreated_dt: dt.toLocaleString()
          });
        }
        done(items);
      },
      (error)=>{}
     );
  }
}
