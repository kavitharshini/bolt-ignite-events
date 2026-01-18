import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseEvent {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  venue: string;
  address: string | null;
  max_attendees: number;
  ticket_price: number;
  category: string;
  event_type: string | null;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  services: string[];
  cover_image: string | null;
  tags: string[];
  attendee_count: number;
  created_at: string;
  updated_at: string;
}

export interface EventPayment {
  id: string;
  event_id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string | null;
  created_at: string;
}

export const useSupabaseEvents = () => {
  const [events, setEvents] = useState<SupabaseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setEvents([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setEvents(data as SupabaseEvent[] || []);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchEvents();
    });

    // Subscribe to realtime changes
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  }, []);

  const addEvent = async (eventData: {
    title: string;
    description?: string;
    event_date: string;
    start_time?: string;
    end_time?: string;
    venue: string;
    address?: string;
    max_attendees?: number;
    ticket_price?: number;
    category: string;
    event_type?: string;
    status?: 'draft' | 'published' | 'completed' | 'cancelled';
    services?: string[];
    cover_image?: string;
    tags?: string[];
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create an event');
      }

      const { data, error: insertError } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          title: eventData.title,
          description: eventData.description || null,
          event_date: eventData.event_date,
          start_time: eventData.start_time || null,
          end_time: eventData.end_time || null,
          venue: eventData.venue,
          address: eventData.address || null,
          max_attendees: eventData.max_attendees || 100,
          ticket_price: eventData.ticket_price || 0,
          category: eventData.category,
          event_type: eventData.event_type || null,
          status: eventData.status || 'draft',
          services: eventData.services || [],
          cover_image: eventData.cover_image || null,
          tags: eventData.tags || [],
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return { data: data as SupabaseEvent, error: null };
    } catch (err: any) {
      console.error('Error creating event:', err);
      return { data: null, error: err.message };
    }
  };

  const updateEvent = async (id: string, updates: Partial<SupabaseEvent>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      return { data: data as SupabaseEvent, error: null };
    } catch (err: any) {
      console.error('Error updating event:', err);
      return { data: null, error: err.message };
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      return { error: null };
    } catch (err: any) {
      console.error('Error deleting event:', err);
      return { error: err.message };
    }
  };

  const addPayment = async (paymentData: {
    event_id: string;
    amount: number;
    payment_method: string;
    transaction_id?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to make a payment');
      }

      const { data, error: insertError } = await supabase
        .from('event_payments')
        .insert({
          event_id: paymentData.event_id,
          user_id: user.id,
          amount: paymentData.amount,
          payment_method: paymentData.payment_method,
          payment_status: 'completed',
          transaction_id: paymentData.transaction_id || null,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return { data: data as EventPayment, error: null };
    } catch (err: any) {
      console.error('Error creating payment:', err);
      return { data: null, error: err.message };
    }
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const getRecentEvents = (count: number = 3) => {
    return [...events]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, count);
  };

  const getUpcomingEvents = (count: number = 3) => {
    const today = new Date();
    return events
      .filter(event => new Date(event.event_date) >= today && event.status === 'published')
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
      .slice(0, count);
  };

  const getEventStats = () => {
    const total = events.length;
    const published = events.filter(e => e.status === 'published').length;
    const draft = events.filter(e => e.status === 'draft').length;
    const completed = events.filter(e => e.status === 'completed').length;
    const cancelled = events.filter(e => e.status === 'cancelled').length;
    const totalRevenue = events.reduce((sum, e) => sum + (e.ticket_price || 0), 0);
    
    return { total, published, draft, completed, cancelled, totalRevenue };
  };

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    addPayment,
    getEventById,
    getRecentEvents,
    getUpcomingEvents,
    getEventStats,
    refresh: fetchEvents
  };
};

export default useSupabaseEvents;
