const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri = `mongodb+srv://${MyConstants.DB_USER}:${MyConstants.DB_PASS}@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Connected to MongoDB: ${MyConstants.DB_DATABASE}`))
    .catch(err => console.error('Database connection error:', err));
