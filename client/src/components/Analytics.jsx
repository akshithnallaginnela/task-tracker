import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Category distribution
  const getCategoryData = () => {
    const categories = {
      Projects: 0,
      Learning: 0,
      Practice: 0,
      Other: 0
    };

    tasks.forEach(task => {
      if (task.category) {
        categories[task.category] = (categories[task.category] || 0) + 1;
      } else {
        const title = task.title.toLowerCase();
        if (title.includes('project')) categories.Projects++;
        else if (title.includes('learn') || title.includes('course')) categories.Learning++;
        else if (title.includes('practice') || title.includes('exercise')) categories.Practice++;
        else categories.Other++;
      }
    });

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  // Completion status
  const getCompletionData = () => {
    const completed = tasks.filter(t => t.isCompleted).length;
    const pending = tasks.length - completed;
    return [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending }
    ];
  };

  // Priority distribution
  const getPriorityData = () => {
    const priorities = { High: 0, Medium: 0, Low: 0 };
    tasks.forEach(task => {
      const priority = task.priority || 'medium';
      priorities[priority.charAt(0).toUpperCase() + priority.slice(1)]++;
    });
    return Object.entries(priorities).map(([name, value]) => ({ name, value }));
  };

  // Monthly trend (last 6 months)
  const getMonthlyTrend = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthTasks = tasks.filter(task => {
        const taskMonth = new Date(task.createdAt || task.dueDate).getMonth();
        return taskMonth === monthIndex;
      });

      monthlyData.push({
        name: months[monthIndex],
        total: monthTasks.length,
        completed: monthTasks.filter(t => t.isCompleted).length
      });
    }

    return monthlyData;
  };

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];
  const categoryData = getCategoryData();
  const completionData = getCompletionData();
  const priorityData = getPriorityData();
  const monthlyTrend = getMonthlyTrend();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.isCompleted).length,
    pending: tasks.filter(t => !t.isCompleted).length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.isCompleted).length / tasks.length) * 100) : 0,
    overdue: tasks.filter(t => !t.isCompleted && new Date(t.dueDate) < new Date()).length,
    highPriority: tasks.filter(t => t.priority === 'high').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Visualize your productivity and track your progress</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Tasks</p>
                <p className="text-4xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-sm text-gray-500 mt-2">All time</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Completion Rate</p>
                <p className="text-4xl font-bold text-green-600">{stats.completionRate}%</p>
                <p className="text-sm text-gray-500 mt-2">{stats.completed} of {stats.total} tasks</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Overdue Tasks</p>
                <p className="text-4xl font-bold text-red-600">{stats.overdue}</p>
                <p className="text-sm text-gray-500 mt-2">Need immediate attention</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Pending Tasks</p>
                <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-gray-500 mt-2">In progress</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">High Priority</p>
                <p className="text-4xl font-bold text-purple-600">{stats.highPriority}</p>
                <p className="text-sm text-gray-500 mt-2">Urgent items</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1">Productivity Score</p>
              <p className="text-4xl font-bold">{Math.min(100, Math.round(stats.completionRate * 1.2))}</p>
              <p className="text-sm text-indigo-100 mt-2">
                {stats.completionRate >= 80 ? '🔥 Excellent!' : stats.completionRate >= 50 ? '👍 Good job!' : '💪 Keep going!'}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Completion Status */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Completion Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#F59E0B" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Breakdown */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Priority Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Tasks" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">6-Month Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" name="Total Tasks" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" name="Completed" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Insights & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.completionRate >= 80 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">🎉 Outstanding Performance!</p>
                <p className="text-green-600 text-sm mt-1">Your completion rate is excellent. Keep up the great work!</p>
              </div>
            )}
            {stats.overdue > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">⚠️ Overdue Tasks</p>
                <p className="text-red-600 text-sm mt-1">You have {stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''}. Prioritize them today!</p>
              </div>
            )}
            {stats.highPriority > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-purple-800 font-medium">🔥 High Priority Items</p>
                <p className="text-purple-600 text-sm mt-1">{stats.highPriority} high priority task{stats.highPriority > 1 ? 's' : ''} need{stats.highPriority === 1 ? 's' : ''} your attention.</p>
              </div>
            )}
            {stats.total === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">📝 Get Started</p>
                <p className="text-blue-600 text-sm mt-1">Create your first task to start tracking your productivity!</p>
              </div>
            )}
            {stats.pending > stats.completed && stats.total > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">💪 Keep Pushing</p>
                <p className="text-yellow-600 text-sm mt-1">You have more pending tasks than completed. Stay focused!</p>
              </div>
            )}
            {stats.total > 10 && stats.completionRate < 30 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800 font-medium">📊 Review Your Tasks</p>
                <p className="text-orange-600 text-sm mt-1">Consider breaking down large tasks into smaller, manageable ones.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
