import React from 'react';
import { tasksAPI } from '../services/api';
import { format } from 'date-fns';

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
    const handleToggleComplete = async (task) => {
        try {
            await tasksAPI.update(task._id, {
                isCompleted: !task.isCompleted
            });
            onTaskUpdated();
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please check your connection.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await tasksAPI.delete(id);
            onTaskDeleted();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please check your connection.');
        }
    };

    if (tasks.length === 0) {
        return <div className="text-center text-gray-500 mt-8">No tasks found. Add one to get started!</div>;
    }

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <div
                    key={task._id}
                    className={`bg-white p-4 rounded-lg shadow flex justify-between items-center ${task.isCompleted ? 'opacity-60' : ''}`}
                >
                    <div className="flex items-center space-x-4">
                        <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => handleToggleComplete(task)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div>
                            <h3 className={`font-semibold text-lg ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {task.title}
                            </h3>
                            <p className="text-sm text-gray-600">{task.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Due: {format(new Date(task.dueDate), 'PPpp')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-500 hover:text-red-700 p-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
