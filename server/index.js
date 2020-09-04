const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { errorHandler, authHandler } = require("./middlewares");

const { authRoutes, todoRoutes } = require("./routes");


require('dotenv').config()
require('./db');

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(authHandler);

authRoutes(app);

app.get("/authenticated", (req, res, next) => {
   res.json(req.body.current_user)
})

todoRoutes(app)

app.use(errorHandler);

app.listen(process.env.PORT || 9000, () => {
   console.log(`Express is listening at port ${process.env.PORT || 9000}!`);
})