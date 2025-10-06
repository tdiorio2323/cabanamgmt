"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  Settings,
  Database,
  Shield,
  Key,
  Globe,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Copy,
  Edit,
  Trash2,
  Plus,
  Upload,
  Download,
  Activity,
  Network,
  HardDrive,
  Cpu,
  MemoryStick,
  Search,
  Clock,
  Mail,
  BarChart3
} from "lucide-react";

type EnvironmentVariable = {
  id: string;
  key: string;
  value: string;
  description: string;
  category: 'database' | 'api' | 'authentication' | 'payment' | 'email' | 'storage' | 'analytics' | 'security' | 'other';
  is_sensitive: boolean;
  is_required: boolean;
  environment: 'production' | 'staging' | 'development' | 'all';
  last_modified: string;
  modified_by: string;
  validation_rules?: {
    type: 'string' | 'number' | 'boolean' | 'url' | 'email';
    min_length?: number;
    max_length?: number;
    pattern?: string;
    allowed_values?: string[];
  };
};

type EnvironmentHealth = {
  service: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  response_time?: number;
  last_check: string;
  uptime: string;
  version?: string;
  details?: string;
  metrics?: {
    cpu_usage?: number;
    memory_usage?: number;
    disk_usage?: number;
    connections?: number;
  };
};

type BackupConfig = {
  id: string;
  name: string;
  type: 'database' | 'files' | 'configuration';
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  retention_days: number;
  encryption_enabled: boolean;
  compression_enabled: boolean;
  storage_location: string;
  last_backup: string;
  backup_size: number;
  status: 'active' | 'paused' | 'error';
  next_backup: string;
};

export default function EnvironmentPage() {
  const [envVars, setEnvVars] = useState<EnvironmentVariable[]>([]);
  const [healthChecks, setHealthChecks] = useState<EnvironmentHealth[]>([]);
  const [backupConfigs, setBackupConfigs] = useState<BackupConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'variables' | 'health' | 'backups' | 'security'>('variables');
  const [selectedEnvironment, setSelectedEnvironment] = useState<'all' | 'production' | 'staging' | 'development'>('production');
  const [searchTerm, setSearchTerm] = useState("");
  const [showSensitive, setShowSensitive] = useState(false);
  const [_editingVar, setEditingVar] = useState<string | null>(null);

  useEffect(() => {
    fetchEnvironmentData();
  }, []);

  const fetchEnvironmentData = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockEnvVars: EnvironmentVariable[] = [
        {
          id: "env_1",
          key: "DATABASE_URL",
          value: "postgresql://user:***@host:5432/cabana_prod",
          description: "Primary database connection string",
          category: "database",
          is_sensitive: true,
          is_required: true,
          environment: "production",
          last_modified: "2025-10-01T00:00:00Z",
          modified_by: "admin@cabana.test",
          validation_rules: {
            type: "url",
            pattern: "^postgresql://"
          }
        },
        {
          id: "env_2",
          key: "SUPABASE_URL",
          value: "https://xxx.supabase.co",
          description: "Supabase project URL",
          category: "api",
          is_sensitive: false,
          is_required: true,
          environment: "all",
          last_modified: "2025-09-15T00:00:00Z",
          modified_by: "admin@cabana.test",
          validation_rules: {
            type: "url",
            pattern: "^https://.*\\.supabase\\.co$"
          }
        },
        {
          id: "env_3",
          key: "SUPABASE_ANON_KEY",
          value: "eyJ***hidden***",
          description: "Supabase anonymous key for client-side access",
          category: "authentication",
          is_sensitive: true,
          is_required: true,
          environment: "all",
          last_modified: "2025-09-15T00:00:00Z",
          modified_by: "admin@cabana.test"
        },
        {
          id: "env_4",
          key: "STRIPE_PUBLIC_KEY",
          value: "pk_live_***",
          description: "Stripe publishable key for payments",
          category: "payment",
          is_sensitive: false,
          is_required: true,
          environment: "production",
          last_modified: "2025-08-20T00:00:00Z",
          modified_by: "admin@cabana.test"
        },
        {
          id: "env_5",
          key: "STRIPE_SECRET_KEY",
          value: "sk_live_***hidden***",
          description: "Stripe secret key for server-side payments",
          category: "payment",
          is_sensitive: true,
          is_required: true,
          environment: "production",
          last_modified: "2025-08-20T00:00:00Z",
          modified_by: "admin@cabana.test"
        },
        {
          id: "env_6",
          key: "SMTP_HOST",
          value: "smtp.resend.com",
          description: "SMTP server for email delivery",
          category: "email",
          is_sensitive: false,
          is_required: true,
          environment: "all",
          last_modified: "2025-07-10T00:00:00Z",
          modified_by: "admin@cabana.test"
        },
        {
          id: "env_7",
          key: "SMTP_PASSWORD",
          value: "***hidden***",
          description: "SMTP password for email authentication",
          category: "email",
          is_sensitive: true,
          is_required: true,
          environment: "all",
          last_modified: "2025-07-10T00:00:00Z",
          modified_by: "admin@cabana.test"
        },
        {
          id: "env_8",
          key: "AWS_S3_BUCKET",
          value: "cabana-assets-prod",
          description: "S3 bucket for file storage",
          category: "storage",
          is_sensitive: false,
          is_required: true,
          environment: "production",
          last_modified: "2025-06-01T00:00:00Z",
          modified_by: "admin@cabana.test"
        },
        {
          id: "env_9",
          key: "JWT_SECRET",
          value: "***hidden***",
          description: "Secret key for JWT token signing",
          category: "security",
          is_sensitive: true,
          is_required: true,
          environment: "all",
          last_modified: "2025-05-01T00:00:00Z",
          modified_by: "admin@cabana.test",
          validation_rules: {
            type: "string",
            min_length: 32
          }
        },
        {
          id: "env_10",
          key: "GOOGLE_ANALYTICS_ID",
          value: "GA-XXXXXXXXX-1",
          description: "Google Analytics tracking ID",
          category: "analytics",
          is_sensitive: false,
          is_required: false,
          environment: "production",
          last_modified: "2025-04-01T00:00:00Z",
          modified_by: "admin@cabana.test"
        }
      ];

      const mockHealthChecks: EnvironmentHealth[] = [
        {
          service: "Database",
          status: "healthy",
          response_time: 45,
          last_check: "2025-10-08T10:15:00Z",
          uptime: "99.98%",
          version: "PostgreSQL 15.4",
          details: "All connections healthy",
          metrics: {
            cpu_usage: 12,
            memory_usage: 34,
            disk_usage: 67,
            connections: 45
          }
        },
        {
          service: "Supabase API",
          status: "healthy",
          response_time: 89,
          last_check: "2025-10-08T10:14:30Z",
          uptime: "99.99%",
          version: "v2.45.3",
          details: "All endpoints responding normally"
        },
        {
          service: "Stripe API",
          status: "healthy",
          response_time: 156,
          last_check: "2025-10-08T10:13:45Z",
          uptime: "99.95%",
          version: "2023-10-16",
          details: "Payment processing available"
        },
        {
          service: "Email Service (Resend)",
          status: "healthy",
          response_time: 234,
          last_check: "2025-10-08T10:12:20Z",
          uptime: "99.92%",
          details: "SMTP connection established"
        },
        {
          service: "S3 Storage",
          status: "warning",
          response_time: 456,
          last_check: "2025-10-08T10:11:00Z",
          uptime: "99.89%",
          details: "Slight latency increase detected",
          metrics: {
            disk_usage: 78
          }
        },
        {
          service: "Redis Cache",
          status: "healthy",
          response_time: 12,
          last_check: "2025-10-08T10:15:15Z",
          uptime: "99.97%",
          version: "7.2.1",
          details: "Cache hit rate: 94.2%",
          metrics: {
            memory_usage: 56,
            connections: 23
          }
        }
      ];

      const mockBackupConfigs: BackupConfig[] = [
        {
          id: "backup_1",
          name: "Database Full Backup",
          type: "database",
          frequency: "daily",
          retention_days: 30,
          encryption_enabled: true,
          compression_enabled: true,
          storage_location: "s3://cabana-backups/database/",
          last_backup: "2025-10-08T02:00:00Z",
          backup_size: 2.4e9, // 2.4GB
          status: "active",
          next_backup: "2025-10-09T02:00:00Z"
        },
        {
          id: "backup_2",
          name: "User Assets Backup",
          type: "files",
          frequency: "weekly",
          retention_days: 90,
          encryption_enabled: true,
          compression_enabled: false,
          storage_location: "s3://cabana-backups/assets/",
          last_backup: "2025-10-06T03:00:00Z",
          backup_size: 15.6e9, // 15.6GB
          status: "active",
          next_backup: "2025-10-13T03:00:00Z"
        },
        {
          id: "backup_3",
          name: "Environment Config Backup",
          type: "configuration",
          frequency: "daily",
          retention_days: 7,
          encryption_enabled: true,
          compression_enabled: true,
          storage_location: "s3://cabana-backups/config/",
          last_backup: "2025-10-08T01:00:00Z",
          backup_size: 1.2e6, // 1.2MB
          status: "active",
          next_backup: "2025-10-09T01:00:00Z"
        }
      ];

      setEnvVars(mockEnvVars);
      setHealthChecks(mockHealthChecks);
      setBackupConfigs(mockBackupConfigs);
    } catch (error) {
      console.error('Error fetching environment data:', error);
      toast.error('Failed to load environment data');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'api':
        return <Globe className="w-4 h-4" />;
      case 'authentication':
        return <Shield className="w-4 h-4" />;
      case 'payment':
        return <Key className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'storage':
        return <HardDrive className="w-4 h-4" />;
      case 'analytics':
        return <BarChart3 className="w-4 h-4" />;
      case 'security':
        return <Lock className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'database':
        return 'text-blue-400 bg-blue-400/20';
      case 'api':
        return 'text-green-400 bg-green-400/20';
      case 'authentication':
        return 'text-purple-400 bg-purple-400/20';
      case 'payment':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'email':
        return 'text-pink-400 bg-pink-400/20';
      case 'storage':
        return 'text-cyan-400 bg-cyan-400/20';
      case 'analytics':
        return 'text-orange-400 bg-orange-400/20';
      case 'security':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return 'text-green-400 bg-green-400/20';
      case 'warning':
      case 'paused':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'error':
        return 'text-red-400 bg-red-400/20';
      case 'unknown':
        return 'text-white/60 bg-white/10';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
      case 'paused':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-white/60" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredEnvVars = envVars.filter(envVar => {
    const matchesSearch = envVar.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      envVar.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEnvironment = selectedEnvironment === 'all' ||
      envVar.environment === selectedEnvironment ||
      envVar.environment === 'all';
    return matchesSearch && matchesEnvironment;
  });

  const groupedEnvVars = filteredEnvVars.reduce((acc, envVar) => {
    if (!acc[envVar.category]) {
      acc[envVar.category] = [];
    }
    acc[envVar.category].push(envVar);
    return acc;
  }, {} as Record<string, EnvironmentVariable[]>);

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
            Environment Settings
          </h1>
          <p className="text-white/60 mt-2">Manage environment variables, health monitoring, and system configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Config
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Config
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{envVars.length}</div>
              <div className="text-sm text-white/60">Environment Variables</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{healthChecks.filter(h => h.status === 'healthy').length}</div>
              <div className="text-sm text-white/60">Healthy Services</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-2xl font-bold">{envVars.filter(v => v.is_sensitive).length}</div>
              <div className="text-sm text-white/60">Sensitive Variables</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-2xl font-bold">{backupConfigs.filter(b => b.status === 'active').length}</div>
              <div className="text-sm text-white/60">Active Backups</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-lg w-fit">
        <button
          onClick={() => setSelectedTab('variables')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'variables'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Variables ({envVars.length})
        </button>
        <button
          onClick={() => setSelectedTab('health')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'health'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Health ({healthChecks.length})
        </button>
        <button
          onClick={() => setSelectedTab('backups')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'backups'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Backups ({backupConfigs.length})
        </button>
        <button
          onClick={() => setSelectedTab('security')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'security'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Security
        </button>
      </div>

      {selectedTab === 'variables' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search environment variables..."
                className="frosted-input w-full pl-10"
              />
            </div>
            <select
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value as 'all' | 'production' | 'staging' | 'development')}
              className="frosted-input"
            >
              <option value="all">All Environments</option>
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
              Show Sensitive
            </button>
            <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Variable
            </button>
          </div>

          {/* Environment Variables by Category */}
          <div className="space-y-6">
            {Object.entries(groupedEnvVars).map(([category, vars]) => (
              <GlassCard key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="text-lg font-semibold capitalize">{category} ({vars.length})</h3>
                </div>

                <div className="space-y-3">
                  {vars.map(envVar => (
                    <div key={envVar.id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <code className="font-mono font-semibold text-white">{envVar.key}</code>
                            {envVar.is_required && (
                              <span className="px-2 py-1 rounded-full text-xs bg-orange-400/20 text-orange-400">
                                Required
                              </span>
                            )}
                            {envVar.is_sensitive && (
                              <span className="px-2 py-1 rounded-full text-xs bg-red-400/20 text-red-400">
                                Sensitive
                              </span>
                            )}
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-400/20 text-blue-400">
                              {envVar.environment}
                            </span>
                          </div>
                          <p className="text-sm text-white/60 mb-3">{envVar.description}</p>

                          <div className="font-mono text-sm bg-white/5 px-3 py-2 rounded border">
                            {envVar.is_sensitive && !showSensitive
                              ? '***hidden***'
                              : envVar.value
                            }
                          </div>

                          <div className="mt-3 text-xs text-white/60">
                            Last modified: {new Date(envVar.last_modified).toLocaleString()} by {envVar.modified_by}
                          </div>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <button className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingVar(envVar.id)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          >
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
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'health' && (
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Health Monitor
            </h2>
            <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh All
            </button>
          </div>

          <div className="grid gap-4">
            {healthChecks.map(check => (
              <div key={check.service} className="p-4 border border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <h3 className="font-semibold text-white">{check.service}</h3>
                      <div className="text-sm text-white/60">{check.details}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                    {check.status.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-white/60">Response Time</div>
                    <div className="font-semibold">{check.response_time}ms</div>
                  </div>
                  <div>
                    <div className="text-white/60">Uptime</div>
                    <div className="font-semibold text-green-400">{check.uptime}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Version</div>
                    <div className="font-semibold">{check.version || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Last Check</div>
                    <div className="font-semibold">{new Date(check.last_check).toLocaleString()}</div>
                  </div>
                </div>

                {check.metrics && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-sm text-white/60 mb-2">Metrics</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {check.metrics.cpu_usage && (
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-blue-400" />
                          <span>CPU: {check.metrics.cpu_usage}%</span>
                        </div>
                      )}
                      {check.metrics.memory_usage && (
                        <div className="flex items-center gap-2">
                          <MemoryStick className="w-4 h-4 text-purple-400" />
                          <span>Memory: {check.metrics.memory_usage}%</span>
                        </div>
                      )}
                      {check.metrics.disk_usage && (
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-orange-400" />
                          <span>Disk: {check.metrics.disk_usage}%</span>
                        </div>
                      )}
                      {check.metrics.connections && (
                        <div className="flex items-center gap-2">
                          <Network className="w-4 h-4 text-green-400" />
                          <span>Connections: {check.metrics.connections}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {selectedTab === 'backups' && (
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Backup Configuration
            </h2>
            <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Backup Job
            </button>
          </div>

          <div className="space-y-4">
            {backupConfigs.map(backup => (
              <div key={backup.id} className="p-4 border border-white/10 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{backup.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                        {backup.status}
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-400/20 text-blue-400">
                        {backup.type}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs bg-purple-400/20 text-purple-400">
                        {backup.frequency}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <div className="text-white/60">Last Backup</div>
                        <div className="font-semibold">{new Date(backup.last_backup).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Backup Size</div>
                        <div className="font-semibold">{formatBytes(backup.backup_size)}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Retention</div>
                        <div className="font-semibold">{backup.retention_days} days</div>
                      </div>
                      <div>
                        <div className="text-white/60">Next Backup</div>
                        <div className="font-semibold">{new Date(backup.next_backup).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {backup.encryption_enabled && (
                        <span className="px-2 py-1 rounded-full bg-green-400/20 text-green-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Encrypted
                        </span>
                      )}
                      {backup.compression_enabled && (
                        <span className="px-2 py-1 rounded-full bg-blue-400/20 text-blue-400">
                          Compressed
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-white/60 font-mono">
                      Storage: {backup.storage_location}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400">
                      <RefreshCw className="w-4 h-4" />
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

      {selectedTab === 'security' && (
        <div className="grid gap-6">
          <GlassCard>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">SSL/TLS</div>
                <div className="text-white/60">Certificate Status</div>
                <div className="text-sm text-green-400 mt-1">Valid until Dec 2025</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">2FA</div>
                <div className="text-white/60">Admin Accounts</div>
                <div className="text-sm text-yellow-400 mt-1">85% adoption</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">Audit</div>
                <div className="text-white/60">Log Retention</div>
                <div className="text-sm text-blue-400 mt-1">90 days active</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Security Alerts
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-400/10 border-l-4 border-yellow-400 rounded">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <div className="flex-1">
                  <div className="font-medium">Environment Variable Expiring</div>
                  <div className="text-sm text-white/60">Stripe API key expires in 45 days</div>
                </div>
                <div className="text-xs text-white/60">2 hours ago</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-400/10 border-l-4 border-green-400 rounded">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div className="flex-1">
                  <div className="font-medium">Security Scan Complete</div>
                  <div className="text-sm text-white/60">No vulnerabilities detected in environment variables</div>
                </div>
                <div className="text-xs text-white/60">1 day ago</div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
