const mongoose = require("mongoose");

const todoSK = new mongoose.Schema({
   user_id : {type: mongoose.Schema.Types.ObjectId, ref:"User"},
   title: String,
   description: String
});

const Todo = mongoose.model("Todo",todoSK);

module.exports = Todo