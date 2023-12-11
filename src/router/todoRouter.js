const express = require("express");
const router = express.Router();
const userController = require("../controller/todoController");

router.post("/create", userController.createTodo);
router.get("/todos", userController.getAllTodo);
router.get("/todo/:id", userController.getTodoById);
router.put("/updateTodo/:id", userController.updateTodo);
router.delete("/deleteTodo/:id", userController.deleteTodo);
router.get("/filter", userController.filterResult);

module.exports = router;
