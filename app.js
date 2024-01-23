const express = require('express');
const app= express();
const methodOverride=require('method-override')
const dotenv=require('dotenv');
const expressLayout=require('express-ejs-layouts');
const { connectDb } = require('./server/DB/connect');
const cookiePaser=require('cookie-parser');
const MongoStore=require('connect-mongo');
const session=require('express-session')
dotenv.config();
app.use(express.static('public'));

//template engine
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');
app.use(session({
    secret:"Evil Cat",
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({
        mongoUrl:process.env.MONGO_URI
    })
}))
app.use(methodOverride('_method'))

const PORT=process.env.PORT||3000;
const url=process.env.MONGO_URI;;

//connecting the DataBase
connectDb(url);
//middlewares
app.use(cookiePaser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/',require('./server/Routes/routes'));
app.use('/',require('./server/Routes/admin'));

app.listen(5001,()=>{
    console.log(`server running at http://localhost:${PORT}`)
})

