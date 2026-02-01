import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Alarm from './Alarm';
import TaskFormModal from './TaskFormModal';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isDark } = useTheme();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll();
      setTasks(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const activeTasks = tasks.filter(t => !t.isCompleted).length;
  const upcomingDeadlines = tasks.filter(t => !t.isCompleted && new Date(t.dueDate) > new Date()).length;

  const getCategoryStats = () => {
    const stats = {};
    tasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  };

  if (loading && tasks.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'
        }`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  const categoryStats = getCategoryStats();
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

  return (
    <div className={`min-h-screen p-8 animate-fadeIn ${isDark
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'
      }`}>
      {/* Header */}
      <div className="mb-8 animate-slideDown">
        <h2 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          Student Task Dashboard
        </h2>
        <p className="text-blue-200 mt-1">Welcome back, {user.name}! Track your progress and stay productive. 🎯</p>
      </div>

      <Alarm tasks={tasks} />

      {/* Stats Cards with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 stagger-animation">
        <div className="glass hover-lift animate-slideUp backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">Total Tasks</p>
              <p className="text-5xl font-bold text-white mt-2 animate-pulse-slow">{tasks.length}</p>
              <p className="text-green-400 text-xs mt-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                All time
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center animate-float shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass hover-lift animate-slideUp backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">Active Tasks</p>
              <p className="text-5xl font-bold text-white mt-2 animate-pulse-slow">{activeTasks}</p>
              <p className="text-yellow-400 text-xs mt-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-1 animate-pulse"></span>
                In progress
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center animate-float shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass hover-lift animate-slideUp backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">Completed</p>
              <p className="text-5xl font-bold text-white mt-2 animate-pulse-slow">{completedTasks}</p>
              <p className="text-emerald-400 text-xs mt-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mr-1 animate-pulse"></span>
                {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% done
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center animate-float shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass hover-lift animate-slideUp backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 hover-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">Upcoming</p>
              <p className="text-5xl font-bold text-white mt-2 animate-pulse-slow">{upcomingDeadlines}</p>
              <p className="text-orange-400 text-xs mt-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-1 animate-pulse"></span>
                Deadlines ahead
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center animate-float shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Category Analytics */}
        <div className="lg:col-span-1 glass backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 hover-lift animate-slideInLeft">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Category Analytics
          </h3>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count], index) => (
              <div key={category} className="animate-slideInRight">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full animate-pulse-slow" style={{ backgroundColor: colors[index] }}></div>
                    <span className="text-sm font-medium text-blue-100">{category}</span>
                  </div>
                  <span className="text-sm font-bold text-white bg-white/20 px-2 py-1 rounded-lg">{count}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full transition-all duration-1000 ease-out animate-slideInLeft"
                    style={{
                      backgroundColor: colors[index],
                      width: `${tasks.length > 0 ? (count / tasks.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 hover-lift animate-slideInRight">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Tasks
            </h3>
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Task</span>
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {tasks.slice(0, 5).map((task, index) => (
              <div
                key={task._id}
                className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover-lift animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                  <div>
                    <p className={`font-medium ${task.isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-blue-200">{new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm ${task.isCompleted
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
                  : new Date(task.dueDate) < new Date()
                    ? 'bg-red-500/30 text-red-200 border border-red-400/50 animate-pulse'
                    : 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
                  }`}>
                  {task.isCompleted ? '✓ Completed' : new Date(task.dueDate) < new Date() ? '⚠ Overdue' : '⏱ Active'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* All Tasks Section */}
      <div className="glass backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 animate-slideUp">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          All Tasks
        </h3>
        <TaskList
          tasks={tasks}
          onTaskUpdated={fetchTasks}
          onTaskDeleted={fetchTasks}
        />
      </div>

      <TaskFormModal
        show={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onTaskAdded={() => { fetchTasks(); setShowTaskForm(false); }}
      />
    </div>
  );
};

export default Dashboard;
