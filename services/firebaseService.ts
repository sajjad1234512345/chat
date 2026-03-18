import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  or,
  Timestamp,
  getDoc,
  arrayUnion
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Event, Accommodation, Booking } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const createEvent = async (eventData: Omit<Event, 'id' | 'participants'>) => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  try {
    return await addDoc(collection(db, 'events'), {
      ...eventData,
      hostId: auth.currentUser.uid,
      participants: [],
      startDate: Timestamp.fromDate(new Date(eventData.startDate)),
      endDate: Timestamp.fromDate(new Date(eventData.endDate)),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'events');
  }
};

export const joinEvent = async (eventId: string) => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  const eventRef = doc(db, 'events', eventId);
  try {
    return await updateDoc(eventRef, {
      participants: arrayUnion(auth.currentUser.uid)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `events/${eventId}`);
  }
};

export const createAccommodation = async (accData: Omit<Accommodation, 'id'>) => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  try {
    return await addDoc(collection(db, 'accommodations'), {
      ...accData,
      hostId: auth.currentUser.uid,
      availableDates: accData.availableDates || [],
      bookedDates: accData.bookedDates || [],
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'accommodations');
  }
};

export const createBooking = async (bookingData: Omit<Booking, 'id' | 'status'>) => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  try {
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      guestId: auth.currentUser.uid,
      status: 'pending',
      checkIn: Timestamp.fromDate(new Date(bookingData.checkIn)),
      checkOut: Timestamp.fromDate(new Date(bookingData.checkOut)),
    });

    // Update accommodation booked dates
    const accRef = doc(db, 'accommodations', bookingData.accommodationId);
    await updateDoc(accRef, {
      bookedDates: arrayUnion(new Date(bookingData.checkIn).toISOString().split('T')[0])
    });

    return bookingRef;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'bookings');
  }
};

export const subscribeToEvents = (callback: (events: Event[]) => void) => {
  const eventsRef = collection(db, 'events');
  
  // If user is logged in, show public events OR events they host OR events they participate in
  // If not logged in, only show public events
  let q;
  if (auth.currentUser) {
    q = query(
      eventsRef,
      or(
        where('visibility', '==', 'public'),
        where('hostId', '==', auth.currentUser.uid),
        where('participants', 'array-contains', auth.currentUser.uid)
      )
    );
  } else {
    q = query(eventsRef, where('visibility', '==', 'public'));
  }

  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    callback(events);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'events');
  });
};

export const subscribeToAccommodations = (callback: (accs: Accommodation[]) => void) => {
  return onSnapshot(collection(db, 'accommodations'), (snapshot) => {
    const accs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Accommodation));
    callback(accs);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'accommodations');
  });
};
