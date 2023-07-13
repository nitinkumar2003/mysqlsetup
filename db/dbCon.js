// const Notifier = require('./initialDbScript.js').Emitter
const mysql=require('mysql2')
const fs=require('fs')
const events = require("events");
const createTableEvent=new events.EventEmitter()
const newEvent=new events.EventEmitter()
const spQueryArray =require('./spSrcipt')

const connectionCred={
    user: process.env.DB_SERVER_USERNAME,
    port: process.env.DB_SERVER_PORT,
    password: process.env.DB_SERVER_PASSWORD,
    host: process.env.DB_SERVER_HOST,
}

const db = mysql.createConnection(connectionCred)



db.connect(async (error) => {
    if (error) {
      console.log('Error in connection of database', error);
    } else {
      console.log('Connected to your Database');
     db.query('CREATE DATABASE IF NOT EXISTS testdb2',(error,res)=>{
        if (error) throw error;
        console.log('Database created successfully!',error,res);
     })
     db.query('USE testdb2', (error, results, fields) => {
        if (error) throw error;
        console.log('Using database: testdb');
      });
      newEvent.emit('createTable',db.promise())
      newEvent.emit('createSp',db.promise())
    }
  });


  newEvent.on('createTable',(db)=>createTable(db))
  newEvent.on('createSp',(db)=>createSp(db))
  async function createTable(db){
    try {
      var queries = fs.readFileSync(__dirname + '/tableScript.sql').toString();
      const createQuery = queries.split(';').filter(q => q.trim() !== '');
      if(createQuery.length > 0){
        for( let query of createQuery ){
            try {
                await db.query(query);
                console.log("Query executed successfully")
            }
            catch (error) {
                console.log("error in initial queries", error.message);
            }
        }
    }
       
    }  catch(error){
      console.log("error",error.message)
  }
  } 
  async function createSp(db){
    if(spQueryArray.length > 0){
      for( let query of spQueryArray ){
          try {
              await db.query(query);
              console.log(" sp Query executed successfully")
          }
          catch (error) {
              console.log(" sp error in initial queries", error.message);
          }
      }
  }

  }

  module.exports = db.promise()
