// Importation des modules nécessaires
const express = require('express'); // Framework pour créer une application web
const mongoose = require('mongoose'); // ORM pour interagir avec MongoDB
const app = express();// Initialisation de l'application Express
const methodOverride = require('method-override');
const router = require('./routes/tasks')
const Task = require('./models/tasks')

app.use(methodOverride('_method',{methods: ['POST','GET']}));
app.set("view engine","ejs") 
app.use(express.urlencoded({extended:true}))
app.use('/',router)
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/ToDo' );


// app.listen(3000,()=>{console.log('express started!')})
app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});


