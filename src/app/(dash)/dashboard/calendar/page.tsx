"use client";
import { useState, useEffect, useCallback } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Download
} from "lucide-react";

type Event = {
  id: string;
  title: string;
  type: 'consultation' | 'photoshoot' | 'interview' | 'meeting';
  start_time: string;
  end_time: string;
  location?: string;
  participants?: string[];
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  client_name?: string;
  notes?: string;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      // This would connect to your bookings table
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .gte('date', startOfMonth(currentDate).toISOString())
        .lte('date', endOfMonth(currentDate).toISOString())
        .order('date', { ascending: true });

      if (error) throw error;

      // Transform booking data to events format
      const transformedEvents: Event[] = (data || []).map(booking => ({
        id: booking.id,
        title: `${booking.service_type} - ${booking.client_name}`,
        type: booking.service_type,
        start_time: booking.date,
        end_time: booking.date,
        client_name: booking.client_name,
        status: booking.status,
        notes: booking.notes
      }));

      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const startOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const endOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'photoshoot':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'interview':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'meeting':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-white/20 text-white border-white/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✓';
      case 'cancelled':
        return '✕';
      case 'completed':
        return '✓';
      default:
        return '•';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const todayEvents = getEventsForDate(new Date());
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    const today = new Date();
    return eventDate > today;
  }).slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Calendar
          </h1>
          <p className="text-white/60 mt-2">Manage appointments and bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Event
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{todayEvents.length}</div>
              <div className="text-sm text-white/60">Today&apos;s Events</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{upcomingEvents.length}</div>
              <div className="text-sm text-white/60">Upcoming</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-2xl font-bold">{events.filter(e => e.status === 'confirmed').length}</div>
              <div className="text-sm text-white/60">Confirmed</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold">{events.filter(e => e.type === 'photoshoot').length}</div>
              <div className="text-sm text-white/60">Photoshoots</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <GlassCard>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {['month', 'week', 'day'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v as 'month' | 'week' | 'day')}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${view === v
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/15'
                      }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-white/60">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 rounded-lg border border-white/10 ${day
                    ? 'bg-white/5 hover:bg-white/10 cursor-pointer transition-colors'
                    : 'bg-transparent'
                    } ${day && day.toDateString() === new Date().toDateString()
                      ? 'ring-2 ring-blue-400/50 bg-blue-400/10'
                      : ''
                    }`}
                >
                  {day && (
                    <>
                      <div className="text-sm font-medium mb-1">{day.getDate()}</div>
                      <div className="space-y-1">
                        {getEventsForDate(day).slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-2 py-1 rounded border ${getEventTypeColor(event.type)}`}
                          >
                            {event.title.slice(0, 15)}...
                          </div>
                        ))}
                        {getEventsForDate(day).length > 2 && (
                          <div className="text-xs text-white/60">
                            +{getEventsForDate(day).length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today&apos;s Events */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Today&apos;s Schedule
            </h3>
            {todayEvents.length === 0 ? (
              <p className="text-white/60 text-center py-4">No events today</p>
            ) : (
              <div className="space-y-3">
                {todayEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded border ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                      <span className="text-xs text-white/60">
                        {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="font-medium">{event.title}</h4>
                    {event.client_name && (
                      <p className="text-sm text-white/60">{event.client_name}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Upcoming Events */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Upcoming Events
            </h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-white/60 text-center py-4">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded border ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                      <span className="text-xs text-white/60">
                        {new Date(event.start_time).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/60">
                        {getStatusIcon(event.status)} {event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
