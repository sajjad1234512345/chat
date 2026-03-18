export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  durationDays: number;
  openingTime: string;
  isPublic: boolean;
  isFree: boolean;
  lat: number;
  lng: number;
}

export interface Housing {
  id: string;
  title: string;
  pricePerNight: number;
  availableDays: string[];
  bookedDays: string[];
  whatsappNumber: string;
  phoneNumber: string;
  lat: number;
  lng: number;
}

export const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Digital Art Showcase',
    description: 'An immersive digital art experience.',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600',
    startDate: '2026-06-18',
    durationDays: 1,
    openingTime: '14:00',
    isPublic: true,
    isFree: false,
    lat: 37.422,
    lng: -122.084,
  },
  {
    id: 'e2',
    title: 'Vibrant Opening',
    description: 'Grand opening of the new vibrant space.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600',
    startDate: '2026-06-20',
    durationDays: 2,
    openingTime: '10:00',
    isPublic: true,
    isFree: true,
    lat: 37.425,
    lng: -122.088,
  }
];

export const mockHousing: Housing[] = [
  {
    id: 'h1',
    title: 'Cozy Studio',
    pricePerNight: 50,
    availableDays: ['2026-06-18', '2026-06-19', '2026-06-20'],
    bookedDays: ['2026-06-21'],
    whatsappNumber: '+1234567890',
    phoneNumber: '+1234567890',
    lat: 37.421,
    lng: -122.081,
  }
];
