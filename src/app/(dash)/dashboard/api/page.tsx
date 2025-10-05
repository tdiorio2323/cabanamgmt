"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  Key,
  Globe,
  Zap,
  Activity,
  Code,
  Server,
  Eye,
  EyeOff,
  Copy,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Network,
  Target,
  Search,
  ExternalLink
} from "lucide-react";

type APIKey = {
  id: string;
  name: string;
  description: string;
  key_prefix: string;
  key_suffix: string; // Last 4 characters for identification
  permissions: string[];
  rate_limit: {
    requests_per_minute: number;
    requests_per_hour: number;
    requests_per_day: number;
  };
  usage_stats: {
    total_requests: number;
    requests_today: number;
    requests_this_month: number;
    last_used: string;
    success_rate: number;
    avg_response_time: number;
  };
  restrictions: {
    ip_whitelist?: string[];
    allowed_domains?: string[];
    allowed_methods?: string[];
    allowed_endpoints?: string[];
  };
  created_at: string;
  created_by: string;
  expires_at?: string;
  status: 'active' | 'inactive' | 'revoked' | 'expired';
  environment: 'production' | 'staging' | 'development';
};

type APIEndpoint = {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  category: string;
  authentication_required: boolean;
  rate_limit: {
    requests_per_minute: number;
    burst_limit: number;
  };
  permissions_required: string[];
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  response_format: string;
  status: 'active' | 'deprecated' | 'beta' | 'disabled';
  version: string;
  usage_stats: {
    total_calls: number;
    calls_today: number;
    avg_response_time: number;
    success_rate: number;
    error_rate: number;
  };
  documentation_url?: string;
  last_modified: string;
};

type WebhookEndpoint = {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'inactive' | 'failed';
  retry_policy: {
    max_retries: number;
    retry_delay: number;
    exponential_backoff: boolean;
  };
  headers: { [key: string]: string };
  last_delivery?: {
    timestamp: string;
    status_code: number;
    response_time: number;
    success: boolean;
    error_message?: string;
  };
  delivery_stats: {
    total_deliveries: number;
    successful_deliveries: number;
    failed_deliveries: number;
    avg_response_time: number;
  };
  created_at: string;
  updated_at: string;
};

export default function APISettingsPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'keys' | 'endpoints' | 'webhooks' | 'analytics'>('keys');
  const [searchTerm, setSearchTerm] = useState("");
  const [showSecrets, setShowSecrets] = useState(false);

  useEffect(() => {
    fetchAPISettings();
  }, []);

  const fetchAPISettings = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockAPIKeys: APIKey[] = [
        {
          id: "key_1",
          name: "Mobile App - Production",
          description: "Primary API key for the mobile application in production",
          key_prefix: "ck_live_",
          key_suffix: "7a2b",
          permissions: ["properties:read", "bookings:create", "bookings:read", "users:read", "payments:create"],
          rate_limit: {
            requests_per_minute: 1000,
            requests_per_hour: 50000,
            requests_per_day: 1000000
          },
          usage_stats: {
            total_requests: 2456789,
            requests_today: 12456,
            requests_this_month: 345678,
            last_used: "2025-10-08T10:15:00Z",
            success_rate: 99.2,
            avg_response_time: 145
          },
          restrictions: {
            ip_whitelist: ["192.168.1.0/24", "10.0.0.0/8"],
            allowed_domains: ["app.cabana.com", "mobile.cabana.com"],
            allowed_methods: ["GET", "POST"],
            allowed_endpoints: ["/api/properties", "/api/bookings", "/api/users"]
          },
          created_at: "2025-01-01T00:00:00Z",
          created_by: "admin@cabana.test",
          status: "active",
          environment: "production"
        },
        {
          id: "key_2",
          name: "Web Dashboard - Admin",
          description: "Admin dashboard API key with full permissions",
          key_prefix: "ck_admin_",
          key_suffix: "9f3c",
          permissions: ["*"],
          rate_limit: {
            requests_per_minute: 500,
            requests_per_hour: 25000,
            requests_per_day: 500000
          },
          usage_stats: {
            total_requests: 567890,
            requests_today: 3456,
            requests_this_month: 89012,
            last_used: "2025-10-08T09:45:00Z",
            success_rate: 98.8,
            avg_response_time: 89
          },
          restrictions: {
            ip_whitelist: ["203.0.113.0/24"],
            allowed_domains: ["admin.cabana.com"]
          },
          created_at: "2025-01-15T00:00:00Z",
          created_by: "admin@cabana.test",
          status: "active",
          environment: "production"
        },
        {
          id: "key_3",
          name: "Third-party Integration - Stripe",
          description: "Integration key for payment processing webhooks",
          key_prefix: "ck_stripe_",
          key_suffix: "4d8e",
          permissions: ["payments:read", "payments:update", "webhooks:receive"],
          rate_limit: {
            requests_per_minute: 100,
            requests_per_hour: 5000,
            requests_per_day: 50000
          },
          usage_stats: {
            total_requests: 89034,
            requests_today: 234,
            requests_this_month: 7890,
            last_used: "2025-10-08T08:30:00Z",
            success_rate: 99.9,
            avg_response_time: 67
          },
          restrictions: {
            ip_whitelist: ["203.0.113.0/24", "198.51.100.0/24"],
            allowed_domains: ["stripe.com", "*.stripe.com"],
            allowed_methods: ["POST"],
            allowed_endpoints: ["/webhooks/stripe", "/api/payments/*"]
          },
          created_at: "2025-02-01T00:00:00Z",
          created_by: "admin@cabana.test",
          expires_at: "2025-12-01T00:00:00Z",
          status: "active",
          environment: "production"
        },
        {
          id: "key_4",
          name: "Development Testing",
          description: "Testing key for development environment",
          key_prefix: "ck_test_",
          key_suffix: "1a9z",
          permissions: ["properties:read", "bookings:read", "users:read"],
          rate_limit: {
            requests_per_minute: 50,
            requests_per_hour: 2000,
            requests_per_day: 10000
          },
          usage_stats: {
            total_requests: 12345,
            requests_today: 89,
            requests_this_month: 2345,
            last_used: "2025-10-07T16:20:00Z",
            success_rate: 95.5,
            avg_response_time: 234
          },
          restrictions: {
            ip_whitelist: ["127.0.0.1", "::1", "192.168.1.0/24"],
            allowed_domains: ["localhost", "*.test.cabana.com"],
            allowed_methods: ["GET", "POST", "PUT", "DELETE"],
            allowed_endpoints: ["*"]
          },
          created_at: "2025-05-01T00:00:00Z",
          created_by: "developer@cabana.test",
          status: "active",
          environment: "development"
        }
      ];

      const mockEndpoints: APIEndpoint[] = [
        {
          id: "endpoint_1",
          path: "/api/v1/properties",
          method: "GET",
          description: "List all available properties with filtering and pagination",
          category: "Properties",
          authentication_required: true,
          rate_limit: {
            requests_per_minute: 100,
            burst_limit: 20
          },
          permissions_required: ["properties:read"],
          parameters: [
            { name: "page", type: "integer", required: false, description: "Page number for pagination" },
            { name: "limit", type: "integer", required: false, description: "Number of items per page" },
            { name: "location", type: "string", required: false, description: "Filter by location" },
            { name: "price_min", type: "number", required: false, description: "Minimum price filter" },
            { name: "price_max", type: "number", required: false, description: "Maximum price filter" }
          ],
          response_format: "JSON",
          status: "active",
          version: "1.0",
          usage_stats: {
            total_calls: 456789,
            calls_today: 2345,
            avg_response_time: 145,
            success_rate: 99.1,
            error_rate: 0.9
          },
          documentation_url: "https://docs.cabana.com/api/properties",
          last_modified: "2025-09-15T00:00:00Z"
        },
        {
          id: "endpoint_2",
          path: "/api/v1/bookings",
          method: "POST",
          description: "Create a new booking for a property",
          category: "Bookings",
          authentication_required: true,
          rate_limit: {
            requests_per_minute: 20,
            burst_limit: 5
          },
          permissions_required: ["bookings:create"],
          parameters: [
            { name: "property_id", type: "string", required: true, description: "ID of the property to book" },
            { name: "check_in", type: "date", required: true, description: "Check-in date" },
            { name: "check_out", type: "date", required: true, description: "Check-out date" },
            { name: "guests", type: "integer", required: true, description: "Number of guests" },
            { name: "special_requests", type: "string", required: false, description: "Any special requests" }
          ],
          response_format: "JSON",
          status: "active",
          version: "1.0",
          usage_stats: {
            total_calls: 34567,
            calls_today: 234,
            avg_response_time: 567,
            success_rate: 97.8,
            error_rate: 2.2
          },
          documentation_url: "https://docs.cabana.com/api/bookings",
          last_modified: "2025-10-01T00:00:00Z"
        },
        {
          id: "endpoint_3",
          path: "/api/v1/payments/process",
          method: "POST",
          description: "Process payment for booking",
          category: "Payments",
          authentication_required: true,
          rate_limit: {
            requests_per_minute: 10,
            burst_limit: 2
          },
          permissions_required: ["payments:create"],
          parameters: [
            { name: "booking_id", type: "string", required: true, description: "ID of the booking" },
            { name: "payment_method", type: "string", required: true, description: "Payment method token" },
            { name: "amount", type: "number", required: true, description: "Payment amount" },
            { name: "currency", type: "string", required: true, description: "Currency code" }
          ],
          response_format: "JSON",
          status: "active",
          version: "1.0",
          usage_stats: {
            total_calls: 12345,
            calls_today: 89,
            avg_response_time: 1234,
            success_rate: 99.5,
            error_rate: 0.5
          },
          last_modified: "2025-09-30T00:00:00Z"
        }
      ];

      const mockWebhooks: WebhookEndpoint[] = [
        {
          id: "webhook_1",
          name: "Stripe Payment Events",
          url: "https://api.cabana.com/webhooks/stripe",
          events: ["payment.succeeded", "payment.failed", "charge.dispute.created"],
          secret: "whsec_***hidden***",
          status: "active",
          retry_policy: {
            max_retries: 3,
            retry_delay: 5000,
            exponential_backoff: true
          },
          headers: {
            "User-Agent": "Cabana-Webhook/1.0",
            "Content-Type": "application/json"
          },
          last_delivery: {
            timestamp: "2025-10-08T09:45:23Z",
            status_code: 200,
            response_time: 234,
            success: true
          },
          delivery_stats: {
            total_deliveries: 5678,
            successful_deliveries: 5634,
            failed_deliveries: 44,
            avg_response_time: 156
          },
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-09-15T00:00:00Z"
        },
        {
          id: "webhook_2",
          name: "Booking Notifications",
          url: "https://notifications.cabana.com/webhooks/bookings",
          events: ["booking.created", "booking.cancelled", "booking.completed"],
          secret: "whsec_***hidden***",
          status: "active",
          retry_policy: {
            max_retries: 5,
            retry_delay: 2000,
            exponential_backoff: true
          },
          headers: {
            "Authorization": "Bearer ***hidden***",
            "Content-Type": "application/json"
          },
          last_delivery: {
            timestamp: "2025-10-08T10:12:45Z",
            status_code: 200,
            response_time: 89,
            success: true
          },
          delivery_stats: {
            total_deliveries: 2345,
            successful_deliveries: 2298,
            failed_deliveries: 47,
            avg_response_time: 123
          },
          created_at: "2025-02-15T00:00:00Z",
          updated_at: "2025-10-01T00:00:00Z"
        }
      ];

      setApiKeys(mockAPIKeys);
      setEndpoints(mockEndpoints);
      setWebhooks(mockWebhooks);
    } catch (error) {
      console.error('Error fetching API settings:', error);
      toast.error('Failed to load API settings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/20';
      case 'inactive':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'revoked':
      case 'failed':
        return 'text-red-400 bg-red-400/20';
      case 'expired':
        return 'text-orange-400 bg-orange-400/20';
      case 'deprecated':
        return 'text-purple-400 bg-purple-400/20';
      case 'beta':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'text-green-400 bg-green-400/20';
      case 'POST':
        return 'text-blue-400 bg-blue-400/20';
      case 'PUT':
        return 'text-orange-400 bg-orange-400/20';
      case 'DELETE':
        return 'text-red-400 bg-red-400/20';
      case 'PATCH':
        return 'text-purple-400 bg-purple-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const filteredKeys = apiKeys.filter(key =>
    key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWebhooks = webhooks.filter(webhook =>
    webhook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    webhook.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total_api_keys: apiKeys.length,
    active_keys: apiKeys.filter(k => k.status === 'active').length,
    total_endpoints: endpoints.length,
    active_endpoints: endpoints.filter(e => e.status === 'active').length,
    total_webhooks: webhooks.length,
    active_webhooks: webhooks.filter(w => w.status === 'active').length,
    total_requests_today: apiKeys.reduce((sum, key) => sum + key.usage_stats.requests_today, 0),
    avg_success_rate: apiKeys.reduce((sum, key) => sum + key.usage_stats.success_rate, 0) / apiKeys.length || 0
  };

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
            API Settings
          </h1>
          <p className="text-white/60 mt-2">Manage API keys, endpoints, and webhooks</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Key className="w-4 h-4" />
            New API Key
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Code className="w-4 h-4" />
            Documentation
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_api_keys}</div>
              <div className="text-sm text-white/60">API Keys</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.active_keys}</div>
              <div className="text-sm text-white/60">Active</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_endpoints}</div>
              <div className="text-sm text-white/60">Endpoints</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_webhooks}</div>
              <div className="text-sm text-white/60">Webhooks</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{formatNumber(stats.total_requests_today)}</div>
              <div className="text-sm text-white/60">Today</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-2xl font-bold">{stats.avg_success_rate.toFixed(1)}%</div>
              <div className="text-sm text-white/60">Success</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-2xl font-bold">{stats.active_endpoints}</div>
              <div className="text-sm text-white/60">Live</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Network className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="text-2xl font-bold">{stats.active_webhooks}</div>
              <div className="text-sm text-white/60">Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-lg w-fit">
        <button
          onClick={() => setSelectedTab('keys')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'keys'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          API Keys ({apiKeys.length})
        </button>
        <button
          onClick={() => setSelectedTab('endpoints')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'endpoints'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Endpoints ({endpoints.length})
        </button>
        <button
          onClick={() => setSelectedTab('webhooks')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'webhooks'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Webhooks ({webhooks.length})
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

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${selectedTab}...`}
            className="frosted-input w-full pl-10"
          />
        </div>
        {selectedTab === 'keys' && (
          <button
            onClick={() => setShowSecrets(!showSecrets)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${showSecrets
              ? 'bg-red-400/20 text-red-400'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
          >
            {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Show Secrets
          </button>
        )}
      </div>

      {selectedTab === 'keys' && (
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Keys ({filteredKeys.length})
            </h2>
            <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create API Key
            </button>
          </div>

          <div className="space-y-4">
            {filteredKeys.map(key => (
              <div key={key.id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{key.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(key.status)}`}>
                        {key.status}
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-400/20 text-blue-400">
                        {key.environment}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mb-3">{key.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-white/60 mb-1">API Key</div>
                        <div className="font-mono bg-white/5 px-2 py-1 rounded text-white/80 flex items-center gap-2">
                          {showSecrets ? `${key.key_prefix}${'*'.repeat(32)}${key.key_suffix}` : `${key.key_prefix}${'*'.repeat(36)}`}
                          <button className="p-1 rounded hover:bg-white/10 transition-colors">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 mb-1">Permissions</div>
                        <div className="flex flex-wrap gap-1">
                          {key.permissions.slice(0, 3).map(permission => (
                            <span key={permission} className="px-2 py-1 rounded-full text-xs bg-green-400/20 text-green-400">
                              {permission}
                            </span>
                          ))}
                          {key.permissions.length > 3 && (
                            <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/60">
                              +{key.permissions.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-white/60">Requests Today</div>
                        <div className="font-semibold">{formatNumber(key.usage_stats.requests_today)}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Success Rate</div>
                        <div className="font-semibold text-green-400">{key.usage_stats.success_rate}%</div>
                      </div>
                      <div>
                        <div className="text-white/60">Avg Response</div>
                        <div className="font-semibold">{key.usage_stats.avg_response_time}ms</div>
                      </div>
                      <div>
                        <div className="text-white/60">Last Used</div>
                        <div className="font-semibold">{new Date(key.usage_stats.last_used).toLocaleString()}</div>
                      </div>
                    </div>

                    {key.expires_at && (
                      <div className="mt-3 p-2 bg-orange-400/10 border-l-4 border-orange-400 rounded">
                        <div className="text-xs text-orange-400">
                          <strong>Expires:</strong> {new Date(key.expires_at).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {selectedTab === 'endpoints' && (
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5" />
              API Endpoints ({filteredEndpoints.length})
            </h2>
            <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              View Documentation
            </button>
          </div>

          <div className="space-y-4">
            {filteredEndpoints.map(endpoint => (
              <div key={endpoint.id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`px-2 py-1 rounded text-xs font-mono font-semibold ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </div>
                      <code className="font-mono text-white/80">{endpoint.path}</code>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(endpoint.status)}`}>
                        {endpoint.status}
                      </div>
                    </div>
                    <p className="text-sm text-white/60 mb-3">{endpoint.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-white/60">Calls Today</div>
                        <div className="font-semibold">{formatNumber(endpoint.usage_stats.calls_today)}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Success Rate</div>
                        <div className="font-semibold text-green-400">{endpoint.usage_stats.success_rate}%</div>
                      </div>
                      <div>
                        <div className="text-white/60">Avg Response</div>
                        <div className="font-semibold">{endpoint.usage_stats.avg_response_time}ms</div>
                      </div>
                      <div>
                        <div className="text-white/60">Rate Limit</div>
                        <div className="font-semibold">{endpoint.rate_limit.requests_per_minute}/min</div>
                      </div>
                    </div>

                    {endpoint.permissions_required.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-white/60 mb-1">Required Permissions:</div>
                        <div className="flex flex-wrap gap-1">
                          {endpoint.permissions_required.map(permission => (
                            <span key={permission} className="px-2 py-1 rounded-full text-xs bg-purple-400/20 text-purple-400">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400">
                      <Code className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {selectedTab === 'webhooks' && (
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Webhook Endpoints ({filteredWebhooks.length})
            </h2>
            <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Webhook
            </button>
          </div>

          <div className="space-y-4">
            {filteredWebhooks.map(webhook => (
              <div key={webhook.id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{webhook.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(webhook.status)}`}>
                        {webhook.status}
                      </div>
                    </div>
                    <div className="font-mono text-sm text-white/80 mb-3 bg-white/5 px-2 py-1 rounded">
                      {webhook.url}
                    </div>

                    <div className="mb-3">
                      <div className="text-sm text-white/60 mb-1">Events:</div>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map(event => (
                          <span key={event} className="px-2 py-1 rounded-full text-xs bg-blue-400/20 text-blue-400">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-white/60">Deliveries</div>
                        <div className="font-semibold">{formatNumber(webhook.delivery_stats.total_deliveries)}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Success Rate</div>
                        <div className="font-semibold text-green-400">
                          {((webhook.delivery_stats.successful_deliveries / webhook.delivery_stats.total_deliveries) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60">Avg Response</div>
                        <div className="font-semibold">{webhook.delivery_stats.avg_response_time}ms</div>
                      </div>
                      <div>
                        <div className="text-white/60">Last Delivery</div>
                        <div className="font-semibold">
                          {webhook.last_delivery ? new Date(webhook.last_delivery.timestamp).toLocaleString() : 'Never'}
                        </div>
                      </div>
                    </div>

                    {webhook.last_delivery && (
                      <div className={`mt-3 p-2 rounded border-l-4 ${webhook.last_delivery.success
                        ? 'bg-green-400/10 border-green-400'
                        : 'bg-red-400/10 border-red-400'
                        }`}>
                        <div className={`text-xs ${webhook.last_delivery.success ? 'text-green-400' : 'text-red-400'}`}>
                          <strong>Last Delivery:</strong> {webhook.last_delivery.success ? 'Success' : 'Failed'}
                          ({webhook.last_delivery.status_code}) - {webhook.last_delivery.response_time}ms
                          {webhook.last_delivery.error_message && (
                            <div className="mt-1">{webhook.last_delivery.error_message}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {selectedTab === 'analytics' && (
        <div className="grid gap-6">
          <GlassCard>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              API Usage Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{formatNumber(stats.total_requests_today)}</div>
                <div className="text-white/60">Requests Today</div>
                <div className="text-sm text-green-400 mt-1">↑ 12% from yesterday</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{stats.avg_success_rate.toFixed(1)}%</div>
                <div className="text-white/60">Success Rate</div>
                <div className="text-sm text-green-400 mt-1">↑ 0.3% from last week</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">145ms</div>
                <div className="text-white/60">Avg Response Time</div>
                <div className="text-sm text-red-400 mt-1">↑ 12ms from last week</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent API Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="p-2 rounded-full bg-green-400/20">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">High API usage detected</div>
                  <div className="text-xs text-white/60">Mobile app API key exceeded 80% of daily limit</div>
                </div>
                <div className="text-xs text-white/60">2 min ago</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="p-2 rounded-full bg-blue-400/20">
                  <Key className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">New API key created</div>
                  <div className="text-xs text-white/60">Development testing key generated</div>
                </div>
                <div className="text-xs text-white/60">15 min ago</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="p-2 rounded-full bg-orange-400/20">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Webhook delivery failure</div>
                  <div className="text-xs text-white/60">Payment webhook returned 500 error</div>
                </div>
                <div className="text-xs text-white/60">1 hour ago</div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
