const httpError = require("http-errors");
const { TodoDB } = require("../model/todoModel");
const xml2js = require("xml2js");

async function createTodo(req, res, next) {
  try {
    let todoData;
    if (req.is("application/xml")) {
      const parser = new xml2js.Parser({ explicitArray: false });
      todoData = await new Promise((resolve, reject) => {
        parser.parseString(req.body, (err, result) => {
          if (err) {
            reject(httpError.BadRequest("Invalid XML format"));
          } else {
            resolve(result.root);
          }
        });
      });
    } else if (req.is("application/json")) {
      todoData = req.body;
    } else {
      return next(httpError.UnsupportedMediaType("Unsupported media type"));
    }

    const { title, description, priority, status } = todoData;
    const todo = await TodoDB.findOne({ title });

    if (todo) {
      return next(httpError.BadRequest("Todo already exits.."));
    }

    const newTodo = new TodoDB({
      title: title,
      description: description,
      priority: priority,
      status: status,
    });

    await newTodo.save();
    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: req.body,
    });
  } catch (err) {
    return next(httpError.InternalServerError(err.message));
  }
}

async function getAllTodo(req, res, next) {
  const todo = await TodoDB.find();
  try {
    if (todo.length > 0) {
      return res.status(200).json({
        success: true,
        message: "All todos",
        data: todo,
      });
    }
    return next(httpError.NotFound("No todos"));
  } catch (err) {
    return next(httpError.InternalServerError(err.message));
  }
}

async function getTodoById(req, res, next) {
  const { id } = req.params;
  const todo = await TodoDB.findOne({ id });
  try {
    if (!todo) {
      return next(http.NotFound("Todo not found"));
    }
    return res.status(200).json({
      success: true,
      message: "Todo by Id",
      data: user,
    });
  } catch (err) {
    return next(httpError.InternalServerError(err.message));
  }
}

async function updateTodo(req, res, next) {
  const { id } = req.params;

  try {
    let todo = await TodoDB.findOne({ id });
    if (!todo) {
      return next(httpError.NotFound("No todo found"));
    }
    let updateTodo;
    if (req.is("application/xml")) {
      const parser = new xml2js.Parser({ explicitArray: false });
      parser.parseString(req.body, (err, result) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: "Error parsing XML",
          });
        }
        updateTodo = result.root;
      });
    } else if (req.is("application/json")) {
      updateTodo = req.body;
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported Media Type",
      });
    }

    todo = await TodoDB.findOneAndUpdate({ id }, updateTodo, { new: true });
    await todo.save();
    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: req.body,
    });
  } catch (err) {
    return next(httpError.InternalServerError(err.message));
  }
}

async function deleteTodo(req, res, next) {
  const { id } = req.params;
  const todo = await TodoDB.findOne({ id });

  try {
    if (!todo) {
      return next(httpError.NotFound("Todo not found"));
    }
    return res.status(200).json({
      success: true,
      message: "todo deleted",
      data: req.body,
    });
  } catch (err) {
    return next(httpError.InternalServerError(err.message));
  }
}

async function filterResult(req, res, next) {
  try {
    const { title, description, priority, status } = req.query;
    const filter = {};

    if (title) {
      filter.title = title;
    }
    if (description) {
      filter.description = description;
    }
    if (priority) {
      filter.priority = priority;
    }
    if (status) {
      filter.status = status;
    }

    const todo = await TodoDB.findOne(filter);

    if (!todo) {
      return next(httpError.NotFound("Todo not found"));
    }
    return res.status(200).json({
      success: true,
      message: "todo found",
      data: todo,
    });
  } catch (err) {
    return next(httpError.InternalServerError(err.message));
  }
}

module.exports = {
  createTodo,
  getAllTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  filterResult,
};
