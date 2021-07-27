const express = require('express');
const Joi = require('joi');
const usersRouter = express.Router();


let users= [
    {id: 1, name:'Alejandro'},
    {id: 2, name:'Toby'},
    {id: 3, name:'Otto'}
];

usersRouter.get('/', (req, res) => {
    res.send(users);
});

usersRouter.get('/:id', (req, res) => {
    let user = userExist(req.params.id);
    if(!user){
        res.status(404).send('User not found');
        return;
    }
    res.send(user);
});

usersRouter.post('/', (req, res) => {

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

usersRouter.put('/:id', (req, res) =>{

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

usersRouter.delete('/:id', (req, res)=> {
    let user = userExist(req.params.id);
    if(!user){
        res.status(404).send('User not found');
        return;
    }

    const index = users.indexOf(user);
    users.splice(index, 1);
    res.send('User deleted');
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

module.exports = usersRouter;