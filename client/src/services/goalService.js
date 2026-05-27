import api from './api';

export const getGoals = () => api.get('/goals');
export const createGoal = (data) => api.post('/goals', data);
export const updateGoalProgress = (id, current_amount) => api.patch(`/goals/${id}`, { current_amount });
export const deleteGoal = (id) => api.delete(`/goals/${id}`);
