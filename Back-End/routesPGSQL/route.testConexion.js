//Constantes
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const conn = require('./dbconnPGSQL').pool;
//Usar las rutas
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

//Generate insert
router.post('/insert', (req, res) => {
  const schema = req.body.schema;
  const table = req.body.table;
  const state = req.body.state;
  if (!schema || !table || !state){
      return res.status(400).json({mensaje:'Falta datos'});
  }
  conn.query('select generate_insert(' + '\'' + schema + '\'' + ',' + '\'' + table + '\'' + ',' + state+ ')').then(response => {
    return response;
  }).then(val => {
    //conn.end();
    if (val.rowCount < 1) return res.status(200).json({mensaje:"No hay datos"});
    else if (val.rowCount >= 1) return res.status(200).json(val.rows);
    else return res.status(400).json({mensaje:"Indefinido"});
  }).catch(err => {
    //conn.end();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});

//Generate select
router.post('/select', (req, res) => {
  const schema = req.body.schema;
  const table = req.body.table;
  const state = req.body.state;
  if (!schema || !table || !state){
      return res.status(400).json({mensaje:'Falta datos'});
  }
  conn.query('select generate_select(' + '\'' + schema + '\'' + ',' + '\'' + table + '\'' + ',' + state+ ')').then(response => {
    return response;
  }).then(val => {
    //conn.end();
    if (val.rowCount < 1) return res.status(200).json({mensaje:"No hay datos"});
    else if (val.rowCount >= 1) return res.status(200).json(val.rows);
    else return res.status(400).json({mensaje:"Indefinido"});
  }).catch(err => {
    //conn.end();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});

//Generate update
router.post('/update', (req, res) => {
  const schema = req.body.schema;
  const table = req.body.table;
  const state = req.body.state;
  if (!schema || !table || !state){
      return res.status(400).json({mensaje:'Falta datos'});
  }
  conn.query('select generate_update(' + '\'' + schema + '\'' + ',' + '\'' + table + '\'' + ',' + state+ ')').then(response => {
    return response;
  }).then(val => {
    //conn.end();
    if (val.rowCount < 1) return res.status(200).json({mensaje:"No hay datos"});
    else if (val.rowCount >= 1) return res.status(200).json(val.rows);
    else return res.status(400).json({mensaje:"Indefinido"});
  }).catch(err => {
    //conn.end();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});
//Generate delete
router.post('/delete', (req, res) => {
  const schema = req.body.schema;
  const table = req.body.table;
  const state = req.body.state;
  if (!schema || !table || !state){
      return res.status(400).json({mensaje:'Falta datos'});
  }
  conn.query('select generate_delete(' + '\'' + schema + '\'' + ',' + '\'' + table + '\'' + ',' + state+ ')').then(response => {
    return response;
  }).then(val => {
    //conn.end();
    if (val.rowCount < 1) return res.status(200).json({mensaje:"No hay datos"});
    else if (val.rowCount >= 1) return res.status(200).json(val.rows);
    else return res.status(400).json({mensaje:"Indefinido"});
  }).catch(err => {
    //conn.end();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});
//Obtener schemas
router.get('/schemas', (req, res) => {
  conn.query('select get_schemas();').then(response => {
    return response;
  }).then(val => {
    //conn.end();
    if (val.rowCount < 1) return res.status(200).json({mensaje:"No hay datos"});
    else if (val.rowCount >= 1) return res.status(200).json(val.rows);
    else return res.status(400).json({mensaje:"Indefinido"});
  }).catch(err => {
    //conn.end();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});

//Obtener tablas por el schema
router.post('/tablesSchema', (req, res) => {
  const schema = req.body.schema;
  if (!schema){
      return res.status(400).json({mensaje:'Falta datos'});
  }
  conn.query('select get_tables(' + '\'' + schema + '\'' + ')').then(response => {
    return response;
  }).then(val => {
    //conn.end();
    if (val.rowCount < 1) return res.status(200).json({mensaje:"No hay datos"});
    else if (val.rowCount >= 1) return res.status(200).json(val.rows);
    else return res.status(400).json({mensaje:"Indefinido"});
  }).catch(err => {
    //conn.end();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});
//Crear schema
router.post('/crearSchema', (req, res) => {
  const schema = req.body.schema;
  if (!schema){
      return res.status(400).json({mensaje:'Falta datos'});
  }
  conn.query('select create_schema(' + '\'' + schema + '\'' + ')').then(response => {
    return response;
  }).then(val => {
    //conn.end();
    if (val.rowCount < 1) return res.status(200).json({mensaje:"No hay datos"});
    else if (val.rowCount >= 1) return res.status(200).json(val.rows);
    else return res.status(400).json({mensaje:"Indefinido"});
  }).catch(err => {
    //conn.end();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});

module.exports = router;
