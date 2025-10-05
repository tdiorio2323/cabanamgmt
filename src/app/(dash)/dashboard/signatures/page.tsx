"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  PenTool,
  User,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  Search,
  Send,
  FileText,
  MapPin,
  RefreshCw,
  Shield,
  Verified,
  History,
  QrCode,
  Bell,
  Users,
  TrendingUp,
  BarChart3
} from "lucide-react";

type SignatureRequest = {
  id: string;
  document_id: string;
  document_title: string;
  contract_number?: string;
  requester_id: string;
  requester_name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'declined' | 'expired' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  expires_at: string;
  completed_at?: string;
  signers: Signer[];
  signed_count: number;
  total_signers: number;
  reminder_sent_at?: string;
  completion_percentage: number;
  document_type: 'contract' | 'agreement' | 'form' | 'nda' | 'other';
};

type Signer = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'viewed' | 'signed' | 'declined';
  signed_at?: string;
  viewed_at?: string;
  ip_address?: string;
  location?: string;
  signature_method: 'electronic' | 'digital' | 'wet';
  order: number;
  required: boolean;
};

type SignatureSession = {
  id: string;
  signer_id: string;
  signer_name: string;
  document_title: string;
  session_token: string;
  started_at: string;
  expires_at: string;
  status: 'active' | 'completed' | 'expired';
  progress_percentage: number;
  current_page: number;
  total_pages: number;
  ip_address: string;
  user_agent: string;
};

export default function ESignaturesPage() {
  const [signatureRequests, setSignatureRequests] = useState<SignatureRequest[]>([]);
  const [activeSessions, setActiveSessions] = useState<SignatureSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<'requests' | 'sessions' | 'analytics'>('requests');

  useEffect(() => {
    fetchSignatureData();
  }, []);

  const fetchSignatureData = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockRequests: SignatureRequest[] = [
        {
          id: "req_1",
          document_id: "doc_1",
          document_title: "Luxury Villa Rental Agreement",
          contract_number: "CTR-2025-001",
          requester_id: "admin_1",
          requester_name: "Admin User",
          status: "completed",
          priority: "high",
          created_at: "2025-10-01T00:00:00Z",
          expires_at: "2025-10-15T00:00:00Z",
          completed_at: "2025-10-05T14:30:00Z",
          signed_count: 2,
          total_signers: 2,
          completion_percentage: 100,
          document_type: "contract",
          signers: [
            {
              id: "signer_1",
              name: "Sarah Johnson",
              email: "sarah@luxuryevents.com",
              role: "Client Representative",
              status: "signed",
              signed_at: "2025-10-05T10:15:00Z",
              viewed_at: "2025-10-05T09:30:00Z",
              ip_address: "192.168.1.100",
              location: "New York, NY",
              signature_method: "electronic",
              order: 1,
              required: true
            },
            {
              id: "signer_2",
              name: "Tyler Diorio",
              email: "tyler@cabana.test",
              role: "Property Owner",
              status: "signed",
              signed_at: "2025-10-05T14:30:00Z",
              viewed_at: "2025-10-05T14:20:00Z",
              ip_address: "192.168.1.101",
              location: "Los Angeles, CA",
              signature_method: "electronic",
              order: 2,
              required: true
            }
          ]
        },
        {
          id: "req_2",
          document_id: "doc_2",
          document_title: "Photography Services Agreement",
          contract_number: "CTR-2025-002",
          requester_id: "admin_1",
          requester_name: "Admin User",
          status: "in_progress",
          priority: "medium",
          created_at: "2025-10-05T00:00:00Z",
          expires_at: "2025-10-20T00:00:00Z",
          signed_count: 1,
          total_signers: 2,
          completion_percentage: 50,
          document_type: "agreement",
          reminder_sent_at: "2025-10-08T09:00:00Z",
          signers: [
            {
              id: "signer_3",
              name: "Michael Chen",
              email: "michael@premiumprod.com",
              role: "Service Provider",
              status: "signed",
              signed_at: "2025-10-06T16:45:00Z",
              viewed_at: "2025-10-06T16:30:00Z",
              ip_address: "192.168.1.102",
              location: "San Francisco, CA",
              signature_method: "electronic",
              order: 1,
              required: true
            },
            {
              id: "signer_4",
              name: "Tyler Diorio",
              email: "tyler@cabana.test",
              role: "Property Owner",
              status: "pending",
              signature_method: "electronic",
              order: 2,
              required: true
            }
          ]
        },
        {
          id: "req_3",
          document_id: "doc_3",
          document_title: "Non-Disclosure Agreement",
          requester_id: "admin_1",
          requester_name: "Admin User",
          status: "pending",
          priority: "urgent",
          created_at: "2025-10-08T00:00:00Z",
          expires_at: "2025-10-22T00:00:00Z",
          signed_count: 0,
          total_signers: 1,
          completion_percentage: 0,
          document_type: "nda",
          signers: [
            {
              id: "signer_5",
              name: "Emma Rodriguez",
              email: "emma@elitemag.com",
              role: "Partner",
              status: "pending",
              signature_method: "electronic",
              order: 1,
              required: true
            }
          ]
        }
      ];

      const mockSessions: SignatureSession[] = [
        {
          id: "session_1",
          signer_id: "signer_4",
          signer_name: "Tyler Diorio",
          document_title: "Photography Services Agreement",
          session_token: "sess_abc123xyz",
          started_at: "2025-10-09T10:30:00Z",
          expires_at: "2025-10-09T11:30:00Z",
          status: "active",
          progress_percentage: 75,
          current_page: 3,
          total_pages: 4,
          ip_address: "192.168.1.101",
          user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
        }
      ];

      setSignatureRequests(mockRequests);
      setActiveSessions(mockSessions);
    } catch (error) {
      console.error('Error fetching signature data:', error);
      toast.error('Failed to load signature data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'signed':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'in_progress':
      case 'viewed':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'declined':
      case 'expired':
      case 'cancelled':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      default:
        return 'text-white/60 bg-white/10 border-white/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'signed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in_progress':
      case 'viewed':
        return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'declined':
      case 'expired':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-white/60" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 bg-red-400/20';
      case 'high':
        return 'text-orange-400 bg-orange-400/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'low':
        return 'text-green-400 bg-green-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const filteredRequests = signatureRequests.filter(request => {
    const matchesSearch = request.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contract_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.signers.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total_requests: signatureRequests.length,
    completed: signatureRequests.filter(r => r.status === 'completed').length,
    in_progress: signatureRequests.filter(r => r.status === 'in_progress').length,
    pending: signatureRequests.filter(r => r.status === 'pending').length,
    active_sessions: activeSessions.filter(s => s.status === 'active').length,
    completion_rate: signatureRequests.length > 0
      ? Math.round((signatureRequests.filter(r => r.status === 'completed').length / signatureRequests.length) * 100)
      : 0,
    avg_completion_time: "2.3 days" // Mock data
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
            E-Signatures
          </h1>
          <p className="text-white/60 mt-2">Manage digital signature requests and sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send for Signature
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            Generate Link
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <PenTool className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_requests}</div>
              <div className="text-sm text-white/60">Total</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-sm text-white/60">Completed</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.in_progress}</div>
              <div className="text-sm text-white/60">In Progress</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm text-white/60">Pending</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-2xl font-bold">{stats.active_sessions}</div>
              <div className="text-sm text-white/60">Active</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.completion_rate}%</div>
              <div className="text-sm text-white/60">Rate</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-2xl font-bold">{stats.avg_completion_time}</div>
              <div className="text-sm text-white/60">Avg Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'requests'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
        >
          <PenTool className="w-4 h-4 inline mr-2" />
          Signature Requests ({signatureRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'sessions'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Active Sessions ({activeSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'analytics'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Analytics
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search signature requests..."
            className="frosted-input w-full pl-10"
          />
        </div>
        {activeTab === 'requests' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="frosted-input min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="declined">Declined</option>
            <option value="expired">Expired</option>
          </select>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'requests' ? (
        <GlassCard>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            Signature Requests ({filteredRequests.length})
          </h2>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <PenTool className="w-12 h-12 mx-auto mb-4 text-white/30" />
              <p className="text-white/60">No signature requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="border border-white/10 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{request.document_title}</h3>
                          {request.contract_number && (
                            <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/60">
                              {request.contract_number}
                            </span>
                          )}
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                          <span>Created: {new Date(request.created_at).toLocaleDateString()}</span>
                          <span>Expires: {new Date(request.expires_at).toLocaleDateString()}</span>
                          <span>Requester: {request.requester_name}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Completion Progress</span>
                            <span>{request.completion_percentage}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${request.completion_percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Signers */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-white/80">Signers ({request.signed_count}/{request.total_signers})</h4>
                          {request.signers.map((signer) => (
                            <div key={signer.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <div className="font-medium">{signer.name}</div>
                                  <div className="text-sm text-white/60">{signer.role} • {signer.email}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {signer.location && (
                                  <div className="text-xs text-white/60 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {signer.location}
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(signer.status)}
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(signer.status)}`}>
                                    {signer.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </span>
                                </div>
                                {signer.status === 'signed' && (
                                  <div className="flex items-center gap-1 text-green-400">
                                    <Verified className="w-4 h-4" />
                                    <Shield className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                          {request.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {request.status === 'in_progress' && (
                          <button
                            className="p-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 transition-colors text-orange-400"
                            title="Send Reminder"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      ) : activeTab === 'sessions' ? (
        <GlassCard>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Active Signature Sessions ({activeSessions.length})
          </h2>
          {activeSessions.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-white/30" />
              <p className="text-white/60">No active signature sessions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="border border-white/10 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{session.document_title}</h3>
                        <div className="text-white/60 mb-2">Signer: {session.signer_name}</div>
                        <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                          <span>Started: {new Date(session.started_at).toLocaleTimeString()}</span>
                          <span>Expires: {new Date(session.expires_at).toLocaleTimeString()}</span>
                          <span>Page {session.current_page} of {session.total_pages}</span>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Session Progress</span>
                            <span>{session.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${session.progress_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs text-white/60">
                          IP: {session.ip_address} • {session.user_agent.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(session.status)}`}>
                        {session.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <button
                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400"
                        title="Monitor Session"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Signature Analytics
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{stats.completion_rate}%</div>
                  <div className="text-white/60">Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{stats.avg_completion_time}</div>
                  <div className="text-white/60">Avg. Time</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Electronic Signatures</span>
                  <span className="text-green-400">89%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
                <div className="flex justify-between">
                  <span>Mobile Signatures</span>
                  <span className="text-blue-400">34%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '34%' }}></div>
                </div>
                <div className="flex justify-between">
                  <span>Reminder Effectiveness</span>
                  <span className="text-purple-400">67%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div className="flex-1">
                  <div className="font-medium">Contract CTR-2025-001 fully signed</div>
                  <div className="text-sm text-white/60">Sarah Johnson completed signature</div>
                </div>
                <div className="text-sm text-white/60">2 hours ago</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <Bell className="w-5 h-5 text-orange-400" />
                <div className="flex-1">
                  <div className="font-medium">Reminder sent</div>
                  <div className="text-sm text-white/60">Photography Services Agreement</div>
                </div>
                <div className="text-sm text-white/60">1 day ago</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <Send className="w-5 h-5 text-blue-400" />
                <div className="flex-1">
                  <div className="font-medium">New signature request sent</div>
                  <div className="text-sm text-white/60">NDA for Emma Rodriguez</div>
                </div>
                <div className="text-sm text-white/60">2 days ago</div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
