import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskTable from './components/TaskTable';
import * as api from './api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTaskCreated(title, description) {
    const newTask = await api.createTask(title, description);
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  }

  async function handleStatusChange(id, status) {
    try {
      const updatedTask = await api.updateTaskStatus(id, status);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <h1>AI Task Manager</h1>

      <TaskForm onTaskCreated={handleTaskCreated} />

      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <p>Загрузка задач...</p>
      ) : (
        <TaskTable
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;
