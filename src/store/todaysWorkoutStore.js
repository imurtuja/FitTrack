// src/store/todaysWorkoutStore.js
import { create } from 'zustand';

// Sample initial workout data
const initialWorkouts = [
  { id: 1, name: 'Bench Press', sets: 3, reps: 10, completed: false },
  { id: 2, name: 'Squats', sets: 4, reps: 8, completed: false },
  { id: 3, name: 'Pull-ups', sets: 3, reps: 8, completed: false },
  { id: 4, name: 'Deadlifts', sets: 3, reps: 6, completed: false },
  { id: 5, name: 'Shoulder Press', sets: 3, reps: 10, completed: false },
];

const useTodaysWorkoutStore = create((set) => ({
  todaysWorkout: initialWorkouts, 
  
  // Toggle workout completion status
  toggleWorkoutCompletion: (id) => 
    set((state) => ({
      todaysWorkout: state.todaysWorkout.map(workout => 
        workout.id === id ? { ...workout, completed: !workout.completed } : workout
      )
    })),
  
  // Add a new workout
  addWorkout: (workout) => 
    set((state) => ({
      todaysWorkout: [...state.todaysWorkout, { ...workout, id: Date.now() }]
    })),
  
  // Remove a workout
  removeWorkout: (id) => 
    set((state) => ({
      todaysWorkout: state.todaysWorkout.filter(workout => workout.id !== id)
    })),
  
  // Reset all workouts to not completed
  resetWorkouts: () => 
    set((state) => ({
      todaysWorkout: state.todaysWorkout.map(workout => ({ ...workout, completed: false }))
    })),
}));

export default useTodaysWorkoutStore;