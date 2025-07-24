const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const columnSchema = new mongoose.Schema({
  name: String,
  tasks: [taskSchema],
});

const boardSchema = new mongoose.Schema({
  name: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  columns: [columnSchema],
});

module.exports = mongoose.model('Board', boardSchema);
