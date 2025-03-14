import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationProvider.tsx';

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default useNotification;
