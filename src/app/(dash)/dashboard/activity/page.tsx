"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  Activity,
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Search,
  RefreshCw,
  Download,
  User,
  LogIn,
  LogOut,
  MousePointer,
  Zap,
  ShoppingCart,
  CheckCircle,
  Minus,
  Plus,
  Edit,
  Trash2
} from "lucide-react";

type UserSession = {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  user_role: 'admin' | 'manager' | 'staff' | 'customer' | 'guest';
  session_start: string;
  session_end?: string;
  duration?: number;
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
    screen_resolution: string;
  };
  location: {
    country: string;
    city: string;
    ip_address: string;
    timezone: string;
  };
  activity_summary: {
    page_views: number;
    unique_pages: number;
    actions_performed: number;
    time_on_site: number;
    bounce_rate?: number;
  };
  current_page?: string;
  last_activity: string;
  status: 'active' | 'idle' | 'offline';
};

type PageView = {
  id: string;
  session_id: string;
  user_id: string;
  page_url: string;
  page_title: string;
  referrer?: string;
  timestamp: string;
  time_on_page?: number;
  scroll_depth?: number;
  interactions: {
    clicks: number;
    form_submissions: number;
    downloads: number;
    external_links: number;
  };
  performance: {
    load_time: number;
    first_contentful_paint: number;
    largest_contentful_paint: number;
  };
};

type UserAction = {
  id: string;
  session_id: string;
  user_id: string;
  action_type: 'click' | 'form_submit' | 'download' | 'search' | 'purchase' | 'signup' | 'login' | 'logout' | 'view' | 'create' | 'edit' | 'delete';
  target_element?: string;
  target_url?: string;
  action_data?: Record<string, unknown>;
  timestamp: string;
  page_url: string;
  success: boolean;
  error_message?: string;
};

type ActivityStats = {
  active_users: number;
  total_sessions_today: number;
  avg_session_duration: number;
  total_page_views: number;
  bounce_rate: number;
  top_pages: { url: string; title: string; views: number }[];
  top_referrers: { source: string; visits: number }[];
  device_breakdown: { type: string; count: number; percentage: number }[];
  location_breakdown: { country: string; city: string; count: number }[];
  hourly_activity: { hour: number; active_users: number; page_views: number }[];
  real_time_metrics: {
    users_online: number;
    page_views_last_30min: number;
    actions_last_30min: number;
    avg_load_time: number;
  };
};

export default function ActivityMonitorPage() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [userActions, setUserActions] = useState<UserAction[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h');
  const [selectedTab, setSelectedTab] = useState<'realtime' | 'sessions' | 'pages' | 'actions' | 'analytics'>('realtime');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [selectedUserType, setSelectedUserType] = useState<string>('all');

  useEffect(() => {
    fetchActivityData();
    const interval = setInterval(fetchActivityData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const fetchActivityData = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockSessions: UserSession[] = [
        {
          id: "session_1",
          user_id: "user_1",
          user_email: "admin@cabana.test",
          user_name: "Admin User",
          user_role: "admin",
          session_start: "2025-10-08T09:30:00Z",
          duration: 3600, // 1 hour
          device: {
            type: "desktop",
            os: "macOS 14.1",
            browser: "Chrome 118.0",
            screen_resolution: "2560x1440"
          },
          location: {
            country: "United States",
            city: "San Francisco",
            ip_address: "192.168.1.100",
            timezone: "America/Los_Angeles"
          },
          activity_summary: {
            page_views: 45,
            unique_pages: 12,
            actions_performed: 23,
            time_on_site: 3600,
            bounce_rate: 0
          },
          current_page: "/dashboard/analytics",
          last_activity: "2025-10-08T10:25:00Z",
          status: "active"
        },
        {
          id: "session_2",
          user_id: "user_2",
          user_email: "customer@example.com",
          user_name: "Sarah Johnson",
          user_role: "customer",
          session_start: "2025-10-08T10:15:00Z",
          duration: 1200, // 20 minutes
          device: {
            type: "mobile",
            os: "iOS 17.0",
            browser: "Safari 17.0",
            screen_resolution: "375x667"
          },
          location: {
            country: "United States",
            city: "New York",
            ip_address: "203.0.113.45",
            timezone: "America/New_York"
          },
          activity_summary: {
            page_views: 8,
            unique_pages: 6,
            actions_performed: 4,
            time_on_site: 1200,
            bounce_rate: 0
          },
          current_page: "/properties/search",
          last_activity: "2025-10-08T10:35:00Z",
          status: "active"
        },
        {
          id: "session_3",
          user_id: "user_3",
          user_email: "manager@cabana.test",
          user_name: "Mike Rodriguez",
          user_role: "manager",
          session_start: "2025-10-08T08:45:00Z",
          session_end: "2025-10-08T10:15:00Z",
          duration: 5400, // 1.5 hours
          device: {
            type: "desktop",
            os: "Windows 11",
            browser: "Edge 118.0",
            screen_resolution: "1920x1080"
          },
          location: {
            country: "Canada",
            city: "Toronto",
            ip_address: "198.51.100.30",
            timezone: "America/Toronto"
          },
          activity_summary: {
            page_views: 67,
            unique_pages: 18,
            actions_performed: 34,
            time_on_site: 5400
          },
          last_activity: "2025-10-08T10:15:00Z",
          status: "offline"
        }
      ];

      const mockPageViews: PageView[] = [
        {
          id: "view_1",
          session_id: "session_1",
          user_id: "user_1",
          page_url: "/dashboard/analytics",
          page_title: "Analytics Dashboard",
          referrer: "/dashboard",
          timestamp: "2025-10-08T10:25:00Z",
          time_on_page: 300,
          scroll_depth: 85,
          interactions: {
            clicks: 12,
            form_submissions: 0,
            downloads: 1,
            external_links: 0
          },
          performance: {
            load_time: 1200,
            first_contentful_paint: 800,
            largest_contentful_paint: 1500
          }
        },
        {
          id: "view_2",
          session_id: "session_2",
          user_id: "user_2",
          page_url: "/properties/search",
          page_title: "Search Properties",
          referrer: "/",
          timestamp: "2025-10-08T10:30:00Z",
          time_on_page: 180,
          scroll_depth: 60,
          interactions: {
            clicks: 5,
            form_submissions: 1,
            downloads: 0,
            external_links: 0
          },
          performance: {
            load_time: 2100,
            first_contentful_paint: 1200,
            largest_contentful_paint: 2400
          }
        }
      ];

      const mockUserActions: UserAction[] = [
        {
          id: "action_1",
          session_id: "session_1",
          user_id: "user_1",
          action_type: "click",
          target_element: "button#export-data",
          target_url: "/dashboard/analytics",
          timestamp: "2025-10-08T10:25:30Z",
          page_url: "/dashboard/analytics",
          success: true
        },
        {
          id: "action_2",
          session_id: "session_2",
          user_id: "user_2",
          action_type: "search",
          action_data: { query: "luxury beachfront", location: "miami" },
          timestamp: "2025-10-08T10:32:15Z",
          page_url: "/properties/search",
          success: true
        },
        {
          id: "action_3",
          session_id: "session_3",
          user_id: "user_3",
          action_type: "form_submit",
          target_element: "form#booking-approval",
          action_data: { booking_id: "BK-2025-001234", action: "approve" },
          timestamp: "2025-10-08T10:10:45Z",
          page_url: "/dashboard/bookings",
          success: true
        }
      ];

      const mockStats: ActivityStats = {
        active_users: 247,
        total_sessions_today: 1456,
        avg_session_duration: 8.5, // minutes
        total_page_views: 12789,
        bounce_rate: 32.5,
        top_pages: [
          { url: "/", title: "Home", views: 2345 },
          { url: "/properties/search", title: "Search Properties", views: 1789 },
          { url: "/dashboard", title: "Dashboard", views: 1234 },
          { url: "/properties/:id", title: "Property Details", views: 987 },
          { url: "/booking/checkout", title: "Checkout", views: 654 }
        ],
        top_referrers: [
          { source: "Direct", visits: 5678 },
          { source: "Google", visits: 3456 },
          { source: "Facebook", visits: 1234 },
          { source: "Instagram", visits: 987 },
          { source: "Email", visits: 654 }
        ],
        device_breakdown: [
          { type: "Desktop", count: 7890, percentage: 62.1 },
          { type: "Mobile", count: 3456, percentage: 27.2 },
          { type: "Tablet", count: 1354, percentage: 10.7 }
        ],
        location_breakdown: [
          { country: "United States", city: "New York", count: 3456 },
          { country: "United States", city: "Los Angeles", count: 2345 },
          { country: "Canada", city: "Toronto", count: 1234 },
          { country: "United Kingdom", city: "London", count: 987 },
          { country: "Australia", city: "Sydney", count: 654 }
        ],
        hourly_activity: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          active_users: Math.floor(Math.random() * 300) + 50,
          page_views: Math.floor(Math.random() * 1000) + 200
        })),
        real_time_metrics: {
          users_online: 247,
          page_views_last_30min: 1234,
          actions_last_30min: 567,
          avg_load_time: 1.8
        }
      };

      setSessions(mockSessions);
      setPageViews(mockPageViews);
      setUserActions(mockUserActions);
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching activity data:', error);
      toast.error('Failed to load activity data');
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/20';
      case 'idle':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'offline':
        return 'text-white/60 bg-white/10';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="w-4 h-4 text-green-400" />;
      case 'idle':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'offline':
        return <Minus className="w-4 h-4 text-white/60" />;
      default:
        return <Activity className="w-4 h-4 text-white/60" />;
    }
  };

  const getUserRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-400 bg-red-400/20';
      case 'manager':
        return 'text-blue-400 bg-blue-400/20';
      case 'staff':
        return 'text-green-400 bg-green-400/20';
      case 'customer':
        return 'text-purple-400 bg-purple-400/20';
      case 'guest':
        return 'text-white/60 bg-white/10';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'click':
        return <MousePointer className="w-4 h-4" />;
      case 'form_submit':
        return <CheckCircle className="w-4 h-4" />;
      case 'download':
        return <Download className="w-4 h-4" />;
      case 'search':
        return <Search className="w-4 h-4" />;
      case 'purchase':
        return <ShoppingCart className="w-4 h-4" />;
      case 'signup':
        return <User className="w-4 h-4" />;
      case 'login':
        return <LogIn className="w-4 h-4" />;
      case 'logout':
        return <LogOut className="w-4 h-4" />;
      case 'view':
        return <Eye className="w-4 h-4" />;
      case 'create':
        return <Plus className="w-4 h-4" />;
      case 'edit':
        return <Edit className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDevice = selectedDevice === 'all' || session.device.type === selectedDevice;
    const matchesUserType = selectedUserType === 'all' || session.user_role === selectedUserType;

    return matchesSearch && matchesDevice && matchesUserType;
  });

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
            Activity Monitor
          </h1>
          <p className="text-white/60 mt-2">Real-time user activity tracking and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="frosted-input"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Real-time Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Users className="w-5 h-5 text-green-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.real_time_metrics.users_online}</div>
                <div className="text-sm text-white/60">Users Online</div>
              </div>
            </div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">{stats.real_time_metrics.page_views_last_30min}</div>
                <div className="text-sm text-white/60">Views (30min)</div>
              </div>
            </div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MousePointer className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold">{stats.real_time_metrics.actions_last_30min}</div>
                <div className="text-sm text-white/60">Actions (30min)</div>
              </div>
            </div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold">{stats.real_time_metrics.avg_load_time}s</div>
                <div className="text-sm text-white/60">Avg Load Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-lg w-fit">
        <button
          onClick={() => setSelectedTab('realtime')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'realtime'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Real-time
        </button>
        <button
          onClick={() => setSelectedTab('sessions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'sessions'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Sessions ({sessions.length})
        </button>
        <button
          onClick={() => setSelectedTab('pages')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'pages'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Page Views
        </button>
        <button
          onClick={() => setSelectedTab('actions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'actions'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          User Actions
        </button>
        <button
          onClick={() => setSelectedTab('analytics')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'analytics'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Analytics
        </button>
      </div>

      {selectedTab === 'realtime' && (
        <div className="grid gap-6">
          <GlassCard>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Activity Feed
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[...userActions].reverse().slice(0, 20).map(action => (
                <div key={action.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getActionIcon(action.action_type)}
                    <span className={`w-2 h-2 rounded-full ${action.success ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">
                      User performed {action.action_type.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-white/60 truncate">
                      {action.target_url || action.page_url}
                    </div>
                  </div>
                  <div className="text-xs text-white/60 flex-shrink-0">
                    {new Date(action.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard>
                <h3 className="text-lg font-semibold mb-4">Top Pages (Today)</h3>
                <div className="space-y-2">
                  {stats.top_pages.slice(0, 5).map((page, index) => (
                    <div key={page.url} className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white/60">#{index + 1}</span>
                        <div>
                          <div className="text-sm font-medium">{page.title}</div>
                          <div className="text-xs text-white/60">{page.url}</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">{page.views.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
                <div className="space-y-3">
                  {stats.device_breakdown.map(device => (
                    <div key={device.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device.type.toLowerCase())}
                        <span className="text-sm">{device.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">{device.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      )}

      {selectedTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sessions..."
                className="frosted-input w-full pl-10"
              />
            </div>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="frosted-input"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>
            <select
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
              className="frosted-input"
            >
              <option value="all">All Users</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Sessions ({filteredSessions.length})
              </h2>
            </div>

            <div className="space-y-3">
              {filteredSessions.map(session => (
                <div key={session.id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getStatusIcon(session.status)}
                      {getDeviceIcon(session.device.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-white">{session.user_name}</h3>
                        <span className="text-sm text-white/60">({session.user_email})</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUserRoleColor(session.user_role)}`}>
                          {session.user_role}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <div className="text-white/60">Session Duration</div>
                          <div className="font-semibold">
                            {session.duration ? formatDuration(session.duration) : formatDuration((new Date().getTime() - new Date(session.session_start).getTime()) / 1000)}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60">Page Views</div>
                          <div className="font-semibold">{session.activity_summary.page_views}</div>
                        </div>
                        <div>
                          <div className="text-white/60">Actions</div>
                          <div className="font-semibold">{session.activity_summary.actions_performed}</div>
                        </div>
                        <div>
                          <div className="text-white/60">Location</div>
                          <div className="font-semibold">{session.location.city}, {session.location.country}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {session.location.ip_address}
                        </div>
                        <div className="flex items-center gap-1">
                          <Monitor className="w-3 h-3" />
                          {session.device.os} • {session.device.browser}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Started {new Date(session.session_start).toLocaleString()}
                        </div>
                        {session.current_page && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {session.current_page}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-white/60 flex-shrink-0">
                      {new Date(session.last_activity).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSessions.length === 0 && (
              <div className="text-center py-12 text-white/60">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sessions found matching your criteria</p>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {selectedTab === 'pages' && (
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Page Views ({pageViews.length})
            </h2>
          </div>

          <div className="space-y-3">
            {pageViews.map(view => (
              <div key={view.id} className="p-4 border border-white/10 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{view.page_title}</h3>
                    <div className="text-sm text-white/60 mb-2">{view.page_url}</div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-white/60">Time on Page</div>
                        <div className="font-semibold">{view.time_on_page ? formatDuration(view.time_on_page) : 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Scroll Depth</div>
                        <div className="font-semibold">{view.scroll_depth || 0}%</div>
                      </div>
                      <div>
                        <div className="text-white/60">Load Time</div>
                        <div className="font-semibold">{view.performance.load_time}ms</div>
                      </div>
                      <div>
                        <div className="text-white/60">Interactions</div>
                        <div className="font-semibold">{view.interactions.clicks} clicks</div>
                      </div>
                    </div>

                    {view.referrer && (
                      <div className="mt-2 text-xs text-white/60">
                        Referrer: {view.referrer}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-white/60 flex-shrink-0">
                    {new Date(view.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {selectedTab === 'actions' && (
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MousePointer className="w-5 h-5" />
              User Actions ({userActions.length})
            </h2>
          </div>

          <div className="space-y-3">
            {userActions.map(action => (
              <div key={action.id} className="p-4 border border-white/10 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getActionIcon(action.action_type)}
                    <span className={`w-2 h-2 rounded-full ${action.success ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-white capitalize">
                        {action.action_type.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${action.success ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'}`}>
                        {action.success ? 'Success' : 'Failed'}
                      </span>
                    </div>

                    <div className="text-sm text-white/80 mb-2">
                      {action.target_element && (
                        <div>Element: <code className="bg-white/10 px-1 rounded text-xs">{action.target_element}</code></div>
                      )}
                      {action.target_url && (
                        <div>URL: {action.target_url}</div>
                      )}
                      {action.action_data && (
                        <div>Data: <code className="bg-white/10 px-1 rounded text-xs">{JSON.stringify(action.action_data)}</code></div>
                      )}
                    </div>

                    <div className="text-xs text-white/60">
                      Page: {action.page_url} • Session: {action.session_id}
                      {action.error_message && (
                        <div className="text-red-400 mt-1">Error: {action.error_message}</div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-white/60 flex-shrink-0">
                    {new Date(action.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {selectedTab === 'analytics' && stats && (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Daily Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-400">{stats.total_sessions_today}</div>
                  <div className="text-sm text-white/60">Sessions Today</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">{stats.total_page_views.toLocaleString()}</div>
                  <div className="text-sm text-white/60">Page Views</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">{stats.avg_session_duration}m</div>
                  <div className="text-sm text-white/60">Avg Session</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400">{stats.bounce_rate}%</div>
                  <div className="text-sm text-white/60">Bounce Rate</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Top Referrers</h3>
              <div className="space-y-2">
                {stats.top_referrers.slice(0, 5).map((referrer, index) => (
                  <div key={referrer.source} className="flex items-center justify-between p-2 bg-white/5 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white/60">#{index + 1}</span>
                      <span className="text-sm font-medium">{referrer.source}</span>
                    </div>
                    <div className="text-sm font-semibold">{referrer.visits.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.location_breakdown.slice(0, 6).map((location) => (
                <div key={`${location.country}-${location.city}`} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium">{location.city}</span>
                    </div>
                    <span className="text-sm font-semibold">{location.count}</span>
                  </div>
                  <div className="text-xs text-white/60">{location.country}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
