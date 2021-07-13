const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/login-db",{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true})
.then(()=>console.log("Database Connected..."))
.catch((error)=>console.log(error))