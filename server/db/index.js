const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/mongoTODO",{
   user:process.env.MONGODB_USERNAME,
   pass:process.env.MONGODB_PASSWORD,
   authSource: "admin",
   useNewUrlParser: true,
   useUnifiedTopology: true
})