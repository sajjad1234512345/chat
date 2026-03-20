import { supabase } from './supabaseClient';
import { Event, Accommodation, Booking } from '../types';

export const createEvent = async (eventData: Omit<Event, 'id' | 'participants'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('events')
    .insert({
      ...eventData,
      host_id: user.id,
      participants: [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const joinEvent = async (eventId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Supabase doesn't have arrayUnion directly in the same way as Firestore, 
  // we need to fetch, update, and save.
  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select('participants')
    .eq('id', eventId)
    .single();
    
  if (fetchError) throw fetchError;

  const participants = event.participants || [];
  if (!participants.includes(user.id)) {
    const { error: updateError } = await supabase
      .from('events')
      .update({ participants: [...participants, user.id] })
      .eq('id', eventId);
      
    if (updateError) throw updateError;
  }
};

export const createAccommodation = async (accData: Omit<Accommodation, 'id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('accommodations')
    .insert({
      ...accData,
      host_id: user.id,
      available_dates: accData.availableDates || [],
      booked_dates: accData.bookedDates || [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createBooking = async (bookingData: Omit<Booking, 'id' | 'status'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...bookingData,
      guest_id: user.id,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  // Update accommodation booked dates
  const { data: acc, error: accError } = await supabase
    .from('accommodations')
    .select('booked_dates')
    .eq('id', bookingData.accommodationId)
    .single();
    
  if (accError) throw accError;

  const bookedDates = acc.booked_dates || [];
  const checkInDate = new Date(bookingData.checkIn).toISOString().split('T')[0];
  
  if (!bookedDates.includes(checkInDate)) {
    await supabase
      .from('accommodations')
      .update({ booked_dates: [...bookedDates, checkInDate] })
      .eq('id', bookingData.accommodationId);
  }

  return data;
};

export const subscribeToEvents = (callback: (events: Event[]) => void) => {
  return supabase
    .channel('events')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, payload => {
      // Fetch all events again or handle the specific change
      supabase.from('events').select('*').then(({ data }) => callback(data as Event[]));
    })
    .subscribe();
};

export const subscribeToAccommodations = (callback: (accs: Accommodation[]) => void) => {
  return supabase
    .channel('accommodations')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'accommodations' }, payload => {
      supabase.from('accommodations').select('*').then(({ data }) => callback(data as Accommodation[]));
    })
    .subscribe();
};
