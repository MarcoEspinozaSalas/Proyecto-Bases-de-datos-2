//Constantes
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const conn = require('./dbconnPGSQL');
//Usar las rutas
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

//Obtener test en PostgreSQL
router.get('/', (req, res) => {
  conn.query('select obtenerPersonas()').then(response => {
    return response;
  }).then(val => {
    conn.end();
    if (val.rowCount < 1) return res.status(200).json({mensaje:"No hay datos"});
    else if (val.rowCount >= 1) return res.status(200).json(val.rows);
    else return res.status(400).json({mensaje:"Indefinido"});
  }).catch(err => {
    conn.end();
    console.error(err);
    err.status = 500;
    return next(err);
  });
});



module.exports = router;
