const yup = require('yup');
const { Todo,User } = require("../models")

const todoPUTValidator = yup.object().shape({
   title: yup.string().required().max(255),
   description: yup.string().max(1000)
})


const todoPOSTValidator = yup.object().shape({
   _id: yup.string().required(),
   title: yup.string().max(255),
   description: yup.string().max(1000)
})

const todoDELETEValidator = yup.object().shape({
   _id: yup.string().required()
})

/**
 * Todo CRUD routes  
 */
const todoRoutes = (app) => {
   app.route('/todo')
      .get(async (req, res, next) => {
         const userTodos = await req.body.current_user.populate("todos").execPopulate();

         res.json({data: userTodos.todos});
      })
      .post(async (req, res, next) => {
         try {
            var validation = await todoPOSTValidator.noUnknown().validate(req.body, { abortEarly: false });
         } catch (validationError) {
            next(validationError);
         }

         const updatedTodo = await Todo.findByIdAndUpdate(validation._id, validation, {
            new: true
         });

         if(!updatedTodo)
            res.status(404) && next(new Error("Todo not found"));

         res.status(200);
         res.json(updatedTodo);
      })
      .put(async (req, res, next) => {
         try {
            var validation = await todoPUTValidator.noUnknown().validate(req.body, { abortEarly: false });
         } catch (validationError) {
            next(validationError);
         }

         const todo = new Todo(validation)
         const todoSaved = await todo.save();

         if(!todoSaved)
            next(new Error("Cannot create the todo"))

         await req.body.current_user.todos.push(todo);
         await req.body.current_user.save();

         res.status(200);
         res.json({data: todo.toJSON()});
      })
      .delete(async (req, res, next) => {
         try {
            var validation = await todoDELETEValidator.noUnknown().validate(req.body, { abortEarly: false });
         } catch (validationError) {
            next(validationError);
         }

         const deletedTodo = await Todo.findByIdAndDelete(validation._id).exec();

         if(!deletedTodo)
            res.status(404) && next(new Error("Todo not found"));

         await req.body.current_user.todos.pull({_id:deletedTodo._id});
         await req.body.current_user.save()

         res.status(200)
         res.json({data : deletedTodo.toJSON()});
      })

}

module.exports = todoRoutes