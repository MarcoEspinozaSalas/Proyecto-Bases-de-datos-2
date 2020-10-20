const express = require('express');
const router = express.Router();

router.post('/connect', (req,res) =>{
  const user = req.body.user;
  const password = req.body.password;
  const server = req.body.server;
  const database = req.body.database;
  const config = {
    user: user,
    password: password,
    server: server,
    database: database,
    options: {
      encrypt: false
    }
  };
  module.exports.config = config;
  let estado = 1;
  return res.status(200).json({mensaje:"Conectado al motor MSSQL", estado: estado});
});
module.exports.router = router;
