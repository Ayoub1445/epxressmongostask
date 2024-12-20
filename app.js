const express = require('express');
const mongoose = require('mongoose');
const app = express();

// to connect with Database 
// deprecate worning to avoid errors 
mongoose.connect('mongodb://127.0.0.1:27017/ToDo' );

// schema : describe type of your data
const schema = new mongoose.Schema({title:String});
const Task = mongoose.model('Task',schema);

//inset
app.get('/create/:title',(req,res)=>{
    const firstTask = new Task({title:req.params.title});
    firstTask.save().then(()=>{console.log('new record inserted');});    
})

//find/show 
app.get('/', (req, res) => {
    Task.find({}).then(tasks => {
        tasks.forEach(task => console.log(task));
        res.json(tasks); // Optionally, send the tasks back in the response
    }).catch(error => {
        console.log(`There was an error: ${error}`);
        res.status(500).send("Error occurred while retrieving tasks");
    });
});

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