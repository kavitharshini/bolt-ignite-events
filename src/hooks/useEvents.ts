import { useState, useEffect } from 'react';

export interface StoredEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  venue: string;
  address: string;
  maxAttendees: string;
  ticketPrice: string;
  category: string;
  eventType: string;
  status: "draft" | "published" | "completed" | "cancelled";
  services: string[];
  coverImage: string;
  tags: string[];
  attendees: number;
  createdAt: string;
  updatedAt: string;
  paymentStatus: string;
  paymentMethod?: string;
  paymentAmount?: number;
  transactionId?: string;
}

const EVENTS_KEY = 'ems_events';

export const useEvents = () => {
  const [events, setEvents] = useState<StoredEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = () => {
    try {
      const stored = localStorage.getItem(EVENTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setEvents(parsed);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    
    // Listen for storage changes
    const handleStorage = () => loadEvents();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addEvent = (event: Omit<StoredEvent, 'id' | 'createdAt' | 'updatedAt' | 'attendees'>) => {
    const newEvent: StoredEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      attendees: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedEvents = [...events, newEvent];
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<StoredEvent>) => {
    const updatedEvents = events.map(event => 
      event.id === id 
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    );
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const getRecentEvents = (count: number = 3) => {
    return [...events]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, count);
  };

  const getUpcomingEvents = (count: number = 3) => {
    const today = new Date();
    return events
      .filter(event => new Date(event.date) >= today && event.status === 'published')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, count);
  };

  const getEventStats = () => {
    const total = events.length;
    const published = events.filter(e => e.status === 'published').length;
    const draft = events.filter(e => e.status === 'draft').length;
    const completed = events.filter(e => e.status === 'completed').length;
    const cancelled = events.filter(e => e.status === 'cancelled').length;
    const totalRevenue = events
      .filter(e => e.paymentAmount)
      .reduce((sum, e) => sum + (e.paymentAmount || 0), 0);
    
    return { total, published, draft, completed, cancelled, totalRevenue };
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getRecentEvents,
    getUpcomingEvents,
    getEventStats,
    refresh: loadEvents
  };
};

export default useEvents;
