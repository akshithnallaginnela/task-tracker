import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll();
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <h1 className="text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            📊 Analytics Dashboard
          </h1>
          <p className="text-blue-200">Visualize your productivity and track your progress in real-time</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 stagger-animation">
          <div className="glass hover-lift animate-slideUp backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Total Tasks</p>
                <p className="text-5xl font-bold text-white animate-pulse-slow">{stats.total}</p>
                <p className="text-sm text-blue-300 mt-2">All time</p>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-2xl animate-float shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass hover-lift animate-slideUp backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Completion Rate</p>
                <p className="text-5xl font-bold text-emerald-300 animate-pulse-slow">{stats.completionRate}%</p>
                <p className="text-sm text-blue-300 mt-2">{stats.completed} of {stats.total} tasks</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-4 rounded-2xl animate-float shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass hover-lift animate-slideUp backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Overdue Tasks</p>
                <p className="text-5xl font-bold text-red-300 animate-pulse-slow">{stats.overdue}</p>
                <p className="text-sm text-blue-300 mt-2">Need immediate attention</p>
              </div>
              <div className="bg-gradient-to-br from-red-400 to-red-600 p-4 rounded-2xl animate-float shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass hover-lift animate-slideUp backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Pending Tasks</p>
                <p className="text-5xl font-bold text-yellow-300 animate-pulse-slow">{stats.pending}</p>
                <p className="text-sm text-blue-300 mt-2">In progress</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-2xl animate-float shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass hover-lift animate-slideUp backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">High Priority</p>
                <p className="text-5xl font-bold text-purple-300 animate-pulse-slow">{stats.highPriority}</p>
                <p className="text-sm text-blue-300 mt-2">Urgent items</p>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-2xl animate-float shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass hover-lift animate-slideUp backdrop-blur-xl bg-gradient-to-br from-pink-500/30 to-purple-600/30 rounded-2xl p-6 shadow-2xl border border-pink-300/30 animate-glow">
            <div>
              <p className="text-pink-200 text-sm font-medium mb-1">Productivity Score</p>
              <p className="text-5xl font-bold text-white">{Math.min(100, Math.round(stats.completionRate * 1.2))}</p>
              <p className="text-sm text-pink-200 mt-2 flex items-center">
                {stats.completionRate >= 80 ? '🔥 Excellent!' : stats.completionRate >= 50 ? '👍 Good job!' : '💪 Keep going!'}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution - Fixed overlapping labels */}
          <div className="glass backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 hover-lift animate-slideInLeft">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              Category Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ color: 'white', fontSize: '14px' }}
                  formatter={(value, entry) => `${value}: ${entry.payload.value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Completion Status */}
          <div className="glass backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 hover-lift animate-slideInRight">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Completion Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#F59E0B" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ color: 'white', fontSize: '14px' }}
                  formatter={(value, entry) => `${value}: ${entry.payload.value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Breakdown */}
          <div className="glass backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 hover-lift animate-slideInLeft">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Priority Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend wrapperStyle={{ color: 'white' }} />
                <Bar dataKey="value" name="Tasks" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend */}
          <div className="glass backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 hover-lift animate-slideInRight">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              6-Month Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend wrapperStyle={{ color: 'white' }} />
                <Line type="monotone" dataKey="total" name="Total Tasks" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 5 }} />
                <Line type="monotone" dataKey="completed" name="Completed" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* Insights */}
        <div className="glass backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl border border-white/20 animate-slideUp">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Insights & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.completionRate >= 80 && (
              <div className="glass bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-5 hover-lift backdrop-blur-sm animate-slideUp">
                <p className="text-emerald-200 font-semibold text-lg flex items-center">
                  🎉 Outstanding Performance!
                </p>
                <p className="text-emerald-100 text-sm mt-2">Your completion rate is excellent. Keep up the great work!</p>
              </div>
            )}
            {stats.overdue > 0 && (
              <div className="glass bg-red-500/20 border border-red-400/40 rounded-xl p-5 hover-lift backdrop-blur-sm animate-slideUp animate-pulse">
                <p className="text-red-200 font-semibold text-lg flex items-center">
                  ⚠️ Overdue Tasks
                </p>
                <p className="text-red-100 text-sm mt-2">You have {stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''}. Prioritize them today!</p>
              </div>
            )}
            {stats.highPriority > 0 && (
              <div className="glass bg-purple-500/20 border border-purple-400/40 rounded-xl p-5 hover-lift backdrop-blur-sm animate-slideUp">
                <p className="text-purple-200 font-semibold text-lg flex items-center">
                  🔥 High Priority Items
                </p>
                <p className="text-purple-100 text-sm mt-2">{stats.highPriority} high priority task{stats.highPriority > 1 ? 's' : ''} need{stats.highPriority === 1 ? 's' : ''} your attention.</p>
              </div>
            )}
            {stats.total === 0 && (
              <div className="glass bg-blue-500/20 border border-blue-400/40 rounded-xl p-5 hover-lift backdrop-blur-sm animate-slideUp">
                <p className="text-blue-200 font-semibold text-lg flex items-center">
                  📝 Get Started
                </p>
                <p className="text-blue-100 text-sm mt-2">Create your first task to start tracking your productivity!</p>
              </div>
            )}
            {stats.pending > stats.completed && stats.total > 0 && (
              <div className="glass bg-yellow-500/20 border border-yellow-400/40 rounded-xl p-5 hover-lift backdrop-blur-sm animate-slideUp">
                <p className="text-yellow-200 font-semibold text-lg flex items-center">
                  💪 Keep Pushing
                </p>
                <p className="text-yellow-100 text-sm mt-2">You have more pending tasks than completed. Stay focused!</p>
              </div>
            )}
            {stats.total > 10 && stats.completionRate < 30 && (
              <div className="glass bg-orange-500/20 border border-orange-400/40 rounded-xl p-5 hover-lift backdrop-blur-sm animate-slideUp">
                <p className="text-orange-200 font-semibold text-lg flex items-center">
                  📊 Review Your Tasks
                </p>
                <p className="text-orange-100 text-sm mt-2">Consider breaking down large tasks into smaller, manageable ones.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
