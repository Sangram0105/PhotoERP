import { useState } from 'react';
import type { FormEvent } from 'react';
import { LockKeyhole } from 'lucide-react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { appLockService } from '../../../services/appLock.service';
import { useStudioSettings } from '../../../hooks/useStudioSettings';
import { DEFAULT_STUDIO_SETTINGS } from '../../../types/settings';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen = ({ onUnlock }: LockScreenProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const studioName =
    useStudioSettings()?.studio_name ?? DEFAULT_STUDIO_SETTINGS.studio_name;

  const handleUnlock = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!pin) {
      setError('Enter your PIN to unlock.');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const valid = await appLockService.verifyPin(pin);

      if (valid) {
        setPin('');
        onUnlock();
      } else {
        setError('Incorrect PIN. Please try again.');
        setPin('');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to verify PIN. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4">
      <form
        onSubmit={handleUnlock}
        className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <LockKeyhole size={28} aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">{studioName}</h1>

          <p className="mt-1 text-sm text-slate-500">
            PhotoERP is locked. Enter your PIN to continue.
          </p>
        </div>

        <Input
          id="lock-pin"
          label="PIN"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          maxLength={6}
          placeholder="Enter your PIN"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ''));
            setError('');
          }}
          error={error || undefined}
          disabled={verifying}
        />

        <Button type="submit" className="w-full" loading={verifying}>
          Unlock
        </Button>

        <p className="text-center text-xs text-slate-400">
          Wrong PIN cannot unlock PhotoERP.
        </p>
      </form>
    </div>
  );
};

export default LockScreen;