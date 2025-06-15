import { create } from 'zustand';

const useAuthStore = create(set => ({
  user: JSON.parse(sessionStorage.getItem('user')) || null,
  setUser: (userData) => {
    set({ user: userData });
    sessionStorage.setItem('user', JSON.stringify(userData));
  },
  logout: () => {
    set({ user: null });
    sessionStorage.removeItem('user');
  }
}));

export default useAuthStore;