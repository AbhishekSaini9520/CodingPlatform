const express = require('express')
const app = express();
require("dotenv").config();
const main = require('./config/db')
const cookieParser = require('cookie-parser');
const userAuth = require('./routes/userAuth')
const redisClient = require('./config/redis')
const problemRouter = require('./routes/problemCreator')
const submitRouter = require('./routes/submit')

app.use(express.json());
app.use(cookieParser());

app.use('/user',userAuth);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);

const InitalizeConnection = async ()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");

        app.listen(process.env.PORT, ()=>{
            console.log("Listening at the port number: " + process.env.PORT)
        })

    }
    catch(error){
        console.log("DB is not connected , Error: ", error);
    }
}

InitalizeConnection();

// main()
// .then(async ()=>{

//     app.listen(process.env.PORT, ()=>{
//         console.log("Listening at the port number: " + process.env.PORT)
//     })
// })
// .catch((error) => {
//     console.log(error);
// })