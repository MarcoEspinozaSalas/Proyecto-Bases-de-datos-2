//Constantes
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sql = require('mssql');
//Usar las rutas
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

//Test generateInsert
router.post('/insert', (req, res) => {
  const conn = require('./dbconnMSSQL').config;
  const routePool = new sql.ConnectionPool(conn);
  const schema = req.body.schema;
  const table = req.body.table;
  const state = req.body.state;
  if (!schema || !table || !state){
      return res.status(400).json({mensaje:'Falta datos'});
  }
  routePool.connect().then(pool => {
    return pool.request()
    .input('schema', sql.VarChar(50), schema)
    .input('table', sql.VarChar(50), table)
    .input('state', sql.VarChar(50), state)
    .execute('generate_insert')
  }).then(val => {
    routePool.close();
    if (val.recordset === []) return res.status(200).json({mensaje:"Indefinido"});
    let estado = val.recordset[0][''];
    if (val.recordset[0].sql_code !== '') return res.status(201).json({mensaje:"Procedimiento Insert Creado", estado: 1});
    else if (estado === 0) return res.status(200).json({mensaje:"Falló el procedimiento generador", estado: 0});
    else return res.sendStatus(418);
  }).catch(err => {
    routePool.close();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});

//Test generateSelect
router.post('/select', (req, res) => {
  const conn = require('./dbconnMSSQL').config;
  const routePool = new sql.ConnectionPool(conn);
  const schema = req.body.schema;
  const table = req.body.table;
  const state = req.body.state;
  if (!schema || !table || state){
      return res.status(400).json({mensaje:'Falta datos'});
  }
  routePool.connect().then(pool => {
    return pool.request()
    .input('schema', sql.VarChar(50), schema)
    .input('table', sql.VarChar(50), table)
    .input('state', sql.VarChar(50), state)
    .execute('generate_select')
  }).then(val => {
    routePool.close();
    if (val.recordset === []) return res.status(200).json({mensaje:"Indefinido"});
    let estado = val.recordset[0][''];
    if (val.recordset[0].sql_code !== '') return res.status(201).json({mensaje:"Procedimiento Select Creado", estado: 1});
    else if (estado === 0) return res.status(200).json({mensaje:"Falló el procedimiento generador", estado: 0});
    else return res.sendStatus(418);
  }).catch(err => {
    routePool.close();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});

//Test generateUpdate
router.post('/update', (req, res) => {
  const conn = require('./dbconnMSSQL').config;
  const routePool = new sql.ConnectionPool(conn);
  const schema = req.body.schema;
  const table = req.body.table;
  const filter = req.body.filter;
  const state = req.body.state;
  if (!schema || !table || state){
      return res.status(400).json({mensaje:'Falta datos'});
  }
  routePool.connect().then(pool => {
    return pool.request()
    .input('schema', sql.VarChar(50), schema)
    .input('table', sql.VarChar(50), table)
    .input('filter', sql.VarChar(50), filter)
    .input('state', sql.VarChar(50), state)
    .execute('generate_update')
  }).then(val => {
    routePool.close();
    if (val.recordset === []) return res.status(200).json({mensaje:"Indefinido"});
    let estado = val.recordset[0][''];
    if (val.recordset[0].sql_code !== '') return res.status(201).json({mensaje:"Procedimiento Update Creado", estado: 1});
    else if (estado === 0) return res.status(200).json({mensaje:"Falló el procedimiento generador", estado: 0});
    else return res.sendStatus(418);
  }).catch(err => {
    routePool.close();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});


//Test generateDelete
router.post('/delete', (req, res) => {
  const conn = require('./dbconnMSSQL').config;
  const routePool = new sql.ConnectionPool(conn);
  const schema = req.body.schema;
  const table = req.body.table;
  const filter = req.body.filter;
  const state = req.body.state;
  if (!schema || !table || filter || state){
      return res.status(400).json({mensaje:'Falta datos'});
  }
  routePool.connect().then(pool => {
    return pool.request()
    .input('schema', sql.VarChar(50), schema)
    .input('table', sql.VarChar(50), table)
    .input('filter', sql.VarChar(50), filter)
    .input('state', sql.VarChar(50), state)
    .execute('generate_delete')
  }).then(val => {
    routePool.close();
    if (val.recordset === []) return res.status(200).json({mensaje:"Indefinido"});
    let estado = val.recordset[0][''];
    if (val.recordset[0].sql_code !== '') return res.status(201).json({mensaje:"Procedimiento Delete Creado", estado: 1});
    else if (estado === 0) return res.status(200).json({mensaje:"Falló el procedimiento generador", estado: 0});
    else return res.sendStatus(418);
  }).catch(err => {
    routePool.close();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});

//Test get_tables_schema
router.post('/tablesSchema', (req, res) => {
  const conn = require('./dbconnMSSQL').config;
  const routePool = new sql.ConnectionPool(conn);
  const schema = req.body.schema;
  if (!schema){
      return res.status(400).json({mensaje:'Falta datos'});
  }
  routePool.connect().then(pool => {
    return pool.request()
    .input('schema', sql.VarChar(50), schema)
    .execute('get_tables_schema')
  }).then(val => {
    routePool.close();
    if (val.recordset === []) return res.status(200).json({mensaje:"Indefinido"});
    let estado = val.recordset[0][''];
    if (estado === 1) return res.status(201).json({mensaje:"Se insertó", estado: estado});
    else if (estado === 0) return res.status(200).json({mensaje:"No se insertó, ya existe", estado: estado});
    else return res.sendStatus(418);
  }).catch(err => {
    routePool.close();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});

//Obtener labor
router.get('/Schemas', (req, res) => {
  routePool.connect().then(pool => {
    return pool.request()
    .execute('get_schemas')
  }).then(val => {
    routePool.close();
    if (val.recordset === undefined) return res.status(404).json({mensaje:"No hay datos"});
    //Este console.log es para saber el formato en que lo mando
    return res.status(200).json(val.recordset);
  }).catch(err => {
    routePool.close();
    console.error(err);
    err.status = 500;
    return next(err);
  });

});







module.exports = router;
