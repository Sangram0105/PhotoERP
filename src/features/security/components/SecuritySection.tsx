import { useEffect, useState } from 'react';
import { KeyRound, Lock, LockOpen, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Loader from '../../../components/ui/Loader';
import Modal from '../../../components/ui/Modal';
import { validatePin } from '../../../utils/validation';
import { toastSuccess } from '../../../utils/toast';
import { appLockService } from '../../../services/appLock.service';
import type { AppLockStatus } from '../../../types/appLock';
import { useAppLock } from '../context/AppLockContext';

type PinModalMode = 'create' | 'enable' | 'disable' | 'change';

type PinField = 'current' | 'newPin' | 'confirmPin';

interface ModalConfig {
  title: string;
  confirmText: string;
  successMessage: string;
  fields: PinField[];
}

const MODAL_CONFIG: Record<PinModalMode, ModalConfig> = {
  create: {
    title: 'Create PIN',
    confirmText: 'Enable Lock',
    successMessage:
      'Application Lock enabled. Your new PIN has been saved.',
    fields: ['newPin', 'confirmPin'],
  },
  enable: {
    title: 'Enable Application Lock',
    confirmText: 'Enable Lock',
    successMessage: 'Application Lock enabled.',
    fields: ['current'],
  },
  disable: {
    title: 'Disable Application Lock',
    confirmText: 'Disable Lock',
    successMessage: 'Application Lock disabled.',
    fields: ['current'],
  },
  change: {
    title: 'Change PIN',
    confirmText: 'Update PIN',
    successMessage: 'PIN changed successfully.',
    fields: ['current', 'newPin', 'confirmPin'],
  },
};

const FIELD_LABELS: Record<PinField, string> = {
  current: 'Current PIN',
  newPin: 'New PIN',
  confirmPin: 'Confirm New PIN',
};

interface FieldErrors {
  current?: string;
  newPin?: string;
  confirmPin?: string;
  form?: string;
}

const SecuritySection = () => {
  const [status, setStatus] = useState<AppLockStatus>({
    enabled: false,
    has_pin: false,
  });
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [modal, setModal] = useState<PinModalMode | null>(null);
  const [current, setCurrent] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);

  const { lock } = useAppLock();

  const loadStatus = async () => {
    try {
      setStatus(await appLockService.getStatus());
    } catch (err) {
      console.error('Failed to load application lock status', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const closeModal = () => {
    setModal(null);
    setCurrent('');
    setNewPin('');
    setConfirmPin('');
    setErrors({});
  };

  const openModal = (mode: PinModalMode) => {
    setCurrent('');
    setNewPin('');
    setConfirmPin('');
    setErrors({});
    setModal(mode);
  };

  const handleToggle = () => {
    if (status.enabled) {
      setModal('disable');
    } else if (status.has_pin) {
      setModal('enable');
    } else {
      setModal('create');
    }
  };

  const handleConfirm = async () => {
    if (!modal) return;

    const config = MODAL_CONFIG[modal];
    const next: FieldErrors = {};

    if (config.fields.includes('current')) {
      const err = current ? validatePin(current) : 'Enter your current PIN.';
      if (err) next.current = err;
    }

    if (config.fields.includes('newPin')) {
      const err = newPin ? validatePin(newPin) : 'Enter a new PIN.';
      if (err) next.newPin = err;
    }

    if (config.fields.includes('confirmPin')) {
      if (!confirmPin) {
        next.confirmPin = 'Enter the new PIN again.';
      } else if (newPin && confirmPin !== newPin) {
        next.confirmPin = 'PINs do not match.';
      }
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setBusy(true);
    setErrors({});

    try {
      switch (modal) {
        case 'create':
          await appLockService.enable(newPin);
          break;
        case 'enable':
          await appLockService.enable(current);
          break;
        case 'disable':
          await appLockService.disable(current);
          break;
        case 'change':
          await appLockService.changePin(current, newPin);
          break;
      }

      toastSuccess(config.successMessage);
      closeModal();
      await loadStatus();
    } catch (err) {
      const message =
        typeof err === 'string'
          ? err
          : 'Unable to update application lock.';
      setErrors((prev) => ({ ...prev, form: message }));
    } finally {
      setBusy(false);
    }
  };

  const handlePinChange = (
    field: PinField,
    value: string,
  ) => {
    const digits = value.replace(/\D/g, '');

    if (field === 'current') setCurrent(digits);
    if (field === 'newPin') setNewPin(digits);
    if (field === 'confirmPin') setConfirmPin(digits);

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      form: undefined,
    }));
  };

  const config = modal ? MODAL_CONFIG[modal] : null;

  return (
    <Card>
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-blue-600" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-900">Security</h2>
      </div>

      <p className="mt-1 text-sm text-slate-500">
        Protect PhotoERP with a PIN. The lock screen appears when the app
        starts.
      </p>

      {loadingStatus ? (
        <div className="mt-4">
          <Loader size="sm" text="Loading security settings..." />
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <div className="flex min-w-0 items-center gap-3">
              {status.enabled ? (
                <Lock size={20} className="shrink-0 text-blue-600" aria-hidden="true" />
              ) : (
                <LockOpen size={20} className="shrink-0 text-slate-400" aria-hidden="true" />
              )}

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  Application Lock
                </p>
                <p className="text-sm text-slate-500">
                  {status.enabled
                    ? 'Lock is on. PhotoERP requires your PIN to unlock.'
                    : status.has_pin
                      ? 'Lock is off. A PIN is already saved.'
                      : 'Lock is off. Turn it on to create a PIN.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={status.enabled}
              aria-label="Toggle Application Lock"
              onClick={handleToggle}
              className={clsx(
                'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                status.enabled ? 'bg-blue-600' : 'bg-slate-300',
              )}
            >
              <span
                className={clsx(
                  'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
                  status.enabled ? 'translate-x-6' : 'translate-x-1',
                )}
              />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              leftIcon={<KeyRound size={16} />}
              disabled={!status.has_pin}
              onClick={() => openModal('change')}
            >
              Change PIN
            </Button>

            {status.enabled && (
              <Button
                variant="outline"
                leftIcon={<Lock size={16} />}
                onClick={lock}
              >
                Lock Now
              </Button>
            )}
          </div>
        </div>
      )}

      {config && (
        <Modal
          open
          title={config.title}
          confirmText={config.confirmText}
          cancelText="Cancel"
          loading={busy}
          onClose={closeModal}
          onConfirm={handleConfirm}
        >
          <div className="space-y-4">
            {errors.form && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
              >
                {errors.form}
              </p>
            )}

            {config.fields.map((field) => (
              <Input
                key={field}
                label={FIELD_LABELS[field]}
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={6}
                placeholder={
                  field === 'current'
                    ? 'Enter your current PIN'
                    : field === 'newPin'
                      ? 'Enter a 4 to 6 digit PIN'
                      : 'Re-enter the new PIN'
                }
                value={
                  field === 'current'
                    ? current
                    : field === 'newPin'
                      ? newPin
                      : confirmPin
                }
                onChange={(e) => handlePinChange(field, e.target.value)}
                error={errors[field]}
                disabled={busy}
              />
            ))}

            <p className="text-xs text-slate-400">
              PIN must be 4 to 6 digits. It is stored as a secure hash and is
              never saved in plain text.
            </p>
          </div>
        </Modal>
      )}
    </Card>
  );
};

export default SecuritySection;