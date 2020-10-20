const { Pool } = require('pg');
const express = require('express');
const router = express.Router();

const pool = new Pool({
  host: String,
  user: String,
  password: String,
  database: String,
  port: String
});


router.post('/connect', (req,res) =>{
  const host = req.body.host;
  const user = req.body.user;
  const password = req.body.password;
  const database = req.body.database;
  const port = req.body.port;

  pool.options.host =host;
  pool.options.user =user;
  pool.options.password =password;
  pool.options.database =database;
  pool.options.port =port;
  let estado = 1;
  return res.status(200).json({mensaje:"Conectado al motor PSGQL", estado: estado});
});
module.exports.pool = pool;
module.exports.router = router;
