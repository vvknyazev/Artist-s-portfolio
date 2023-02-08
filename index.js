const mongoose = require('mongoose');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require("path");
const artRoutes = require('./routes/routes');
const authRoutes = require('./routes/authRouter');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser} = require('./middleware/authorization');


const PORT = process.env.PORT || 4000;

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cookieParser());

app.get('/', checkUser);
app.use(artRoutes);
app.use("/auth", authRoutes);
async function start() {
    try {
        await mongoose.connect('mongodb+srv://vvknyazev:8WL8Ah6LOmSLj58e@cluster0.kovua2p.mongodb.net/pictures', {
            useNewUrlParser: true
        });
        app.listen(PORT, (e) => {
            if (e) console.log(e);
            console.log('Server has been started on port: ' + PORT);
        });
    } catch (e) {
        console.log(e);
    }
}

start();