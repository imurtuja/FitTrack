import { create } from 'zustand';

// Weekly workout schedule data - starts empty for user customization
const weeklyWorkoutData = {
  schedule: [
    { day: 'Mon', focus: '' },
    { day: 'Tue', focus: '' },
    { day: 'Wed', focus: '' },
    { day: 'Thu', focus: '' },
    { day: 'Fri', focus: '' },
    { day: 'Sat', focus: '' },
    { day: 'Sun', focus: '' },
  ],
  workouts: {
    'Mon': [],
    'Tue': [],
    'Wed': [],
    'Thu': [],
    'Fri': [],
    'Sat': [],
    'Sun': [],
  }
};

const useWeeklyWorkoutStore = create((set) => ({
  weeklyWorkout: weeklyWorkoutData,
  
  // Get today's workout based on the day of the week
  getTodaysWorkout: () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[new Date().getDay()];
    return {
      day: today,
      focus: weeklyWorkoutData.schedule.find(item => item.day === today)?.focus,
      exercises: weeklyWorkoutData.workouts[today] || []
    };
  },
  
  // Update a workout for a specific day
  updateDayWorkout: (day, exercises) =>
    set((state) => ({
      weeklyWorkout: {
        ...state.weeklyWorkout,
        workouts: {
          ...state.weeklyWorkout.workouts,
          [day]: exercises
        }
      }
    })),
  
  // Update the schedule for a specific day
  updateDaySchedule: (day, focus) =>
    set((state) => ({
      weeklyWorkout: {
        ...state.weeklyWorkout,
        schedule: state.weeklyWorkout.schedule.map(item =>
          item.day === day ? { ...item, focus } : item
        )
      }
    })),
}));

export default useWeeklyWorkoutStore;