import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Alarm from './Alarm';
import TaskFormModal from './TaskFormModal';

const Dashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  }, []);

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const activeTasks = tasks.filter(t => !t.isCompleted).length;
  const upcomingDeadlines = tasks.filter(t => !t.isCompleted && new Date(t.dueDate) > new Date()).length;

  const getCategoryStats = () => {
    const categories = {
      'Projects': tasks.filter(t => t.title.toLowerCase().includes('project')).length,
      'Learning': tasks.filter(t => t.title.toLowerCase().includes('learn') || t.title.toLowerCase().includes('course')).length,
      'Practice': tasks.filter(t => t.title.toLowerCase().includes('practice') || t.title.toLowerCase().includes('exercise')).length,
      'Other': tasks.filter(t => 
        !t.title.toLowerCase().includes('project') && 
        !t.title.toLowerCase().includes('learn') && 
        !t.title.toLowerCase().includes('course') &&
        !t.title.toLowerCase().includes('practice') &&
        !t.title.toLowerCase().includes('exercise')
      ).length,
    };
    return categories;
  };

  const categoryStats = getCategoryStats();
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

  return (
    <div className="p-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Welcome back, {user.name}! Track your progress and stay productive.</p>
      </div>

      <Alarm tasks={tasks} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{tasks.length}</p>
                <p className="text-green-600 text-xs mt-2">↑ All time</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{activeTasks}</p>
                <p className="text-blue-600 text-xs mt-2">In progress</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{completedTasks}</p>
                <p className="text-green-600 text-xs mt-2">↑ {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{upcomingDeadlines}</p>
                <p className="text-orange-600 text-xs mt-2">Deadlines ahead</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Category Analytics */}
          <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Category Analytics</h3>
            <div className="space-y-4">
              {Object.entries(categoryStats).map(([category, count], index) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index] }}></div>
                      <span className="text-sm font-medium text-gray-700">{category}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
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
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Tasks</h3>
              <button
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Task</span>
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasks.slice(0, 5).map((task) => (
                <div key={task._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      className="w-5 h-5 text-blue-600 rounded"
                      readOnly
                    />
                    <div>
                      <p className={`font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.isCompleted 
                      ? 'bg-green-100 text-green-700' 
                      : new Date(task.dueDate) < new Date() 
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}>
                    {task.isCompleted ? 'Completed' : new Date(task.dueDate) < new Date() ? 'Overdue' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Tasks Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">All Tasks</h3>
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
