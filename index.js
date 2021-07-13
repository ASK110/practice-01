const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const {LoginData} = require("./contents/schema")
require("./contents/conn")
const port = process.env.PORT || 8080 ;
const {staticPath,viewPath,partialsPath} = require("./contents/path")

const JWT_Secret = "sahfyuasgascgsdg526512@###())}{}iushdchuds932784"
//  starting app
const app = express()
//  adding static folder
app.use(express.static(staticPath))
app.use(bodyParser.json())
//  addind view engine
app.set('view engine','hbs')
//  setting view as templates
app.set('views',viewPath)
//  registering Partials Folder
hbs.registerPartials(partialsPath)

app.get("/register",(req,res)=>{
	console.log("register")
	res.render("index")
})
app.get("/login",(req,res)=>{
    console.log("login")
    res.render("login")
})
app.post("/api/Login-db",async (req,res)=>{
    const {user:username,password:simpleText} = req.body;

    const user = await LoginData.findOne({username}).lean()
    if (!user){
        return res.json({status:"error",error:"Invalid Username/Password"})
    }

    if (await bcrypt.compare(simpleText,user.password)){
        const token = jwt.sign({id:user._id, username: user.username},JWT_Secret)
        return res.json({status:"ok",data:token})
    }
    res.json({status:"error",error:"Invalid Username/Password"})
})
app.post("/api/Register-db",async (req,res)=>{

    const {user,password:simpleText} = req.body;
    if(!user || typeof user!=='string'){
        return res.json({status:"error",error:"Invalid Username"})
    }
    if(!simpleText || typeof simpleText!=='string'){
        return res.json({status:"error",error:"Invalid Password"})
    }
    if (simpleText.length < 8){
        return res.json({status:"error",error:"Password too small, should be atleast 8 characters"})
    }

    const password = await bcrypt.hash(simpleText,10)
	try{
        const dataL = new LoginData({username:user,password})
        const createuser = await LoginData.collection.insertMany([dataL]);

        res.status(201).json({status: 'ok'})
    }catch(e){
        if (e.code === 11000){
            return res.json({status: 'error',error: "Username already in use"})
        }
        throw e
        res.status(400)
    }
})
app.listen(port,()=>{
	console.log(`Listening on ${port} ....`)
})