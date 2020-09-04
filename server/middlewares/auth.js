const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const { User } = require('../models');

const publicRoutes = [
   '/',
   '/signin',
   '/signup'
]

const generateJWT = (payload) => {
   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
}

const authHandler = async (req, res, next) => {
   if (publicRoutes.includes(req._parsedUrl.pathname)) {
      next();
   } else if (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]) {
      var payload;
      const token = req.headers['authorization'].split(' ')[1]

      try {
         payload = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
         next(error)
      }

      if (
         payload.exp &&
         payload.iat &&
         new Date(payload.exp * 1000) - Date.now()
      ){
         req.body.current_user = await User.findById(payload._id);;
         next();
      }
      else
         next(new Error("token expired"));
   } else {
      res.status(401);
      next(new Error("Authorization token not found."));
   }
}

module.exports = { authHandler, generateJWT }