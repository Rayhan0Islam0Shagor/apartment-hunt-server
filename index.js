const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q43xx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((err) => {
    const bookingsCollection = client
        .db('apartmentHunt')
        .collection('bookings');
    const rentsCollection = client.db('apartmentHunt').collection('rent');
    const addRentsCollection = client
        .db('apartmentHunt')
        .collection('add-rent');

    app.get('/bookings', (req, res) => {
        bookingsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.post('/bookings', (req, res) => {
        const bookings = req.body;
        bookingsCollection.insertOne(bookings).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    app.get('/rent', (req, res) => {
        rentsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.post('/rent', (req, res) => {
        const rents = req.body;
        rentsCollection.insertOne(rents).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    app.get('/add-rent', (req, res) => {
        addRentsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.post('/add-rent', (req, res) => {
        const AddedRents = req.body;
        addRentsCollection.insertOne(AddedRents).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });
});

app.listen(process.env.PORT || port);
