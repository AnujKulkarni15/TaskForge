import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';
import { useDashboardActions } from '../hooks/useDashboardActions';
import Sidebar from '../pages/Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const API = import.meta.env.VITE_API_BASE;
const SOCKET_URL = import.meta.env.VITE_SOCKET_SERVER || 'http://localhost:5000';

function Dashboard() {

const handleRemoveCollaborator = async (boardId, userId) => {
  try {
    await axios.delete(`${API}/boards/${boardId}/collaborators/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Update UI (optional: re-fetch board or remove from local state)
    setCollaborators(prev => prev.filter(user => user._id !== userId));
  } catch (error) {
    console.error('Error removing collaborator:', error);
    alert('Failed to remove collaborator');
  }
};


const handleDeleteColumn = async (columnId) => {
  try {
    const boardId = activeBoard?._id;
    const response = await axios.delete(
      `${API}/boards/${boardId}/columns/${columnId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setActiveBoard((prev) => ({
      ...prev,
      columns: response.data.columns,
    }));

    toast.success("Column deleted successfully!");
  } catch (err) {
    console.error("Error deleting column:", err);
    toast.error("Failed to delete column");
  }
};




  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [taskInputs, setTaskInputs] = useState({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [owner, setOwner] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const socketRef = useRef(null);

  const {
  handleCreateBoard,
  handleDeleteBoard,
  handleAddColumn,
  handleAddTask,
  handleDeleteTask,
  handleInvite,
  onDragEnd
} = useDashboardActions({
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
});

return (

  <>

  <div className='flex'>
    <Sidebar />

    <div className='flex-1 ml-[70px] lg:ml-[220px] p-4 md:p-6'>

    <div className='bg-[#000000] p-4 md:p-8'>
    <h2 className='font-bold text-xl md:text-2xl text-white'>TaskForge Dashboard</h2>

    <div className='mb-6 mt-6 flex flex-col md:flex-row gap-2 md:gap-4 text-white'>
      <input placeholder="Create your Board" className='p-2 flex border-2 md:border-4 text-white' value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)}/>

      <button type="button" onClick={handleCreateBoard}
        className="px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer tracking-wider font-medium border border-current outline-none bg-gradient-to-tr hover:bg-gradient-to-tl from-black to-[#888]">Create Board</button>
    </div>

    {activeBoard && (
      <>
        <div className='mb-10 flex flex-col md:flex-row md:items-center gap-2 md:gap-4'>
          <label className='font-semibold text-white'><strong>📋 Select Board: </strong></label>
          <div className='flex flex-col md:flex-row gap-2 md:gap-4'>
            <select
              value={activeBoard?._id}
              onChange={(e) => {
                const selectedBoard = boards.find(b => b._id === e.target.value);
                if (selectedBoard) {
                  setActiveBoard(selectedBoard);
                }
              }}
              className='p-2 border-2 flex text-white'
            >
              {boards.map((board) => (
                <option key={board._id} value={board._id}>
                  {board.name}
                </option>
              ))}
            </select>

            <button type="button" onClick={handleDeleteBoard} className="px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer tracking-wider font-medium border border-current outline-none bg-gradient-to-tr hover:bg-gradient-to-tl from-red-700 to-red-400"><span className='mr-1'>🗑️</span> Delete Board</button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className='flex flex-col'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 pb-4'>
              {activeBoard.columns.map((col, colIndex) => (
                <Droppable droppableId={colIndex.toString()} key={colIndex}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className='bg-white [box-shadow:0_4px_12px_-5px_rgba(0,0,0,0.4)] p-6 w-full max-w-lg rounded-lg mx-auto'
                    >
                      <h4 className='text-xl font-semibold text-slate-900 mb-3'>📂 {col.name}</h4>
                      {/* tasks + inputs + buttons go here */}
                      {col.tasks.map((task, tIdx) => (
                        <Draggable key={`${colIndex}-${tIdx}`} draggableId={`${colIndex}-${tIdx}`} index={tIdx}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-amber-300 p-2 mb-2 rounded shadow-sm break-words"
                            >
                              <div className='flex justify-between items-center'>
                                <div>
                                  <strong>{task.title}</strong>
                                  <p className='text-[0.8rem]'>{task.description}</p>
                                </div>
                                <button
                                  className='text-red-600 text-[0.8rem] cursor-pointer'
                                  onClick={() => handleDeleteTask(activeBoard._id, colIndex, task._id)}
                                >
                                  ❌
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}

                      <input
                        placeholder="Task title"
                        className='w-full border-2 p-3 text-[1rem] text-black bg-transparent outline-none'
                        value={taskInputs[colIndex]?.title || ''}
                        onChange={(e) =>
                          setTaskInputs((prev) => ({
                            ...prev,
                            [colIndex]: {
                              ...prev[colIndex],
                              title: e.target.value,
                            },
                          }))
                        }
                      />

                      <input
                        className='mt-2 w-full border-2 p-3 text-[1rem] text-black bg-transparent outline-none'
                        placeholder="Task Description (optional)"
                        value={taskInputs[colIndex]?.description || ''}
                        onChange={(e) =>
                          setTaskInputs((prev) => ({
                            ...prev,
                            [colIndex]: {
                              ...prev[colIndex],
                              description: e.target.value,
                            },
                          }))
                        }
                      />

                      <button
                        type="button"
                        onClick={() => handleAddTask(colIndex)}
                        className="mt-2 px-5 py-2 rounded-lg text-sm tracking-wider font-semibold cursor-pointer border-2 border-black outline-none bg-transparent hover:bg-black text-black hover:text-white transition-all duration-300"
                      >
                        ➕ Add Task
                      </button>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>

                      {activeBoard?.columns?.map((column) => (
                        <div key={column._id} className="...">
                          <div className="flex justify-baseline items-center text-white border-2 border-amber-50">
                            <h3 className="font-bold text-lg mr-5 gap-4">{column.name}</h3>
                            <button
                              onClick={() => handleDeleteColumn(column._id)}
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      ))}
            {/* Add Column Box Below */}
            {/* <div className='mt-6 border-2 border-dashed border-gray-300 p-4 rounded-lg w-full md:w-1/4 bg-gray-100 h-fit mx-auto'>
              <input
                placeholder="New Column Name"
                className='w-full mb-2 border-2 p-1'
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddColumn}
                className="px-5 py-2 rounded-lg text-sm tracking-wider font-semibold cursor-pointer border-2 border-black outline-none bg-transparent hover:bg-black text-black hover:text-white transition-all duration-300"
              >
                ➕ Add Column
              </button>
            </div> */}

          </div>

        </DragDropContext>



        <div className='mt-4 mb-4 flex flex-col md:flex-row gap-2 md:gap-4'>
          <input placeholder="Invite user by email" className='p-2 border-2 flex text-white' value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}/>

          <button type="button" onClick={handleInvite} className="px-5 py-2.5 rounded-lg text-white text-sm cursor-pointer tracking-wider font-medium border border-current outline-none bg-gradient-to-tr hover:bg-gradient-to-tl from-black to-[#fff]">Invite
          </button>
        </div>

        <div className='mb-4 text-sm text-white'>
          <div>
            <strong>Owner:</strong> {owner?.email}
          </div>
          <div className='mt-1 text-white'>
            <strong>Collaborators:</strong>
            <ul className='list-disc list-inside'>
              {collaborators.map((user) => (
                <div key={user._id} className="flex items-center justify-between text-white">
                  <p>{user.name}</p>
                  <button
                    onClick={() => handleRemoveCollaborator(activeBoard._id, user._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌ Remove
                  </button>
                </div>
              ))}

              {/* {collaborators.map((user) => (
                <li key={user._id}>{user.email}</li>
              ))} */}
            </ul>
          </div>
        </div>
      </>
    )}
  </div>

    </div>

  </div>



  </>
);
}

export default Dashboard;