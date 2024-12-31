// Importation des modules nécessaires
const express = require('express'); // Framework pour créer une application web
const mongoose = require('mongoose'); // ORM pour interagir avec MongoDB
const app = express();// Initialisation de l'application Express
// Configuration du moteur de vue à EJS pour rendre les pages dynamiquement
app.set("view engine","ejs")
// allow to read user data from body
// Middleware pour analyser les données envoyées via les formulaires HTML (encodage URL)
app.use(express.urlencoded({extended:true}))

// to connect with Database 
// deprecate worning to avoid errors 
mongoose.connect('mongodb://127.0.0.1:27017/ToDo' );

// schema : describe type of your data
// Définition d'un schéma Mongoose pour structurer les données des tâches
const schema = new mongoose.Schema({title:String});// Chaque tâche aura un champ `title` de type chaîne
// Modèle basé sur le schéma défini, permettant d'interagir avec la collection 'Task' dans MongoDB
const Task = mongoose.model('Task',schema);

//inset
app.post('/create',(req,res)=>{
    const firstTask = new Task({title:req.body.title});
    firstTask.save().then(()=>res.redirect('/'));    
})

//find/show 
app.get('/', async (req, res) => {
    try {
      const tasks = await Task.find({}); // Utilisation d'async/await pour récupérer les tâches
      res.render('todo.ejs', { todotasks: tasks });
    } catch (error) {
      console.error(`There was an error: ${error}`);
      res.status(500).send('An error occurred while fetching tasks.');
    }
  });
  



// app.get('/', async (req, res) => {
//     try {
//         // Création d'une nouvelle tâche avec le titre fourni dans l'URL
//         const tasks = await Task.find({});
//         res.render("todo.ejs", { todotasks: tasks }); // Passer les tâches au rendu pour les afficher dans votre EJS
//     } catch (error) {
//         console.error(`Il y a eu une erreur : ${error}`);
//         res.status(500).send('Erreur lors de la récupération des tâches.');
//     }
// });
// app.get('/', (req, res) => {
//     Task.find({}).then(tasks => {
//         tasks.forEach(task => console.log(task));
//         res.json(tasks); // Optionally, send the tasks back in the response
//     }).catch(error => {
//         console.log(`There was an error: ${error}`);
//         res.status(500).send("Error occurred while retrieving tasks");
//     });
// });

//delete 
app.get('/delete/:id', (req, res) => {
    Task.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result.deletedCount === 1) {
                console.log('One Task is deleted');
                res.status(200).send('Task deleted');
            } else {
                console.log('No task found with the provided ID');
                res.status(404).send('Task not found');
            }
        })
        .catch(error => {
            console.log(`There was an error: ${error}`);
            res.status(500).send('Internal server error');
        });
});

//update
app.get('/update/:id/:title', (req, res) => {
    Task.updateOne({ _id: req.params.id }, { title: req.params.title })
        .then(() => {
            console.log('task updated');
            res.send('Task updated');
        })
        .catch((error) => {
            console.log(`There was an error: ${error}`);
            res.status(500).send('Error updating task');
        });
});


app.listen(3000,()=>{console.log('express started!')})

