import { SQLite } from 'ionic-native';

export class DBStorage{

  static db: SQLite = new SQLite();
  static isConnected: boolean = false;

  constructor(){
    this.openDatabase();
  }

  openDatabase(){
    return new Promise(function(resolve, reject){
      DBStorage.db.openDatabase({
        name: 'data.db',
        location: 'default'
      }).then(
        (result)=> {
          console.log('Connected OK to database');
          DBStorage.isConnected = true;
          resolve(result);
        },
        (error) => {
          console.error('Failed to connect to database.' + error);
          DBStorage.isConnected = false;
          reject(error);
        });//end of then block
    });
  }
  executeSql(sql: string){
    return new Promise(function(resolve, reject){
      DBStorage.db.executeSql(sql, []).then(
        (result)=>{
          console.log('executed sql: ' + sql);
          resolve(result);
        },
        (error)=>{
          console.error('failed to execute the sql.\nSql: ' + sql + '.\nError: ' + JSON.stringify(error));
          reject(error);
        });//end of then block
    });
  }

  createTable(sql: string){
    this.executeSql(sql);
  }

/*
  deleteDatabase():boolean{
    var result : boolean = false;
    this.db.deleteDatabase('data.db').then(
      ()=> {
        console.log('Deleted OK to database');
        result = true;
      },
      (error) => {
        console.error('Failed to delete to database.' + error);
        result = false;
      });
      return result;
  }
*/
}
