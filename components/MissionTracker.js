import { useState, useEffect } from 'react';

const MissionTracker = () => {
  const [days, setDays] = useState([]);

  useEffect(() => {
    const storedDays = JSON.parse(localStorage.getItem('missionDays')) || Array(90).fill(false);
    setDays(storedDays);
  }, []);

  const toggleDayCompletion = (index) => {
    const updatedDays = days.map((completed, i) =>
      i === index ? !completed : completed
    );
    setDays(updatedDays);
    localStorage.setItem('missionDays', JSON.stringify(updatedDays));
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4 text-pretty text-center">90-Day Mission Tracker</h2>
      <div className="grid grid-cols-5 gap-4">
        {days.map((completed, index) => (
          <div
            key={index}
            className={`p-2 border text-white border cursor-pointer font-semibold rounded-md ${completed ? 'bg-green-500' : 'bg-gray-600 text-black dark:text-white'}`}
            onClick={() => toggleDayCompletion(index)}
          >
            Day {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionTracker;
