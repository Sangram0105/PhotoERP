import { useCallback, useState } from 'react';

import type { UseQuotationState } from '../types/quotation.types';
import type { QuotationErrors, FieldTouched } from '../types/validation.types';

const emptyErrors: QuotationErrors = {
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  eventType: '',
  eventDate: '',
  noServices: '',
  discountExceeds: '',
  advanceExceeds: '',
};

export const useQuotationValidation = () => {
  const [errors, setErrors] = useState<QuotationErrors>(emptyErrors);

  const [touched, setTouched] = useState<FieldTouched>({
    name: false,
    phone: false,
    email: false,
    eventType: false,
    eventDate: false,
  });

  const touchField = useCallback((field: keyof FieldTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validate = useCallback((state: UseQuotationState): boolean => {
    const newErrors: QuotationErrors = { ...emptyErrors };

    if (!state.client.name.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!state.client.phone.trim()) {
      newErrors.clientPhone = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(state.client.phone.replace(/\D/g, ''))) {
      newErrors.clientPhone = 'Enter a valid 10-digit mobile number';
    }

    if (state.client.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.client.email)) {
      newErrors.clientEmail = 'Enter a valid email address';
    }

    if (!state.event.eventType) {
      newErrors.eventType = 'Event type is required';
    }

    if (!state.event.eventDate) {
      newErrors.eventDate = 'Event date is required';
    }

    if (state.services.length === 0) {
      newErrors.noServices = 'Add at least one service';
    }

    if (state.discount > state.subtotal) {
      newErrors.discountExceeds = 'Discount cannot exceed subtotal';
    }

    if (state.advance > state.total) {
      newErrors.advanceExceeds = 'Advance cannot exceed total';
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => !e);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors(emptyErrors);
  }, []);

  const validateField = useCallback(
    (field: keyof FieldTouched, state: UseQuotationState) => {
      setErrors((prev) => {
        const next = { ...prev };
        switch (field) {
          case 'name':
            next.clientName = !state.client.name.trim()
              ? 'Client name is required'
              : '';
            break;
          case 'phone': {
            const phone = state.client.phone.replace(/\D/g, '');
            if (!state.client.phone.trim()) {
              next.clientPhone = 'Mobile number is required';
            } else if (phone.length !== 10) {
              next.clientPhone = 'Enter a valid 10-digit mobile number';
            } else {
              next.clientPhone = '';
            }
            break;
          }
          case 'email':
            if (state.client.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.client.email)) {
              next.clientEmail = 'Enter a valid email address';
            } else {
              next.clientEmail = '';
            }
            break;
          case 'eventType':
            next.eventType = !state.event.eventType ? 'Event type is required' : '';
            break;
          case 'eventDate':
            next.eventDate = !state.event.eventDate ? 'Event date is required' : '';
            break;
        }
        return next;
      });
    },
    [],
  );

  return {
    errors,
    touched,
    touchField,
    validate,
    validateField,
    clearErrors,
  };
};
