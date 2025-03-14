import { createContext, ReactNode, useCallback, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

type Notification = {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
};

interface NotificationContextType {
  notify: (
    message: string,
    type?: NotificationType,
    duration?: number
  ) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const span = useRef<HTMLSpanElement | null>(null);
  const timeline = useRef<GSAPTimeline | undefined>(undefined);

  const notify = useCallback((
    message: string,
    type?: NotificationType,
    duration?: number
  ) => {
    const id = Math.random().toString(36);
    setNotification({ id, message, type: type || 'info', duration: duration || 3 });
    timeline.current?.restart();
  }, []);

  useGSAP(() => {
    if (!span.current) return;

    timeline.current = gsap.timeline({ paused: true });

    timeline.current
      .to(span.current, { y: 0, duration: 0.3 }, 0)
      .to(span.current, { scale: 0, opacity: 0, duration: 0.3 }, 3);

    return () => timeline.current?.kill();
  });

  return (
    <NotificationContext.Provider value={{ notify }}>
      <div className="h-32 z-50 fixed top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center">
        <span
          className={'z-50 p-4 -translate-y-36 border border-mint-950 dark:border-mint-50 text-mint-950 dark:text-mint-50'}
          ref={span}
        >
          {notification ? notification.message : null}
        </span>
      </div>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
