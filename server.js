// Create express app
var express = require("express")
var app = express()
var db = require("./database");
const cors = require('cors');
var bodyParser = require("body-parser");
app.use(cors({
    origin:'*'
}));

const corsOptions = {
    origin: [process.env.URL, '*']
  }
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Todo saldra bien"})
});

//  API endpoints
app.get("/api/bikes", (req, res, next) => {
    var sql = "select * from almacen"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});
//traer por id
app.get("/api/bikes/:id", (req, res, next) => {
    var sql = "select * from almacen where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

app.post("/api/bikes/", (req, res, next) => {
    var errors=[]
    if (!req.body.marca){
        errors.push("No marca specified");
    }
    if (!req.body.rodada){
        errors.push("No rodada specified");
    }
    if (!req.body.color){
        errors.push("No color specified");
    }
    if (!req.body.precio){
        errors.push("No precio specified");
    }
    if (!req.body.cantidad){
        errors.push("No cantidad specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        marca: req.body.marca,
        rodada: req.body.rodada,
        color: req.body.color,
        precio: req.body.precio,
        cantidad: req.body.cantidad
    }
    var sql ='INSERT INTO almacen (marca, rodada, color,precio,cantidad) VALUES (?,?,?,?,?)'
    var params =[data.marca, data.rodada, data.color, data.precio,data.cantidad]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.patch("/api/bikes/:id", (req, res, next) => {
    var data = {
        marca: req.body.marca,
        rodada: req.body.rodada,
        color: req.body.color,
        precio: req.body.precio,
        cantidad: req.body.cantidad
    }
    db.run(
        `UPDATE almacen set 
           marca = COALESCE(?,marca), 
           rodada = COALESCE(?,rodada), 
           color = COALESCE(?,color),
           precio = COALESCE(?,precio),
           cantidad = COALESCE(?,cantidad) 
           WHERE id = ?`,
        [data.marca, data.rodada, data.color, data.precio, data.cantidad, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

app.delete("/api/bikes/:id", (req, res, next) => {
    db.run(
        'DELETE FROM almacen WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
