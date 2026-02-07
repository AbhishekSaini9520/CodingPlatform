const validate = require('../utils/validator')
const bcrypt = require('bcrypt');
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const Submission = require('../models/submission')

const register = async(req, res) =>{

    try{

        // validate the user
        validate(req.body);
        const {firstName, emailId, password } = req.body;

        // bcrypt the password
        req.body.password = await bcrypt.hash(password,10);

        req.body.role = 'user';

        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
        res.status(400).send("Error: Email already registered.");
        return;
        }

        const user = await User.create(req.body);

        const token = jwt.sign({_id: user._id, emailId: user.emailId, role: user.role},process.env.JWT_KEY,{expiresIn: 60*60});

        res.cookie('token', token, {maxAge: 60*60*1000});        
        res.status(201).send("User Reginster Successfully");

    }
    catch(error){
        res.status(400).send("Error: "+error);
    }   
}

const login = async(req, res)=>{

    try{
        const {emailId , password } = req.body;

        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        // find user
        const user = await User.findOne({emailId})

        // match password
        const match = bcrypt.compare(password,user.password);
        if(!match)
            throw new Error("Invalid Credentials");

        // create token for cookie
        const token = jwt.sign({_id: user._id, emailId : user.emailId , role: user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token', token, {maxAge: 60*60*1000});
        res.status(201).send("Login Successfully");

    }
    catch(error){
        res.status(400).send("Error: " + error);
    }
}

const logout = async(req,res)=>{
    try{
        const {token} = req.cookies;

        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);

        //    Token add kar dung Redis ke blockList
        //    Cookies ko clear kar dena.....

        res.cookie("token",null,{expires: new Date(Date.now())});
        res.send("Logged Out Successfully");
    }
    catch(error){
        console.status(503).log("Error: " + error);
    }
}

const adminRegister = async(req,res)=>{
    try{

        console.log(req.cookies.role);
        // validate the user
        console.log(req.body);
        validate(req.body);
        const {firstName, emailId, password } = req.body;

        // bcrypt the password
        req.body.password = await bcrypt.hash(password,10);

        req.body.role = 'admin';

        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
        res.status(400).send("Error: Email already registered.");
        return;
        }

        const user = await User.create(req.body);

        const token = jwt.sign({_id: user._id, emailId: user.emailId, role: user.role},process.env.JWT_KEY,{expiresIn: 60*60});

        res.cookie('token', token, {maxAge: 60*60*1000});        
        res.status(201).send("User Reginster Successfully");

    }
    catch(error){
        res.status(400).send("Error: "+error);
    }
}

const deleteProfile = async(req,res)=>{
    try{
        const userId = req.result._id;
        
        await User.findByIdAndDelete(userId);

        await Submission.deleteMany({userId});

        res.status(200).send("Delete Successfully");
        
    }
    catch(err){
        res.status(400).send("Internal Server Error");

    }
}

module.exports = {register, login, logout, adminRegister, deleteProfile};

