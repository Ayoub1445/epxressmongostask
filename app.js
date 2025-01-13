// Importation des modules nécessaires
const express = require('express'); // Framework pour créer une application web
const mongoose = require('mongoose'); // ORM pour interagir avec MongoDB
const app = express();// Initialisation de l'application Express

const methodOverride = require('method-override');
app.use(methodOverride('_method',{methods: ['POST','GET']}));

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
  

//delete 

app.delete('/delete/:id', (req, res) => {
    Task.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result.deletedCount === 1) {
                console.log('One Task is deleted');
                res.redirect("/");
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
app.get('/update/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const tasks = await Task.findById(id); // Utilisation de `await` pour attendre la réponse
        res.render('todoEdit.ejs', { todotasks: [tasks], idTask: id }); // Passez la tâche unique dans un tableau pour réutiliser la logique du template
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération de la tâche');
    }
});


app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    Task.findByIdAndUpdate(id, { title: req.body.title })
        .then(() => res.redirect('/'))
        .catch(err => {
            console.error(`Erreur lors de la mise à jour : ${err}`);
            res.status(500).send('Erreur lors de la mise à jour de la tâche');
        });
});




app.listen(3000,()=>{console.log('express started!')})

