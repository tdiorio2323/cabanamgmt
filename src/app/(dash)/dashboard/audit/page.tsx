"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  FileText,
  Shield,
  Activity,
  Clock,
  User,
  Server,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Download,
  Search,
  Calendar,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Globe,
  Edit,
  Trash2,
  Plus,
  Settings,
  Users,
  CreditCard,
  LogOut,
  LogIn,
  Code,
  Monitor,
  HardDrive,
  Target
} from "lucide-react";

type AuditLogEntry = {
  id: string;
  timestamp: string;
  user_id: string;
  user_email: string;
  user_role: 'admin' | 'manager' | 'staff' | 'system';
  action: string;
  resource_type: 'user' | 'booking' | 'property' | 'payment' | 'system' | 'audit' | 'api' | 'database';
  resource_id?: string;
  details: {
    description: string;
    changes?: {
      field: string;
      old_value: unknown;
      new_value: unknown;
    }[];
    metadata?: {
      ip_address?: string;
      user_agent?: string;
      request_id?: string;
      endpoint?: string;
      method?: string;
      status_code?: number;
      response_time?: number;
    };
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'warning' | 'error' | 'info';
  tags: string[];
  session_id?: string;
};

type AuditStats = {
  total_entries: number;
  entries_today: number;
  entries_this_week: number;
  entries_this_month: number;
  by_severity: Record<string, number>;
  by_status: Record<string, number>;
  by_user: Record<string, number>;
  by_resource_type: Record<string, number>;
  top_actions: { action: string; count: number }[];
};

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h');
  const [selectedUser, setSelectedUser] = useState<string>('all');

  useEffect(() => {
    fetchAuditLogs();
  }, [selectedSeverity, selectedStatus, selectedResourceType, selectedTimeRange, selectedUser]);

  const fetchAuditLogs = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockAuditLogs: AuditLogEntry[] = [
        {
          id: "audit_1",
          timestamp: "2025-10-08T10:15:00Z",
          user_id: "user_1",
          user_email: "admin@cabana.test",
          user_role: "admin",
          action: "user.created",
          resource_type: "user",
          resource_id: "user_234",
          details: {
            description: "Created new admin user account",
            changes: [
              { field: "email", old_value: null, new_value: "newadmin@cabana.test" },
              { field: "role", old_value: null, new_value: "admin" },
              { field: "status", old_value: null, new_value: "active" }
            ],
            metadata: {
              ip_address: "192.168.1.100",
              user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
              request_id: "req_abc123",
              endpoint: "/api/users",
              method: "POST",
              status_code: 201,
              response_time: 245
            }
          },
          severity: "medium",
          status: "success",
          tags: ["user-management", "admin", "create"],
          session_id: "sess_xyz789"
        },
        {
          id: "audit_2",
          timestamp: "2025-10-08T10:12:30Z",
          user_id: "user_1",
          user_email: "admin@cabana.test",
          user_role: "admin",
          action: "system.config.updated",
          resource_type: "system",
          resource_id: "env_stripe_key",
          details: {
            description: "Updated Stripe API key configuration",
            changes: [
              { field: "stripe_secret_key", old_value: "sk_live_***old***", new_value: "sk_live_***new***" }
            ],
            metadata: {
              ip_address: "192.168.1.100",
              user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
              request_id: "req_def456"
            }
          },
          severity: "high",
          status: "success",
          tags: ["configuration", "payment", "security"],
          session_id: "sess_xyz789"
        },
        {
          id: "audit_3",
          timestamp: "2025-10-08T10:08:15Z",
          user_id: "system",
          user_email: "system@cabana.test",
          user_role: "system",
          action: "auth.login.failed",
          resource_type: "user",
          resource_id: "user_unknown",
          details: {
            description: "Failed login attempt with invalid credentials",
            metadata: {
              ip_address: "203.0.113.45",
              user_agent: "curl/7.68.0",
              request_id: "req_ghi789",
              endpoint: "/api/auth/login",
              method: "POST",
              status_code: 401,
              response_time: 1200
            }
          },
          severity: "medium",
          status: "warning",
          tags: ["authentication", "security", "failed-login"],
          session_id: "sess_failed"
        },
        {
          id: "audit_4",
          timestamp: "2025-10-08T09:45:22Z",
          user_id: "user_2",
          user_email: "manager@cabana.test",
          user_role: "manager",
          action: "booking.payment.processed",
          resource_type: "payment",
          resource_id: "payment_567",
          details: {
            description: "Processed payment for booking BK-2025-001234",
            changes: [
              { field: "status", old_value: "pending", new_value: "completed" },
              { field: "amount", old_value: null, new_value: 2500.00 },
              { field: "currency", old_value: null, new_value: "USD" }
            ],
            metadata: {
              ip_address: "192.168.1.105",
              user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
              request_id: "req_jkl012",
              endpoint: "/api/payments/process",
              method: "POST",
              status_code: 200,
              response_time: 567
            }
          },
          severity: "medium",
          status: "success",
          tags: ["payment", "booking", "financial"],
          session_id: "sess_manager_001"
        },
        {
          id: "audit_5",
          timestamp: "2025-10-08T09:30:45Z",
          user_id: "system",
          user_email: "system@cabana.test",
          user_role: "system",
          action: "database.backup.completed",
          resource_type: "database",
          resource_id: "backup_daily_20251008",
          details: {
            description: "Completed daily database backup successfully",
            metadata: {
              ip_address: "10.0.1.50",
              request_id: "req_backup_001"
            }
          },
          severity: "low",
          status: "success",
          tags: ["backup", "maintenance", "database"],
          session_id: "sess_system_backup"
        },
        {
          id: "audit_6",
          timestamp: "2025-10-08T09:15:12Z",
          user_id: "user_1",
          user_email: "admin@cabana.test",
          user_role: "admin",
          action: "api.key.revoked",
          resource_type: "api",
          resource_id: "key_old_mobile",
          details: {
            description: "Revoked old mobile app API key due to security rotation",
            changes: [
              { field: "status", old_value: "active", new_value: "revoked" },
              { field: "revoked_at", old_value: null, new_value: "2025-10-08T09:15:12Z" },
              { field: "revoked_reason", old_value: null, new_value: "security_rotation" }
            ],
            metadata: {
              ip_address: "192.168.1.100",
              user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
              request_id: "req_mno345"
            }
          },
          severity: "high",
          status: "success",
          tags: ["api", "security", "revocation"],
          session_id: "sess_xyz789"
        },
        {
          id: "audit_7",
          timestamp: "2025-10-08T08:45:33Z",
          user_id: "user_3",
          user_email: "staff@cabana.test",
          user_role: "staff",
          action: "property.status.updated",
          resource_type: "property",
          resource_id: "prop_789",
          details: {
            description: "Updated property availability status",
            changes: [
              { field: "status", old_value: "maintenance", new_value: "available" },
              { field: "updated_by", old_value: "system", new_value: "staff@cabana.test" }
            ],
            metadata: {
              ip_address: "192.168.1.110",
              user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)",
              request_id: "req_pqr678"
            }
          },
          severity: "low",
          status: "success",
          tags: ["property", "status-update", "operations"],
          session_id: "sess_staff_mobile"
        },
        {
          id: "audit_8",
          timestamp: "2025-10-08T08:20:15Z",
          user_id: "system",
          user_email: "system@cabana.test",
          user_role: "system",
          action: "audit.retention.cleanup",
          resource_type: "audit",
          resource_id: "cleanup_90days",
          details: {
            description: "Cleaned up audit logs older than 90 days (deleted 1,234 entries)",
            metadata: {
              ip_address: "127.0.0.1",
              request_id: "req_cleanup_001"
            }
          },
          severity: "low",
          status: "info",
          tags: ["audit", "maintenance", "cleanup"],
          session_id: "sess_system_cleanup"
        }
      ];

      const mockStats: AuditStats = {
        total_entries: 15678,
        entries_today: 234,
        entries_this_week: 1567,
        entries_this_month: 6789,
        by_severity: {
          low: 8934,
          medium: 4567,
          high: 1890,
          critical: 287
        },
        by_status: {
          success: 12456,
          warning: 1789,
          error: 1234,
          info: 199
        },
        by_user: {
          "admin@cabana.test": 5678,
          "system@cabana.test": 4567,
          "manager@cabana.test": 3456,
          "staff@cabana.test": 1977
        },
        by_resource_type: {
          user: 3456,
          booking: 4567,
          property: 2345,
          payment: 2890,
          system: 1567,
          audit: 567,
          api: 234,
          database: 52
        },
        top_actions: [
          { action: "auth.login.success", count: 3456 },
          { action: "booking.created", count: 2345 },
          { action: "payment.processed", count: 1890 },
          { action: "user.updated", count: 1567 },
          { action: "system.config.updated", count: 890 }
        ]
      };

      setAuditLogs(mockAuditLogs);
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('login')) return <LogIn className="w-4 h-4" />;
    if (action.includes('logout')) return <LogOut className="w-4 h-4" />;
    if (action.includes('created')) return <Plus className="w-4 h-4" />;
    if (action.includes('updated')) return <Edit className="w-4 h-4" />;
    if (action.includes('deleted')) return <Trash2 className="w-4 h-4" />;
    if (action.includes('payment')) return <CreditCard className="w-4 h-4" />;
    if (action.includes('backup')) return <HardDrive className="w-4 h-4" />;
    if (action.includes('api')) return <Code className="w-4 h-4" />;
    if (action.includes('system')) return <Settings className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'booking':
        return <Calendar className="w-4 h-4" />;
      case 'property':
        return <Monitor className="w-4 h-4" />;
      case 'payment':
        return <CreditCard className="w-4 h-4" />;
      case 'system':
        return <Server className="w-4 h-4" />;
      case 'audit':
        return <FileText className="w-4 h-4" />;
      case 'api':
        return <Code className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-400 bg-green-400/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'high':
        return 'text-orange-400 bg-orange-400/20';
      case 'critical':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
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
      case 'system':
        return 'text-purple-400 bg-purple-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;
    const matchesResourceType = selectedResourceType === 'all' || log.resource_type === selectedResourceType;
    const matchesUser = selectedUser === 'all' || log.user_email === selectedUser;

    return matchesSearch && matchesSeverity && matchesStatus && matchesResourceType && matchesUser;
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
            Audit Logs
          </h1>
          <p className="text-white/60 mt-2">System activity tracking and security monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">{stats.total_entries.toLocaleString()}</div>
                <div className="text-sm text-white/60">Total Entries</div>
              </div>
            </div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-2xl font-bold">{stats.entries_today}</div>
                <div className="text-sm text-white/60">Today</div>
              </div>
            </div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold">{stats.by_severity.critical}</div>
                <div className="text-sm text-white/60">Critical</div>
              </div>
            </div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-400" />
              <div>
                <div className="text-2xl font-bold">{stats.by_status.error}</div>
                <div className="text-sm text-white/60">Errors</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs..."
            className="frosted-input w-full pl-10"
          />
        </div>
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="frosted-input"
        >
          <option value="all">All Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="frosted-input"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
          <option value="info">Info</option>
        </select>
        <select
          value={selectedResourceType}
          onChange={(e) => setSelectedResourceType(e.target.value)}
          className="frosted-input"
        >
          <option value="all">All Resources</option>
          <option value="user">User</option>
          <option value="booking">Booking</option>
          <option value="property">Property</option>
          <option value="payment">Payment</option>
          <option value="system">System</option>
          <option value="api">API</option>
          <option value="database">Database</option>
        </select>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="frosted-input"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="frosted-input"
        >
          <option value="all">All Users</option>
          {stats && Object.keys(stats.by_user).map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
      </div>

      {/* Audit Logs */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Audit Log Entries ({filteredLogs.length})
          </h2>
        </div>

        <div className="space-y-2">
          {filteredLogs.map(log => (
            <div key={log.id} className="border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleLogExpansion(log.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getStatusIcon(log.status)}
                    {expandedLogs.has(log.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        {getActionIcon(log.action)}
                        <code className="font-mono font-semibold text-white">{log.action}</code>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUserRoleColor(log.user_role)}`}>
                        {log.user_role}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        {getResourceIcon(log.resource_type)}
                        {log.resource_type}
                      </div>
                    </div>

                    <p className="text-sm text-white/80 mb-2">{log.details.description}</p>

                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.user_email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                      {log.details.metadata?.ip_address && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {log.details.metadata.ip_address}
                        </div>
                      )}
                      {log.resource_id && (
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {log.resource_id}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {log.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-full text-xs bg-blue-400/20 text-blue-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-white/60 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {expandedLogs.has(log.id) && (
                <div className="border-t border-white/10 p-4 bg-white/5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Changes */}
                    {log.details.changes && log.details.changes.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Changes Made
                        </h4>
                        <div className="space-y-2">
                          {log.details.changes.map((change, index) => (
                            <div key={index} className="p-2 bg-white/5 rounded text-xs">
                              <div className="font-medium text-white/80 mb-1">{change.field}</div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <div className="text-red-400 mb-1">Before:</div>
                                  <code className="text-white/60">{JSON.stringify(change.old_value) || 'null'}</code>
                                </div>
                                <div>
                                  <div className="text-green-400 mb-1">After:</div>
                                  <code className="text-white/80">{JSON.stringify(change.new_value)}</code>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    {log.details.metadata && (
                      <div>
                        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Technical Details
                        </h4>
                        <div className="space-y-2 text-xs">
                          {log.details.metadata.request_id && (
                            <div className="flex justify-between">
                              <span className="text-white/60">Request ID:</span>
                              <code className="text-white/80">{log.details.metadata.request_id}</code>
                            </div>
                          )}
                          {log.details.metadata.endpoint && (
                            <div className="flex justify-between">
                              <span className="text-white/60">Endpoint:</span>
                              <code className="text-white/80">{log.details.metadata.method} {log.details.metadata.endpoint}</code>
                            </div>
                          )}
                          {log.details.metadata.status_code && (
                            <div className="flex justify-between">
                              <span className="text-white/60">Status:</span>
                              <code className={`${log.details.metadata.status_code < 400 ? 'text-green-400' : 'text-red-400'}`}>
                                {log.details.metadata.status_code}
                              </code>
                            </div>
                          )}
                          {log.details.metadata.response_time && (
                            <div className="flex justify-between">
                              <span className="text-white/60">Response Time:</span>
                              <code className="text-white/80">{log.details.metadata.response_time}ms</code>
                            </div>
                          )}
                          {log.details.metadata.user_agent && (
                            <div>
                              <div className="text-white/60 mb-1">User Agent:</div>
                              <code className="text-white/80 text-xs break-all">{log.details.metadata.user_agent}</code>
                            </div>
                          )}
                          {log.session_id && (
                            <div className="flex justify-between">
                              <span className="text-white/60">Session ID:</span>
                              <code className="text-white/80">{log.session_id}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-white/60">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No audit logs found matching your criteria</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
