const services = [
  "Wedding Photography",
  "Wedding Cinematography",
  "Pre Wedding Shoot",
  "Haldi Coverage",
  "Mehendi Coverage",
  "Birthday Shoot",
  "Drone Coverage",
  "Album Design",
  "LED Wall",
  "Live Streaming",
];


const eventTypes = [
  'Wedding',
  'Pre Wedding',
  'Reception',
  'Haldi',
  'Mehendi',
  'Birthday',
  'Engagement',
  'Naming Ceremony',
  'Corporate Event',
  'Other',
];

const quotationData = {
  quotation_number: 'QT000001',

  client: {
    name: 'Rahul Patil',
    phone: '9876543210',
    email: 'rahul@test.com',
    address: 'Pune',
  },

  event_type: 'Wedding',
  event_date: '2026-08-10',
  event_time: '10:00',

  venue: 'ABC Hall',
  city: 'Pune',

  subtotal: 50000,
  discount: 5000,
  advance_amount: 10000,
  total: 45000,
  balance: 35000,

  notes: 'Test quotation',

  services: [
    {
      service_name: 'Photography',
      quantity: 1,
      price: 25000,
      total: 25000,
    },
    {
      service_name: 'Videography',
      quantity: 1,
      price: 25000,
      total: 25000,
    },
  ],
};
export default {services,eventTypes,quotationData};