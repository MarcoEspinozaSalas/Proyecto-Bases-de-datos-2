//Constantes
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sql = require('mssql');
const conn = require('./dbconn');
const routePool = new sql.ConnectionPool(conn);
//Usar las rutas
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


//Test generateInsert
router.post('/', (req, res) => {
  const schema = req.body.schema;
  const table = req.body.table;
  if (!schema || !table){

      return res.status(400).json({mensaje:'Falta datos'});

  }

  routePool.connect().then(pool => {
    return pool.request()
    .input('schema', sql.VarChar(50), schema)
    .input('table', sql.VarChar(50), table)
    //.ouput       -------------- para obtener el error desde base de datos
    .execute('generate_insert')
  }).then(val => {
    routePool.close();
    if (val.recordset === []) return res.status(200).json({mensaje:"Indefinido"});
    let estado = val.recordset[0][''];
    if (estado === 1) return res.status(201).json({mensaje:"Se insertó", estado: estado});
    else if (estado === 0) return res.status(200).json({mensaje:"No se insertó, ya existe", estado: estado});
    else return res.sendStatus(418);
  }).catch(err => {
    routePool.close();
    if(err.message){
      return res.status(400).json({estado: -5})
    }
    console.error(err);
    err.status = 500;
    return next(err);
  });
});

module.exports = router;
