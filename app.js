const express = require('express'); // Useful to create Express applications
const bodyParser = require('body-parser'); // Useful to transform requests body to JSON (ie usable JS objets)
const mongoose = require('mongoose'); // Useful to connect the app to the MongoDB database

const Product = require('./models/product'); // Imports the data model

const app = express(); // Creates an Express app

// To connect the API to MongoDB database (thanks to Mongoose)
mongoose.connect('mongodb+srv://cdesurmo:BBTbh6wm@clustercoursbackend.bg6ef.mongodb.net/coursbackend?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// To avoid CORS errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// To transform requests body to JSON (ie usable JS objets)
app.use(bodyParser.json());


// POST route
app.post('/api/products', (req, res, next) => {
    delete req.body._id; // To delete the wrong _id (the one sent by the frontend) before copying the object
    const product = new Product({
        ...req.body // To copy all elements from request body
    });
    product.save() // Save the Product in the DB, and send back a Promise
        .then(product => res.status(201).json({ product }))
        .catch(error => res.status(400).json({ error }));
});

// Individual GET route
app.get('/api/products/:id', (req, res, next) => {
    Product.findOne({ _id: req.params.id }) // We want the product which ID is equal to the one found in the request params
        .then(product => res.status(200).json( { product }))
        .catch(error => res.status(404).json({ error }));
});

// Individual PUT route (for one product modification)
app.put('/api/products/:id', (req, res, next) => {
    // Premier argu = objet de comparaison pour savoir quel objet on modifie (ici : celui dont l'ID est égal à l'ID envoyé en param de la requête)
    // Deuxième argu = nouvelle version de l'objet (ici : recupère le Thing du corps de la requête en indiquant bien de nouveau que son id doit correspondre à celui en param de la requête)
    Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Modified!' }))
        .catch(error => res.status(400).json({ error }));
});

// Individual DELETE route (for one product deletion)
app.delete('/api/products/:id', (req, res, next) => {
    Product.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Deleted! ' }))
        .catch(error => res.status(400).json({ error }));
});

// Global GET route
app.get('/api/products', (req, res, next) => {
    Product.find()
        .then(products => res.status(200).json( { products }))
        .catch(error => res.status(400).json({error}));
});

module.exports = app;
