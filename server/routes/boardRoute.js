const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');


// GET /api/boards → Get all boards for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [
        { ownerId: req.userId },
        { collaborators: req.userId }
      ]
    });
    res.json({ boards });
  } catch (err) {
    console.error('Error fetching boards:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/boards/:boardId/details → Get full board info with collaborators
router.get('/:boardId/details', authMiddleware, async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId)
      .populate('ownerId', 'email name')
      .populate('collaborators', 'email name');

    if (!board) return res.status(404).json({ msg: 'Board not found' });

    const isAllowed =
      board.ownerId._id.toString() === req.userId ||
      board.collaborators.some(c => c._id.toString() === req.userId);

    if (!isAllowed)
      return res.status(403).json({ msg: 'Not authorized' });

    res.status(200).json({ board });
  } catch (err) {
    console.error('Board detail error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// POST /api/boards → Create a new board
router.post('/', authMiddleware, async (req, res) => {
  try {
    const board = await Board.create({
      name: req.body.name,
      ownerId: req.userId,
      collaborators: [],
      columns: []
    });
    res.status(201).json({ board });
  } catch (err) {
    console.error('Error creating board:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/boards/:boardId/columns → Add column to board
router.post('/:boardId/columns', authMiddleware, async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ msg: 'Board not found' });

    if (board.ownerId.toString() !== req.userId && !board.collaborators.includes(req.userId)) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    board.columns.push({ name: req.body.name, tasks: [] });
    await board.save();
    res.status(200).json({ columns: board.columns });
  } catch (err) {
    console.error('Error adding column:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  console.log("DELETE /api/boards/:id hit with ID:", req.params.id);
  try {
    const board = await Board.findById(req.params.id);

    if (!board) return res.status(404).json({ msg: 'Board not found' });

    // Only owner can delete
    if (board.ownerId.toString() !== req.userId)
      return res.status(403).json({ msg: 'Not authorized' });

    await Board.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'Board deleted successfully' });
  } catch (err) {
    console.error('Error deleting board:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// POST /api/boards/:boardId/columns/:colIndex/tasks → Add task
router.post('/:boardId/columns/:colIndex/tasks', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ msg: 'Board not found' });

    const colIndex = parseInt(req.params.colIndex);
    if (!board.columns[colIndex]) return res.status(400).json({ msg: 'Column not found' });

    board.columns[colIndex].tasks.push({ title, description });
    await board.save();

    res.status(200).json({ column: board.columns[colIndex] });
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// routes/board.js
router.delete('/:boardId/columns/:columnIndex/tasks/:taskId', authMiddleware, async (req, res) => {
  const { boardId, columnIndex, taskId } = req.params;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ msg: 'Board not found' });

    const col = board.columns[parseInt(columnIndex)];
    if (!col) return res.status(404).json({ msg: 'Column not found' });

    const taskIndex = col.tasks.findIndex(t => t._id.toString() === taskId);
    if (taskIndex === -1) return res.status(404).json({ msg: 'Task not found' });

    col.tasks.splice(taskIndex, 1);
    await board.save();

    return res.status(200).json({ msg: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});


// DELETE column from a board
router.delete('/:boardId/columns/:columnId', authMiddleware, async (req, res) => {
  try {
    const { boardId, columnId } = req.params;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    // Remove the column by ID
    board.columns = board.columns.filter(col => col._id.toString() !== columnId);
    await board.save();

    res.status(200).json({ message: 'Column deleted successfully', columns: board.columns });
  } catch (err) {
    console.error('Error deleting column:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




router.delete('/:boardId/collaborators/:userId', authMiddleware, async (req, res) => {
  const { boardId, userId } = req.params;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    board.collaborators = board.collaborators.filter(
      (collaborator) => collaborator.toString() !== userId
    );

    await board.save();
    res.status(200).json({ message: 'Collaborator removed successfully' });
  } catch (err) {
    console.error('Error removing collaborator:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




// PATCH /api/boards/:boardId/reorder → Update task order (drag & drop)
router.patch('/:boardId/reorder', authMiddleware, async (req, res) => {
  try {
    const { updatedColumns } = req.body;
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ msg: 'Board not found' });

    board.columns = updatedColumns;
    await board.save();

    res.status(200).json({ msg: 'Reordered successfully' });
  } catch (err) {
    console.error('Error reordering:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/boards/:boardId/invite → Invite user to board
router.post('/:boardId/invite', authMiddleware, async (req, res) => {
  console.log('Invite route hit');
  const { email } = req.body;
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ msg: 'Board not found' });

    if (board.ownerId.toString() !== req.userId)
      return res.status(403).json({ msg: 'Only owner can invite' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (!board.collaborators.includes(user._id)) {
      board.collaborators.push(user._id);
      await board.save();
    }
    res.status(200).json({ msg: 'User invited successfully', collaborators: board.collaborators });
  } catch (err) {
    console.error('Invite error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
