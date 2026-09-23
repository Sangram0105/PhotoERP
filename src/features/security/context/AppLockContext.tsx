import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import { appLockService } from '../../../services/appLock.service';
import LockScreen from '../components/LockScreen';

interface AppLockContextValue {
  locked: boolean;
  lock: () => void;
  unlock: () => void;
}

const AppLockContext = createContext<AppLockContextValue | undefined>(
  undefined,
);

interface AppLockProviderProps {
  children: ReactNode;
}

export const AppLockProvider = ({ children }: AppLockProviderProps) => {
  const [locked, setLocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    appLockService
      .getStatus()
      .then((status) => {
        if (!active) return;
        if (status.enabled) setLocked(true);
      })
      .catch((err) => {
        console.error('Failed to load app lock status', err);
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const lock = useCallback(() => setLocked(true), []);
  const unlock = useCallback(() => setLocked(false), []);

  return (
    <AppLockContext.Provider value={{ locked, lock, unlock }}>
      {!ready && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
          role="status"
          aria-label="Loading"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      )}

      {ready && locked && <LockScreen onUnlock={unlock} />}

      <div inert={locked}>
        {children}
      </div>
    </AppLockContext.Provider>
  );
};

export const useAppLock = (): AppLockContextValue => {
  const ctx = useContext(AppLockContext);

  if (!ctx) {
    throw new Error('useAppLock must be used within an AppLockProvider');
  }

  return ctx;
};