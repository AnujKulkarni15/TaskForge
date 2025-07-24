// ✅ This file will contain logic separated from Dashboard UI
// 📁 src/hooks/useDashboardActions.js

import { useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

export const useDashboardActions = ({
  API,
  SOCKET_URL,
  token,
  navigate,
  activeBoard,
  setActiveBoard,
  boards,
  setBoards,
  newBoardName,
  setNewBoardName,
  newColumnName,
  setNewColumnName,
  taskInputs,
  setTaskInputs,
  inviteEmail,
  setInviteEmail,
  setOwner,
  setCollaborators,
  socketRef
}) => {

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchBoards();
    }
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await axios.get(`${API}/boards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(res.data.boards);
      if (res.data.boards.length) {
        setActiveBoard(res.data.boards[0]);
      }
    } catch (err) {
      console.error('Error fetching boards:', err);
    }
  };

  

  useEffect(() => {
    if (!activeBoard) return;

    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL);
    }

    socketRef.current.emit('joinBoard', activeBoard._id);

    socketRef.current.on('updateFromServer', (columns) => {
      setActiveBoard((prev) => ({ ...prev, columns }));
    });

    socketRef.current.on('collaboratorUpdated', ({ boardId, collaborators }) => {
      if (activeBoard._id === boardId) {
        setCollaborators(collaborators);
      }
    });

    return () => {
      socketRef.current.off('updateFromServer');
      socketRef.current.off('collaboratorUpdated');
    };
  }, [activeBoard]);

  useEffect(() => {
    const fetchBoardDetails = async () => {
      try {
        const res = await axios.get(`${API}/boards/${activeBoard._id}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCollaborators(res.data.board.collaborators);
        setOwner(res.data.board.ownerId);
      } catch (err) {
        console.error('Failed to fetch board details', err);
      }
    };

    if (activeBoard?._id) fetchBoardDetails();
  }, [activeBoard]);


    const handleCreateBoard = async () => {
    if (!newBoardName) {
        toast.warn("Please enter a board name");
        return;
    }

    try {
        const res = await axios.post(
        `${API}/boards`,
        { name: newBoardName },
        { headers: { Authorization: `Bearer ${token}` } }
        );
        setBoards((prevBoards) => [...prevBoards, res.data.board]);
        setNewBoardName('');
        toast.success('Board created successfully!');
    } catch (err) {
        console.error('Error creating board:', err);
        toast.error('Failed to create board. Please try again.');
    }
    };


  const handleDeleteBoard = async () => {
    if (!activeBoard) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete "${activeBoard.name}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/boards/${activeBoard._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedBoards = boards.filter((b) => b._id !== activeBoard._id);
      setBoards(updatedBoards);
      setActiveBoard(updatedBoards[0] || null);
    } catch (err) {
      console.error('Error deleting board:', err);
      alert('Failed to delete the board.');
    }
  };

const handleAddColumn = async () => {
  if (!newColumnName.trim()) {
    toast.error("Column name cannot be empty!");
    return;
  }

  try {
    const response = await axios.post(`${API}/boards/${activeBoard._id}/columns`, {
      name: newColumnName,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setActiveBoard(response.data.board);
    setNewColumnName(""); // Clear input
    toast.success("Column created successfully!");
  } catch (error) {
    console.error("Error creating column:", error);
    toast.error("Failed to create column. Please try again.");
  }
};

  const handleDeleteColumn = async (columnId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this column?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/columns/${columnId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh board after deletion
      await fetchBoards(activeBoard._id);
    } catch (err) {
      console.error("Failed to delete column", err);
    }
  };




  const handleAddTask = async (colIndex) => {
    const task = taskInputs[colIndex];
    if (!task?.title){
      toast.error("Task content cannot be empty!");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/boards/${activeBoard._id}/columns/${colIndex}/tasks`,
        {
          title: task.title,
          description: task.description || '',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedColumns = [...activeBoard.columns];
      updatedColumns[colIndex] = res.data.column;
      setActiveBoard({ ...activeBoard, columns: updatedColumns });

      socketRef.current?.emit('taskUpdated', {
        boardId: activeBoard._id,
        columns: updatedColumns,
      });

      setTaskInputs((prev) => ({ ...prev, [colIndex]: { title: '', description: '' } }));
      toast.success("Task created successfully!");

    } catch (err) {
      console.error('Error adding task:', err);
      toast.error("Failed to create task!");

    }
  };

  const handleDeleteTask = async (boardId, colIndex, taskId) => {
    try {
      await axios.delete(`${API}/boards/${boardId}/columns/${colIndex}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedBoards = boards.map((board) => {
        if (board._id === boardId) {
          const updatedColumns = [...board.columns];
          updatedColumns[colIndex].tasks = updatedColumns[colIndex].tasks.filter((task) => task._id !== taskId);
          return { ...board, columns: updatedColumns };
        }
        return board;
      });

      setBoards(updatedBoards);
      const updatedActive = updatedBoards.find((b) => b._id === boardId);
      setActiveBoard(updatedActive);
      toast.success("Task deleted successfully!");
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error("Failed to delete task!");
      // alert('Failed to delete task.');
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const updatedColumns = [...activeBoard.columns];
    const sourceCol = updatedColumns[parseInt(source.droppableId)];
    const destCol = updatedColumns[parseInt(destination.droppableId)];
    const sourceTasks = [...sourceCol.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      updatedColumns[source.droppableId].tasks = sourceTasks;
    } else {
      const destTasks = [...destCol.tasks];
      destTasks.splice(destination.index, 0, movedTask);
      updatedColumns[source.droppableId].tasks = sourceTasks;
      updatedColumns[destination.droppableId].tasks = destTasks;
    }

    setActiveBoard({ ...activeBoard, columns: updatedColumns });

    try {
      await axios.patch(
        `${API}/boards/${activeBoard._id}/reorder`,
        { updatedColumns },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socketRef.current?.emit('taskUpdated', {
        boardId: activeBoard._id,
        columns: updatedColumns,
      });
    } catch (err) {
      console.error('Failed to save order:', err);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail){
      toast.error("❌ Email cannot be empty!");
      return;
    }
    try {
      await axios.post(
        `${API}/boards/${activeBoard._id}/invite`,
        { email: inviteEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User invited!');
      setInviteEmail('');
      toast.success("✅ Collaborator invited successfully!");
    } catch (err) {
      toast.error("Wrong email entered!");
      console.error(err);
    }
  };

  return {
    handleCreateBoard,
    handleDeleteBoard,
    handleAddColumn,
    handleAddTask,
    handleDeleteTask,
    handleInvite,
    onDragEnd
  };
};
