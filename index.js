
const mongoose = require('mongoose');
const initdata = require('./data.js');
const listing = require('../models/listing.js');
//ppc const listing = require('../models/listing.js');

main()
.then(() => { console.log('MongoDB connection successful, connected to db'); })
.catch((err) =>{ console.log(err);});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    console.log('Connected to MongoDB');
}

const  initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    // await listing.insertMany(initdata.data) ppc;
    console.log("Database initialized with sample data");
};

initDB();
