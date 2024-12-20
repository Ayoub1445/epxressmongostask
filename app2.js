const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');


// use res.render to load up an ejs view file
app.get('/', function(req, res) {
  res.render('index');
});


app.listen(3000,()=>console.log("express has started"));