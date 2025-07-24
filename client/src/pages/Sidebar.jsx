import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardActions } from '../hooks/useDashboardActions';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';


const API = import.meta.env.VITE_API_BASE;
const SOCKET_URL = import.meta.env.VITE_SOCKET_SERVER || 'http://localhost:5000';

function Sidebar({ boardCreated }) {

  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);

// Fetch tasks function (mock or real)
const fetchTasks = async () => {
  try {
    const res = await axios.get(`${API}/boards/${activeBoard?._id}`);
    setBoards((prev) =>
      prev.map((board) => (board._id === activeBoard._id ? res.data : board))
    );
  } catch (err) {
    console.error("Error fetching updated board data", err);
  }
};

const toggleDeleteTaskModal = () => {
  fetchTasks();
  setShowDeleteTaskModal(!showDeleteTaskModal);
};


  const sidebarItems = [
    { icon: '🏠', label: 'Dashboard' },
    { icon: '📊', label: 'Add Column' },
    { icon: '👥', label: 'Delete Task' },
    // { icon: '📦', label: 'Product' },
    // { icon: '📬', label: 'Inbox' },
    // { icon: '❓', label: 'Help' },
    { icon: '🚪', label: 'Logout' },
  ];

  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [taskInputs, setTaskInputs] = useState({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [owner, setOwner] = useState(null);
  const [showColumnModal, setShowColumnModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const socketRef = useRef(null);


  const {
    handleAddColumn,
    // ... other dashboard actions if needed
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
    socketRef,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleColumnModal = () => {
    setShowColumnModal(!showColumnModal);
  };




const handleDeleteTask = async (taskId) => {
  try {
    await fetch(`${API}/boards/${activeBoard._id}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setAllTasks(prev => prev.filter(task => task._id !== taskId));
  } catch (err) {
    console.error("Error deleting task:", err);
  }
};

  return (
    <>
      {/* Sidebar */}
      <nav className="bg-white shadow-md border-r border-gray-200 h-screen fixed top-0 left-0 transition-all duration-300 w-[70px] lg:w-[220px] py-6 px-3 flex flex-col overflow-auto">

        {/* User Profile */}
        <div className="flex items-center cursor-pointer">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
              {owner?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
          <div className="ml-4 hidden lg:block">
            <h3 className="font-semibold text-gray-800">
              {owner?.name}
            </h3>
            {boardCreated && (
              <p className="text-sm text-gray-600">{owner?.email}</p>
            )}
            <p className="text-xs text-green-500 mt-1">Active now</p>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="space-y-6 mt-10 flex-1">
          {sidebarItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 text-[#3949ab] font-medium text-[15px] cursor-pointer hover:translate-x-1 transition-all duration-200"
              onClick={() => {
                if (item.label === 'Logout') {
                  handleLogout();
                } else if (item.label === 'Add Column') {
                  toggleColumnModal();
                } else {
                  console.log(`Navigating to ${item.label}`);
                }
              }}
              title={item.label} // Tooltip on hover
            >
              <span className="text-lg">{item.icon}</span>
              <span className="hidden lg:inline">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Add Column Modal */}
    <AnimatePresence>
      {showColumnModal && (
        <motion.div
          className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-lg bg-white shadow-lg rounded-md p-8 relative"
            initial={{ y: "-50px", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-50px", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <button
              className="absolute font-bold top-5 right-8
              text-black hover:text-red-600 text-3xl cursor-pointer"
              onClick={toggleColumnModal}
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold">Add New Column</h2>
            <input
              placeholder="New Column Name"
              className="px-4 py-2.5 mb-4 mt-6 bg-[#f0f1f2] text-slate-900 w-full text-sm focus:bg-transparent outline-black rounded-md"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                handleAddColumn();
                toggleColumnModal();
              }}
              className="w-full py-2 rounded-lg text-sm font-semibold cursor-pointer border-2 border-black bg-transparent hover:bg-black text-black hover:text-white transition-all duration-300"
            >
              ➕ Add Column
            </button>


          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
  {showDeleteTaskModal && (
    <motion.div
      className="fixed inset-0 p-4 flex justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-xl bg-white shadow-xl rounded-lg p-6 relative"
        initial={{ y: "-50px", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-50px", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <button
          className="absolute top-4 right-5 text-black hover:text-red-600 text-2xl font-bold"
          onClick={toggleDeleteTaskModal}
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4">Delete Column</h2>

        {activeBoard?.columns?.map((column) => (
          <div
            key={column._id}
            className="mb-4 flex justify-between items-center border-b pb-2"
          >
            <h3 className="font-medium text-lg">{column.name}</h3>
            <button
              onClick={() => handleDeleteColumn(column._id)}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Delete ❌
            </button>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


    </>
  );
}

export default Sidebar;
