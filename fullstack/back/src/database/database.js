import mysql from "promise-mysql";
import config from "./../config";



const pool1 = mysql.createPool({
    connectionLimit: 10,
    host: config.db1.host,
    database: config.db1.database,
    user: config.db1.user,
    password: config.db1.password
  });
  
  const pool2 = mysql.createPool({
    connectionLimit: 10,
    host: config.db2.host,
    database: config.db2.database,
    user: config.db2.user,
    password: config.db2.password
  });
  
  const pool3 = mysql.createPool({
    connectionLimit: 10,
    host: config.db3.host,
    database: config.db3.database,
    user: config.db3.user,
    password: config.db3.password
  });
  
  const getConnection = (db) => {
    switch (db) {
        case 'pool1':
            return pool1;
        case 'pool2':
            return pool2;
        case 'pool3':
            return pool3;
        default:
            throw new Error(`Database ${db} not supported`);
    }
};
  
  module.exports = {
    getConnection
  };