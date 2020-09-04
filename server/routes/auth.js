const yup = require("yup");
const { User } = require("../models");
const { generateJWT } = require("../middlewares");

const signupUserValidator = yup.object().shape({
   username: yup.string().min(8).max(16).required(),
   password: yup.string().min(8).max(16).required(),
   gender: yup.string().oneOf(['male', 'female']).required(),
}).noUnknown()


const signinUserValidator = yup.object().shape({
   username: yup.string().min(8).max(16).required(),
   password: yup.string().min(8).max(16).required(),
}).noUnknown()

const authRoutes = (app) => {
   app.post('/signin', async (req, res,next) => {
      try {
         validatedUserData = await signinUserValidator.validate(req.body, { abortEarly: false });
      } catch (e) {
         next(e);
      }

      const user = await User.findOne(validatedUserData);

      var token = generateJWT(user.toJSON());

      res.json({ data: { token } });
   })

   app.get('/signup', async (req, res, next) => {
      var user;
      try {
         validatedUserData = await signupUserValidator.validate(req.body, { abortEarly: false });
         user = await User.create(validatedUserData);
      } catch (e) {
         next(e);
      }

      res.json(user)
   })
}

module.exports = authRoutes;