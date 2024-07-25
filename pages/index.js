import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/outline';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [isRewardUnlocked, setIsRewardUnlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [challengeStartTime, setChallengeStartTime] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);

    const darkModePreference = JSON.parse(localStorage.getItem('isDarkMode'));
    if (darkModePreference !== null) {
      setIsDarkMode(darkModePreference);
      document.documentElement.classList.toggle('dark', darkModePreference);
    }

    const storedStartTime = localStorage.getItem('challengeStartTime');
    if (storedStartTime) {
      setChallengeStartTime(storedStartTime);
    }

    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs().tz('Asia/Karachi').format('YYYY-MM-DD HH:mm'));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    checkAllTasksCompleted();
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const updatedTasks = [...tasks, { text: newTask, completed: false }];
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const startEditTask = (index) => {
    setEditIndex(index);
    setEditTask(tasks[index].text);
  };

  const saveEditTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: editTask } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setEditIndex(null);
    setEditTask('');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('isDarkMode', JSON.stringify(newDarkMode));
  };

  const checkAllTasksCompleted = () => {
    const allCompleted = tasks.every(task => task.completed);
    setIsRewardUnlocked(allCompleted);
  };

  const handleTimeChange = (e) => {
    const startTime = e.target.value;
    setChallengeStartTime(startTime);
    localStorage.setItem('challengeStartTime', startTime);
  };

  return (
    <div className={`min-h-screen p-5 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} ${isDarkMode ? 'text-white' : 'text-black'} font-sans`}>
      <div className="max-w-md mx-auto mt-10">
        <div className={`bg-white dark:bg-gray-700 shadow-lg rounded-lg px-4 py-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">To Do List</h1>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
            >
              {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="New task..."
            />
            <button
              onClick={addTask}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
            >
              Add Task
            </button>
          </div>
          <ul>
            {tasks.map((task, index) => (
              <li
                key={index}
                className={`p-3 mb-3 rounded-lg flex flex-wrap justify-between items-center ${task.completed ? 'bg-green-200 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}
              >
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white mb-2"
                  />
                ) : (
                  <span className={`font-medium break-words ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
                )}
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  {editIndex === index ? (
                    <button
                      onClick={() => saveEditTask(index)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleTaskCompletion(index)}
                        className={`px-3 py-1 rounded ${task.completed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => startEditTask(index)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteTask(index)}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            {isRewardUnlocked ? (
              <div className="relative">
                <div className="text-center p-5 bg-green-600 text-white rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold">Congratulations! 🎉</h2>
                  <p className="mt-2">You&apos;ve completed all tasks!</p>
                </div>
                <div className="ribbon-animation"></div>
              </div>
            ) : (
              <div className="text-center p-5 bg-red-600 text-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">Keep Going!</h2>
                <p className="mt-2">Complete all tasks to unlock.</p>
              </div>
            )}
          </div>
         
        </div>
      </div>
      
    </div>
  );
}
