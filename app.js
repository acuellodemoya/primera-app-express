const express = require('express');
const Joi = require('joi');
//const logger = require('./logger');
//const auth = require('./auth');
const morgan = require('morgan');
const config = require('config');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'));

//Exampleof Middlewares
//app.use(logger);
//app.use(auth);

//Manejo de entornos.
console.log(`Nombre: ${config.get('nombre')}`);
console.log(`DB Host: ${config.get('DB.Host')}`);

//Uso de middlewares de terceros (Morgan)
app.use(morgan('tiny'));
console.log('Morgan logger is active');


let users= [
    {id: 1, name:'Alejandro'},
    {id: 2, name:'Toby'},
    {id: 3, name:'Otto'}
];

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/api/users', (req, res) => {
    res.send(users);
});

app.get('/api/users/:id', (req, res) => {
    let user = userExist(req.params.id);
    if(!user){
        res.status(404).send('User not found');
        return;
    }
    res.send(user);
});

app.post('/api/users', (req, res) => {

    const {error, value} = userValidate(req.body.name);

    if(!error){
        let user = {
            id: users.length + 1,
            name: req.body.name
        }
        users.push(user);
        res.send(users);
    }else{
        res.status(400).send(error.details[0].message);
        return;
    }
});

app.put('/api/users/:id', (req, res) =>{

    //Validate that the user exists.
    //let user = users.find(u => u.id === +req.params.id);
    let user = userExist(req.params.id)
    if(!user){
        res.status(404).send('User not found');
        return;
    }

    //Validate that the new name is correct.

    const {error, value} = userValidate(req.body.name);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    //rename the user.
    user.name = value.name;
    res.send(user);
});

app.delete('/api/users/:id', (req, res)=> {
    let user = userExist(req.params.id);
    if(!user){
        res.status(404).send('User not found');
        return;
    }

    const index = users.indexOf(user);
    users.splice(index, 1);
    res.send('User deleted');
});

app.listen(3000, ()=> {
    console.log('Run on the port 3000...');
});


//extra functions.
const userExist = (id) => {
    return(users.find(u => u.id === +id));
};

const userValidate = (validName) => {
    const schema = Joi.object({
        name: Joi.string().min(3)
    });

    return(schema.validate({name: validName}));
};