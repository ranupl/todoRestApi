const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const todoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    priority: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const TodoDB = mongoose.model("Todo", todoSchema);

module.exports = { TodoDB };
