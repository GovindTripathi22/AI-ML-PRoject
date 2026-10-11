import { useContext } from 'react';
import { AppContext } from './context';
import type { AppContextType } from './context';

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
