const mongoose = require("mongoose");
const crypto = require('crypto');

const userSK = new mongoose.Schema({
   username: { type: String, required: true, index: { unique: true } },
   password: { type: String, required: true },
   gender: {
      type: String,
      enum: ['male', 'female'],
      default: null
   },
   todos: [{type: mongoose.Schema.Types.ObjectId, ref: "Todo"}]
},
   {
      timestamps: {
         createdAt: 'created_at',
         updatedAt: 'updated_at'
      }
   })

userSK.pre("save", function (next) {
   var user = this;
   if (!user.isModified('password')) return next();

   user.password = crypto.createHash("sha256").update(user.password).digest('base64');
   next();
})

userSK.pre(["find","findOne"], function (next) {
   const userQuery  = this;

   if(!userQuery._conditions.password)
      next()
   
   userQuery._conditions.password = crypto.createHash("sha256").update(userQuery._conditions.password).digest('base64');

   next();
})

const User = mongoose.model('User', userSK);



module.exports = User