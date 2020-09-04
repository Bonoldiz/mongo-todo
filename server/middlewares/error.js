/**
 * MongoTODO error handler
 */
const errorHandler = (err,req,res,next) => {
   console.log("ERROR: " + err.message);
   // Set the deault status code if not setted yet
   res.statusCode && res.statusCode >= 400 ? null : res.status(422);  

   process.env.PRODUCTION === "true" ? 
      res.json({message:(err.name === "ValidationError" ? err.errors : err.message) }) : 
      res.json({message:err.message,_dev: (err.name === "ValidationError" ? err.errors : err.stack)})
}


module.exports = errorHandler