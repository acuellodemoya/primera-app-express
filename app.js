const express = require('express');
//const logger = require('./logger');
//const auth = require('./auth');
const userRouter = require('./routes/users');
const morgan = require('morgan');
const config = require('config');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'));
app.use('/api/users', userRouter);

//Exampleof Middlewares
//app.use(logger);
//app.use(auth);

//Manejo de entornos.
console.log(`Nombre: ${config.get('nombre')}`);
console.log(`DB Host: ${config.get('DB.Host')}`);

//Uso de middlewares de terceros (Morgan)
app.use(morgan('tiny'));
console.log('Morgan logger is active');




app.get('/', (req, res) => {
    res.send('Hello, World!');
});



const port = process.env.PORT || 3000
app.listen(port, ()=> {
    console.log(`Run on the port ${port}...`);
});


