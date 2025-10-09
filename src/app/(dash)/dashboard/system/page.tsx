"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  Settings,
  Server,
  Database,
  Shield,
  Clock,
  Zap,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Lock,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Upload,
  Download,
  Plus,
  Trash2,
  Edit,
  FileText,
  Users,
  RotateCcw
} from "lucide-react";

type SystemConfig = {
  id: string;
  category: string;
  name: string;
  key: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean' | 'select' | 'json' | 'file' | 'password';
  description: string;
  options?: string[];
  required: boolean;
  sensitive: boolean;
  environment: 'production' | 'staging' | 'development' | 'all';
  last_modified: string;
  modified_by: string;
  validation_rule?: string;
  default_value?: string | number | boolean;
  restart_required?: boolean;
};

type SystemHealth = {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  database_status: 'connected' | 'slow' | 'disconnected';
  cache_status: 'healthy' | 'degraded' | 'failed';
  external_apis: {
    name: string;
    status: 'up' | 'down' | 'slow';
    response_time: number;
  }[];
  last_backup: string;
  error_rate: number;
  active_connections: number;
  queue_size: number;
};

export default function SystemConfigPage() {
  const [configurations, setConfigurations] = useState<SystemConfig[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEnvironment, setSelectedEnvironment] = useState<'production' | 'staging' | 'development'>("production");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSensitive, setShowSensitive] = useState(false);

  const handleCopyValue = useCallback(async (value: string | number | boolean) => {
    try {
      await navigator.clipboard.writeText(String(value));
      toast.success("Value copied to clipboard");
    } catch {
      toast.error("Failed to copy value");
    }
  }, []);

  const handleDeleteConfig = useCallback(async (configId: string) => {
    try {
      // Mock implementation - replace with actual Supabase delete
      setConfigurations(prev => prev.filter(config => config.id !== configId));
      toast.success("Configuration deleted successfully");
    } catch {
      toast.error("Failed to delete configuration");
    }
  }, []);

  const fetchSystemConfiguration = useCallback(async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockConfigurations: SystemConfig[] = [
        // Database Configuration
        {
          id: "config_1",
          category: "Database",
          name: "Database Connection Pool Size",
          key: "DB_POOL_SIZE",
          value: 20,
          type: "number",
          description: "Maximum number of concurrent database connections",
          required: true,
          sensitive: false,
          environment: "production",
          last_modified: "2025-10-01T10:00:00Z",
          modified_by: "admin@cabana.test",
          validation_rule: "min:5,max:100",
          // const [editingConfig, setEditingConfig] = useState<string | null>(null);
          restart_required: true
        },
        {
          id: "config_2",
          category: "Database",
          name: "Database URL",
          key: "DATABASE_URL",
          value: "postgresql://user:***@localhost:5432/cabana_prod",
          type: "password",
          description: "Primary database connection string",
          required: true,
          sensitive: true,
          environment: "production",
          last_modified: "2025-09-15T14:30:00Z",
          modified_by: "admin@cabana.test",
          restart_required: true
        },

        // Authentication & Security
        {
          id: "config_3",
          category: "Security",
          name: "JWT Secret Key",
          key: "JWT_SECRET",
          value: "***hidden***",
          type: "password",
          description: "Secret key for JWT token signing",
          required: true,
          sensitive: true,
          environment: "production",
          last_modified: "2025-08-20T09:15:00Z",
          modified_by: "admin@cabana.test",
          restart_required: true
        },
        {
          id: "config_4",
          category: "Security",
          name: "Session Timeout",
          key: "SESSION_TIMEOUT",
          value: 3600,
          type: "number",
          description: "User session timeout in seconds",
          required: true,
          sensitive: false,
          environment: "all",
          last_modified: "2025-10-05T11:20:00Z",
          modified_by: "admin@cabana.test",
          validation_rule: "min:300,max:86400",
          default_value: 3600
        },
        {
          id: "config_5",
          category: "Security",
          name: "Rate Limiting",
          key: "RATE_LIMIT_ENABLED",
          value: true,
          type: "boolean",
          description: "Enable API rate limiting protection",
          required: false,
          sensitive: false,
          environment: "all",
          last_modified: "2025-09-28T16:45:00Z",
          modified_by: "admin@cabana.test",
          default_value: true
        },

        // Email & Notifications
        {
          id: "config_6",
          category: "Email",
          name: "SMTP Server",
          key: "SMTP_HOST",
          value: "smtp.postmark.com",
          type: "string",
          description: "SMTP server hostname for email delivery",
          required: true,
          sensitive: false,
          environment: "production",
          last_modified: "2025-09-10T12:30:00Z",
          modified_by: "admin@cabana.test"
        },
        {
          id: "config_7",
          category: "Email",
          name: "SMTP Password",
          key: "SMTP_PASSWORD",
          value: "***hidden***",
          type: "password",
          description: "SMTP server authentication password",
          required: true,
          sensitive: true,
          environment: "production",
          last_modified: "2025-09-10T12:30:00Z",
          modified_by: "admin@cabana.test"
        },
        {
          id: "config_8",
          category: "Notifications",
          name: "Push Notification Provider",
          key: "PUSH_PROVIDER",
          value: "firebase",
          type: "select",
          options: ["firebase", "pusher", "onesignal", "disabled"],
          description: "Push notification service provider",
          required: false,
          sensitive: false,
          environment: "all",
          last_modified: "2025-09-25T08:15:00Z",
          modified_by: "admin@cabana.test",
          default_value: "firebase"
        },

        // Payment & Stripe
        {
          id: "config_9",
          category: "Payments",
          name: "Stripe Publishable Key",
          key: "STRIPE_PUBLISHABLE_KEY",
          value: "pk_live_***",
          type: "string",
          description: "Stripe publishable key for frontend integration",
          required: true,
          sensitive: false,
          environment: "production",
          last_modified: "2025-09-30T15:20:00Z",
          modified_by: "admin@cabana.test"
        },
        {
          id: "config_10",
          category: "Payments",
          name: "Stripe Secret Key",
          key: "STRIPE_SECRET_KEY",
          value: "sk_live_***",
          type: "password",
          description: "Stripe secret key for server-side operations",
          required: true,
          sensitive: true,
          environment: "production",
          last_modified: "2025-09-30T15:20:00Z",
          modified_by: "admin@cabana.test"
        },

        // Application Settings
        {
          id: "config_11",
          category: "Application",
          name: "Application Name",
          key: "APP_NAME",
          value: "Cabana Management",
          type: "string",
          description: "Display name for the application",
          required: true,
          sensitive: false,
          environment: "all",
          last_modified: "2025-08-01T00:00:00Z",
          modified_by: "admin@cabana.test",
          default_value: "Cabana Management"
        },
        {
          id: "config_12",
          category: "Application",
          name: "Environment",
          key: "NODE_ENV",
          value: "production",
          type: "select",
          options: ["production", "staging", "development"],
          description: "Application environment mode",
          required: true,
          sensitive: false,
          environment: "all",
          last_modified: "2025-10-01T00:00:00Z",
          modified_by: "admin@cabana.test",
          restart_required: true
        },
        {
          id: "config_13",
          category: "Application",
          name: "Debug Mode",
          key: "DEBUG_MODE",
          value: false,
          type: "boolean",
          description: "Enable detailed error logging and debugging",
          required: false,
          sensitive: false,
          environment: "all",
          last_modified: "2025-10-02T09:30:00Z",
          modified_by: "admin@cabana.test",
          default_value: false,
          restart_required: true
        },

        // File Storage
        {
          id: "config_14",
          category: "Storage",
          name: "File Storage Provider",
          key: "STORAGE_PROVIDER",
          value: "supabase",
          type: "select",
          options: ["supabase", "aws_s3", "gcp_storage", "local"],
          description: "File storage backend service",
          required: true,
          sensitive: false,
          environment: "all",
          last_modified: "2025-09-20T13:45:00Z",
          modified_by: "admin@cabana.test",
          restart_required: true
        },
        {
          id: "config_15",
          category: "Storage",
          name: "Max File Size (MB)",
          key: "MAX_FILE_SIZE",
          value: 50,
          type: "number",
          description: "Maximum file upload size in megabytes",
          required: true,
          sensitive: false,
          environment: "all",
          last_modified: "2025-10-03T14:10:00Z",
          modified_by: "admin@cabana.test",
          validation_rule: "min:1,max:1024",
          default_value: 10
        }
      ];

      const mockSystemHealth: SystemHealth = {
        status: "healthy",
        uptime: 2592000, // 30 days in seconds
        cpu_usage: 34.5,
        memory_usage: 68.2,
        disk_usage: 45.8,
        database_status: "connected",
        cache_status: "healthy",
        external_apis: [
          { name: "Stripe API", status: "up", response_time: 120 },
          { name: "Postmark Email", status: "up", response_time: 85 },
          { name: "Supabase Storage", status: "up", response_time: 95 },
          { name: "Firebase FCM", status: "slow", response_time: 450 }
        ],
        last_backup: "2025-10-08T02:00:00Z",
        error_rate: 0.02,
        active_connections: 245,
        queue_size: 12
      };

      setConfigurations(mockConfigurations);
      setSystemHealth(mockSystemHealth);
    } catch (error) {
      console.error('Error fetching system configuration:', error);
      toast.error('Failed to load system configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemConfiguration();
  }, [fetchSystemConfiguration]);

  const categories = [...new Set(configurations.map(config => config.category))];

  const filteredConfigurations = configurations.filter(config => {
    const matchesSearch = config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || config.category === selectedCategory;
    const matchesEnvironment = config.environment === 'all' || config.environment === selectedEnvironment;
    const matchesSensitive = showSensitive || !config.sensitive;
    return matchesSearch && matchesCategory && matchesEnvironment && matchesSensitive;
  });

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
      case 'connected':
        return 'text-green-400 bg-green-400/20';
      case 'warning':
      case 'slow':
      case 'degraded':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'critical':
      case 'down':
      case 'failed':
      case 'disconnected':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const renderConfigValue = (config: SystemConfig) => {
    if (config.sensitive && !showSensitive) {
      return "***hidden***";
    }

    if (config.type === 'boolean') {
      return config.value ? 'true' : 'false';
    }

    return String(config.value);
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
            System Configuration
          </h1>
          <p className="text-white/60 mt-2">Manage application settings and environment variables</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Config
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* System Health Overview */}
      {systemHealth && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Health
            </h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthStatusColor(systemHealth.status)}`}>
              {systemHealth.status.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-lg font-semibold">{formatUptime(systemHealth.uptime)}</div>
              <div className="text-sm text-white/60">Uptime</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <Cpu className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-lg font-semibold">{systemHealth.cpu_usage}%</div>
              <div className="text-sm text-white/60">CPU Usage</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <MemoryStick className="w-6 h-6 mx-auto mb-2 text-orange-400" />
              <div className="text-lg font-semibold">{systemHealth.memory_usage}%</div>
              <div className="text-sm text-white/60">Memory Usage</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <HardDrive className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-lg font-semibold">{systemHealth.disk_usage}%</div>
              <div className="text-sm text-white/60">Disk Usage</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Status */}
            <div>
              <h3 className="text-lg font-semibold mb-3">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span>Database</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(systemHealth.database_status)}`}>
                    {systemHealth.database_status}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Cache</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(systemHealth.cache_status)}`}>
                    {systemHealth.cache_status}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Active Connections</span>
                  </div>
                  <div className="text-white font-medium">{systemHealth.active_connections}</div>
                </div>
              </div>
            </div>

            {/* External APIs */}
            <div>
              <h3 className="text-lg font-semibold mb-3">External APIs</h3>
              <div className="space-y-3">
                {systemHealth.external_apis.map((api, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4" />
                      <span>{api.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/60">{api.response_time}ms</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(api.status)}`}>
                        {api.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-white/60">Last Backup:</span>
              <div className="font-medium">{new Date(systemHealth.last_backup).toLocaleString()}</div>
            </div>
            <div>
              <span className="text-white/60">Error Rate:</span>
              <div className="font-medium">{(systemHealth.error_rate * 100).toFixed(2)}%</div>
            </div>
            <div>
              <span className="text-white/60">Queue Size:</span>
              <div className="font-medium">{systemHealth.queue_size} jobs</div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search configurations..."
            className="frosted-input w-full pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="frosted-input min-w-[150px]"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={selectedEnvironment}
          onChange={(e) => setSelectedEnvironment(e.target.value as 'production' | 'staging' | 'development')}
          className="frosted-input min-w-[150px]"
        >
          <option value="production">Production</option>
          <option value="staging">Staging</option>
          <option value="development">Development</option>
        </select>
        <button
          onClick={() => setShowSensitive(!showSensitive)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${showSensitive
            ? 'bg-red-400/20 text-red-400'
            : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
        >
          {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          Sensitive
        </button>
      </div>

      {/* Configuration Items */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration Items
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value as 'production' | 'staging' | 'development')}
              className="frosted-input min-w-[150px]"
            >
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
            </select>
            <button
              onClick={() => fetchSystemConfiguration()}
              className="frosted-button flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {filteredConfigurations.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 mx-auto mb-4 text-white/30" />
            <p className="text-white/60">No configuration items found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConfigurations.map(config => (
              <div key={config.id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{config.name}</h3>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-400/20 text-blue-400">
                        {config.category}
                      </span>
                      {config.required && (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-400/20 text-red-400">
                          Required
                        </span>
                      )}
                      {config.sensitive && (
                        <span className="px-2 py-1 rounded-full text-xs bg-orange-400/20 text-orange-400">
                          <Lock className="w-3 h-3 mr-1 inline" />
                          Sensitive
                        </span>
                      )}
                      {config.restart_required && (
                        <span className="px-2 py-1 rounded-full text-xs bg-purple-400/20 text-purple-400">
                          Restart Required
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-white/60 mb-3">{config.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-white/60 mb-1">Key</div>
                        <div className="font-mono bg-white/5 px-2 py-1 rounded text-white/80">
                          {config.key}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 mb-1">Value</div>
                        <div className="font-mono bg-white/5 px-2 py-1 rounded text-white/80 break-all">
                          {renderConfigValue(config)}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 mb-1">Type</div>
                        <div className="capitalize">{config.type}</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                      <div className="flex items-center gap-4">
                        <span>Environment: <strong className="text-white/80">{config.environment}</strong></span>
                        <span>Modified: {new Date(config.last_modified).toLocaleDateString()}</span>
                        <span>By: {config.modified_by}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {!config.sensitive && (
                      <button
                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400"
                        title="Copy Value"
                        onClick={() => handleCopyValue(config.value)}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {!config.required && (
                      <button
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400"
                        title="Delete"
                        onClick={() => handleDeleteConfig(config.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Validation Info */}
                {config.validation_rule && (
                  <div className="mt-3 p-2 bg-blue-400/10 border-l-4 border-blue-400 rounded">
                    <div className="text-xs text-blue-400">
                      <strong>Validation:</strong> {config.validation_rule}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <div className="text-center">
            <Server className="w-8 h-8 mx-auto mb-3 text-blue-400" />
            <h3 className="font-semibold mb-2">Restart Services</h3>
            <p className="text-sm text-white/60 mb-4">Restart application services to apply configuration changes</p>
            <button className="liquid-btn w-full flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Restart Application
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-center">
            <FileText className="w-8 h-8 mx-auto mb-3 text-green-400" />
            <h3 className="font-semibold mb-2">Backup Configuration</h3>
            <p className="text-sm text-white/60 mb-4">Create a backup of current configuration settings</p>
            <button className="frosted-input w-full flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Create Backup
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-center">
            <Shield className="w-8 h-8 mx-auto mb-3 text-purple-400" />
            <h3 className="font-semibold mb-2">Security Audit</h3>
            <p className="text-sm text-white/60 mb-4">Run security audit on configuration settings</p>
            <button className="frosted-input w-full flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Run Audit
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
