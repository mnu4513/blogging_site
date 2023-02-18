const express = require('express');
const app = express();
app.use(express.json());

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://mnu4513:1234qwer@firstcluster.daae6aq.mongodb.net/blogging_site', {useNewUrlParser: true})
.then(() => console.log('mongoDB connected'))
.catch(err => console.log(err.msg));

const route = require('./routes/route.js');
app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('app is running at port ' + (process.env.PORT || 3000))
});