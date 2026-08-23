import { useMemo, useState } from 'react';

import type {
  ClientDetails,
  EventDetails,
  ServiceItem,
  UseQuotationState,
} from '../types/quotation.types';
import { generateQuotationNumber } from '../../../utils/generateQuotationNumber';
import { QuotationDto } from '../../../types/database';
import { mapDtoToQuotationState } from '../../../utils/quotationMapper';

export const useQuotation = () => {
  // ==============================
  // Quotation Info
  // ==============================

const [quotationNo, setQuotationNo] = useState(
  generateQuotationNumber(),
);


const [quotationId, setQuotationId] =
    useState<number | undefined>();

  const [quotationDate, setQuotationDate] = useState(
    new Date().toISOString().split('T')[0],
  );

  // ==============================
  // Client
  // ==============================

  const [client, setClient] = useState<ClientDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  // ==============================
  // Event
  // ==============================

  const [event, setEvent] = useState<EventDetails>({
    eventType: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    city: '',
    eventNotes: '',
  });

  // ==============================
  // Services
  // ==============================

  const [services, setServices] = useState<ServiceItem[]>([]);

  // ==============================
  // Payment
  // ==============================

  const [discount, setDiscount] = useState(0);

  const [advance, setAdvance] = useState(0);

  // ==============================
  // Notes
  // ==============================

  const [notes, setNotes] = useState('');

  // ==============================
  // Client Update
  // ==============================

  const updateClient = (
    field: keyof ClientDetails,
    value: string,
  ) => {
    setClient((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==============================
  // Event Update
  // ==============================

  const updateEvent = (
    field: keyof EventDetails,
    value: string,
  ) => {
    setEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==============================
  // Add Service
  // ==============================

  const addService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: Date.now(),
        serviceName: '',
        quantity: 1,
        price: 0,
      },
    ]);
  };

  // ==============================
  // Remove Service
  // ==============================

  const removeService = (id: number) => {
    setServices((prev) =>
      prev.filter((item) => item.id !== id),
    );
  };

  // ==============================
  // Update Service
  // ==============================

  const updateService = (
    id: number,
    field: keyof ServiceItem,
    value: string | number,
  ) => {
    setServices((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  // ==============================
  // Calculations
  // ==============================

  const subtotal = useMemo(() => {
    return services.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
  }, [services]);

  const total = useMemo(() => {
    return subtotal - discount;
  }, [subtotal, discount]);

  const balance = useMemo(() => {
    return total - advance;
  }, [total, advance]);



  const loadQuotation = (dto: QuotationDto) => {
  const state = mapDtoToQuotationState(dto);

  setQuotationNo(state.quotationNo);
  setQuotationDate(state.quotationDate);
  setQuotationId(state.id);
  setClient(state.client);
 
  setEvent(state.event);

  setServices(state.services);

  setDiscount(state.discount);

  setAdvance(state.advance);

  setNotes(state.notes);
};

  // ==============================
  // Complete Form State
  // ==============================




  const formState: UseQuotationState = {
    id: quotationId,
    quotationNo,
    quotationDate,

    client,
    event,

    services,

    notes,

    discount,
    advance,

    subtotal,
    total,
    balance,
  };

  return {
    // Complete state
    formState,

    // Individual state
    quotationNo,
    quotationDate,

    client,
    event,
    services,

    notes,

    discount,
    advance,

    subtotal,
    total,
    balance,

    // Setters
    
    setQuotationDate,

    setNotes,
    setDiscount,
    setAdvance,

    // Methods
    updateClient,
    updateEvent,

    addService,
    removeService,
    updateService,
    loadQuotation,
  };
};