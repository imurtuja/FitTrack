// src/store/workoutStore.js
import { create } from 'zustand';

// Sample workout data
const initialWorkouts = [
  { id: 1, name: 'Bench Press', sets: 3, reps: 10, completed: false, date: new Date() },
  { id: 2, name: 'Squats', sets: 4, reps: 8, completed: false, date: new Date() },
  { id: 3, name: 'Pull-ups', sets: 3, reps: 8, completed: false, date: new Date() },
  { id: 4, name: 'Deadlifts', sets: 3, reps: 6, completed: false, date: new Date() },
  { id: 5, name: 'Shoulder Press', sets: 3, reps: 10, completed: false, date: new Date() },
];

const useWorkoutStore = create((set) => ({
  workouts: initialWorkouts,
  
  // Toggle workout completion status
  toggleWorkoutCompletion: (id) => 
    set((state) => ({
      workouts: state.workouts.map(workout => 
        workout.id === id ? { ...workout, completed: !workout.completed } : workout
      )
    })),
  
  // Add a new workout
  addWorkout: (workout) =>
    set((state) => ({
      workouts: [...state.workouts, { ...workout, id: Date.now(), completed: false, date: new Date() }]
    })),
  
  // Remove a workout
  removeWorkout: (id) =>
    set((state) => ({
      workouts: state.workouts.filter(workout => workout.id !== id)
    })),
  
  // Update a workout
  updateWorkout: (id, updatedWorkout) =>
    set((state) => ({
      workouts: state.workouts.map(workout =>
        workout.id === id ? { ...workout, ...updatedWorkout } : workout
      )
    })),
}));

export default useWorkoutStore;