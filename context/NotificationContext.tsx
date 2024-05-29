import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types for your notification context
type Notification = {
  id: number;
  message: string;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (message: string) => void;
  removeNotification: (id: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Define the type for the props of NotificationProvider
type NotificationProviderProps = {
  children: ReactNode; // ReactNode includes all possible children types
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string) => {
    const newNotification: Notification = { id: Date.now(), message };
    setNotifications((prev) => [...prev, newNotification]);

    // Automatically remove the notification after 5 seconds (5000 milliseconds)
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 2000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
