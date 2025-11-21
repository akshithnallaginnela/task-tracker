import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Alarm from './components/Alarm';

function App() {
  const [tasks, setTasks] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Task Tracker <span className="text-blue-600">Pro</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">Manage your tasks and never miss a deadline.</p>
        </header>

        <Alarm tasks={tasks} />

        <TaskForm onTaskAdded={fetchTasks} />

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Tasks</h2>
          <TaskList
            tasks={tasks}
            onTaskUpdated={fetchTasks}
            onTaskDeleted={fetchTasks}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
