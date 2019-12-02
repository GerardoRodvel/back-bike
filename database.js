var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE almacen3(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            marca text, 
            rodada text, 
            color text,
            precio text,
            cantidad text,
            image text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO almacen3 (marca, rodada, color,precio,cantidad,image) VALUES (?,?,?,?,?,?)'
                db.run(insert, ["trek","r29","rojo","6000","2","https://trek.scene7.com/is/image/TrekBicycleProducts/1192600_2018_A_2_Slash_97?$responsive-pjpg$&cache=on,on&wid=1920&hei=1440"])
               /*  db.run(insert, ["giant","r28","verde","5000","3"])
                db.run(insert, ["scott","r27","negro","8000","1"]) */
            }
        });  
    }
});


module.exports = db