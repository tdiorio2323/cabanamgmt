"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  Search,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";

type VettingApplication = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'requires_action';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submitted_at: string;
  reviewed_at?: string;
  reviewer_id?: string;
  documents: {
    id_verification: 'pending' | 'uploaded' | 'verified' | 'rejected';
    background_check: 'pending' | 'in_progress' | 'completed' | 'failed';
    references: 'pending' | 'contacted' | 'verified' | 'insufficient';
    financial_verification: 'pending' | 'uploaded' | 'verified' | 'rejected';
  };
  notes?: string;
  risk_score?: number;
  application_type: 'creator' | 'client' | 'vip';
  location?: string;
};

export default function VettingPage() {
  const [applications, setApplications] = useState<VettingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockApplications: VettingApplication[] = [
        {
          id: "1",
          user_id: "user_1",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "+1 (555) 123-4567",
          status: "in_review",
          priority: "high",
          submitted_at: "2025-10-04T08:00:00Z",
          application_type: "creator",
          location: "Los Angeles, CA",
          documents: {
            id_verification: "uploaded",
            background_check: "in_progress",
            references: "contacted",
            financial_verification: "verified"
          },
          risk_score: 15,
          notes: "High priority application - experienced photographer"
        },
        {
          id: "2",
          user_id: "user_2",
          name: "Michael Chen",
          email: "michael@example.com",
          phone: "+1 (555) 987-6543",
          status: "pending",
          priority: "medium",
          submitted_at: "2025-10-03T14:30:00Z",
          application_type: "client",
          location: "New York, NY",
          documents: {
            id_verification: "pending",
            background_check: "pending",
            references: "pending",
            financial_verification: "uploaded"
          },
          risk_score: 25
        },
        {
          id: "3",
          user_id: "user_3",
          name: "Emma Rodriguez",
          email: "emma@example.com",
          status: "requires_action",
          priority: "urgent",
          submitted_at: "2025-10-02T10:15:00Z",
          application_type: "vip",
          location: "Miami, FL",
          documents: {
            id_verification: "rejected",
            background_check: "completed",
            references: "verified",
            financial_verification: "rejected"
          },
          risk_score: 45,
          notes: "ID documents need to be resubmitted - expired license"
        }
      ];

      setApplications(mockApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load vetting applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'in_review':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'rejected':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      case 'requires_action':
        return 'text-orange-400 bg-orange-400/20 border-orange-400/50';
      default:
        return 'text-white/60 bg-white/10 border-white/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400';
      case 'high':
        return 'text-orange-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-white/60';
    }
  };

  const getDocumentStatus = (status: string) => {
    switch (status) {
      case 'verified':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected':
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'in_progress':
      case 'contacted':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'uploaded':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-white/60" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 20) return 'text-green-400';
    if (score <= 40) return 'text-yellow-400';
    if (score <= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const handleApprove = async () => {
    try {
      // Update application status
      toast.success('Application approved');
    } catch {
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async () => {
    try {
      // Update application status
      toast.success('Application rejected');
    } catch {
      toast.error('Failed to reject application');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    in_review: applications.filter(a => a.status === 'in_review').length,
    requires_action: applications.filter(a => a.status === 'requires_action').length,
    approved_today: applications.filter(a =>
      a.status === 'approved' &&
      new Date(a.reviewed_at || '').toDateString() === new Date().toDateString()
    ).length
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
            Vetting Queue
          </h1>
          <p className="text-white/60 mt-2">Review and approve user applications</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-white/60">Total Applications</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm text-white/60">Pending Review</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.in_review}</div>
              <div className="text-sm text-white/60">In Review</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-2xl font-bold">{stats.requires_action}</div>
              <div className="text-sm text-white/60">Needs Action</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.approved_today}</div>
              <div className="text-sm text-white/60">Approved Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applications..."
            className="frosted-input w-full pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="frosted-input min-w-[150px]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_review">In Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="requires_action">Requires Action</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="frosted-input min-w-[150px]"
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <GlassCard key={application.id}>
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {application.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold">{application.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                      {application.status.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(application.priority)}`}>
                      {application.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {application.email}
                    </span>
                    {application.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {application.phone}
                      </span>
                    )}
                    {application.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {application.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(application.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Document Status */}
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    {getDocumentStatus(application.documents.id_verification)}
                    <p className="text-xs text-white/60 mt-1">ID</p>
                  </div>
                  <div className="text-center">
                    {getDocumentStatus(application.documents.background_check)}
                    <p className="text-xs text-white/60 mt-1">BG</p>
                  </div>
                  <div className="text-center">
                    {getDocumentStatus(application.documents.references)}
                    <p className="text-xs text-white/60 mt-1">Refs</p>
                  </div>
                  <div className="text-center">
                    {getDocumentStatus(application.documents.financial_verification)}
                    <p className="text-xs text-white/60 mt-1">Fin</p>
                  </div>
                </div>

                {/* Risk Score */}
                {application.risk_score && (
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getRiskScoreColor(application.risk_score)}`}>
                      {application.risk_score}
                    </div>
                    <p className="text-xs text-white/60">Risk Score</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {}}
                    className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {application.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove()}
                      className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400"
                      title="Approve"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {application.status !== 'rejected' && (
                    <button
                      onClick={() => handleReject()}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400"
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {application.notes && (
              <div className="mt-3 p-3 rounded-lg bg-white/5 border-l-2 border-blue-400/50">
                <p className="text-sm text-white/80">{application.notes}</p>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 mx-auto mb-4 text-white/30" />
          <p className="text-white/60">No applications found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
