const Task = require ('../models/tasks');


module.exports = {
    index: async (req, res) => {
        try {
          const tasks = await Task.find({}); // Utilisation d'async/await pour récupérer les tâches
          res.render('todo.ejs', { todotasks: tasks });
        } catch (error) {
          console.error(`There was an error: ${error}`);
          res.status(500).send('An error occurred while fetching tasks.');
        }
      },
    create :(req,res)=>{
        const firstTask = new Task({title:req.body.title});
        firstTask.save().then(()=>res.redirect('/'))
        .catch((error) => {
            console.error(`Erreur lors de la création de la tâche : ${error}`);
            res.status(500).send('Erreur interne.');
        });    
    },
    edit :  async (req, res) => {
        const id = req.params.id;
        try {
            const tasks = await Task.findById(id); // Utilisation de `await` pour attendre la réponse
            res.render('todoEdit.ejs', { todotasks: [tasks], idTask: id }); // Passez la tâche unique dans un tableau pour réutiliser la logique du template
        } catch (err) {
            console.error(err);
            res.status(500).send('Erreur lors de la récupération de la tâche');
        }
    },
    update : (req, res) => {
        const id = req.params.id;
        Task.findByIdAndUpdate(id, { title: req.body.title })
            .then(() => res.redirect('/'))
            .catch(err => {
                console.error(`Erreur lors de la mise à jour : ${err}`);
                res.status(500).send('Erreur lors de la mise à jour de la tâche');
            });
    },
    delete : (req, res) => {
        Task.deleteOne({ _id: req.params.id })
            .then(result => {
                if (result.deletedCount === 1) {
                    res.redirect("/");
                } else {
                    res.status(404).send('Task not found');
                }
            })
            .catch(error => {
                res.status(500).send('Internal server error');
            });
    }
}