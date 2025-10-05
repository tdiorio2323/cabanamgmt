"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Flag,
  MessageSquare,
  Image as ImageIcon,
  Video,
  FileText,
  User,
  Calendar,
  Clock,
  Search,
  MoreHorizontal,
  Settings,
  Zap,
  Target,
  Activity,
  BarChart3,
  RefreshCw
} from "lucide-react";
import Image from "next/image";

type ModerationItem = {
  id: string;
  type: 'image' | 'video' | 'text' | 'audio' | 'profile' | 'review';
  content_type: string;
  title?: string;
  description?: string;
  content_url?: string;
  thumbnail_url?: string;
  text_content?: string;
  reported_by: string;
  reporter_name: string;
  reported_by_role: 'user' | 'creator' | 'admin' | 'system';
  content_author: string;
  content_author_name: string;
  reason: string;
  category: 'inappropriate' | 'spam' | 'harassment' | 'violence' | 'copyright' | 'fake' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'auto_approved' | 'auto_rejected';
  ai_confidence: number;
  ai_flags: string[];
  human_review_required: boolean;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  reviewer_name?: string;
  review_notes?: string;
  auto_moderated: boolean;
  view_count: number;
  engagement_score: number;
  violation_history: number;
  user_reputation_score: number;
  location?: string;
  metadata?: {
    file_size?: number;
    dimensions?: { width: number; height: number };
    duration?: number;
    language?: string;
    tags?: string[];
  };
};

type ModerationRule = {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  content_types: string[];
  keywords: string[];
  ai_model: string;
  confidence_threshold: number;
  auto_action: 'none' | 'flag' | 'remove' | 'quarantine';
  active: boolean;
  created_at: string;
  updated_at: string;
  trigger_count: number;
  accuracy_rate: number;
};

export default function ContentModerationPage() {
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [moderationRules, setModerationRules] = useState<ModerationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'queue' | 'rules' | 'analytics'>('queue');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  // const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchModerationData();
  }, []);

  const fetchModerationData = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockModerationItems: ModerationItem[] = [
        {
          id: "mod_1",
          type: "image",
          content_type: "property_photo",
          title: "Suspicious Property Listing Photo",
          description: "Property photo reported for potential misrepresentation",
          content_url: "/moderation/suspicious-property.jpg",
          thumbnail_url: "/moderation/suspicious-property-thumb.jpg",
          reported_by: "user_123",
          reporter_name: "John Smith",
          reported_by_role: "user",
          content_author: "creator_456",
          content_author_name: "Jane Doe",
          created_at: "2025-10-05T10:30:00Z",
          reason: "This appears to be a stock photo, not the actual property",
          category: "fake",
          severity: "high",
          status: "pending",
          ai_confidence: 0.85,
          ai_flags: ["stock_image_detected", "metadata_mismatch", "reverse_image_found"],
          human_review_required: true,
          // Mock data for now - replace with actual database queries
          auto_moderated: false,
          view_count: 1247,
          engagement_score: 72,
          violation_history: 2,
          user_reputation_score: 3.2,
          location: "Los Angeles, CA",
          metadata: {
            file_size: 2456789,
            dimensions: { width: 1920, height: 1080 }
          }
        },
        {
          id: "mod_2",
          type: "text",
          content_type: "review",
          text_content: "This place was absolutely terrible! The owner is a scammer and the photos are all fake. Don't book here!!!",
          reported_by: "creator_789",
          reporter_name: "Elite Properties LLC",
          reported_by_role: "creator",
          content_author: "user_321",
          content_author_name: "Mike Johnson",
          reason: "False and defamatory review with no booking history",
          category: "harassment",
          severity: "medium",
          status: "escalated",
          ai_confidence: 0.67,
          ai_flags: ["aggressive_language", "no_booking_history", "competitor_keywords"],
          human_review_required: true,
          created_at: "2025-10-07T09:15:00Z",
          reviewed_at: "2025-10-08T10:30:00Z",
          reviewed_by: "admin_1",
          reviewer_name: "Sarah Wilson",
          review_notes: "Escalated to legal team - no booking record found for this user",
          auto_moderated: false,
          view_count: 234,
          engagement_score: 15,
          violation_history: 0,
          user_reputation_score: 1.8,
          metadata: {
            language: "en"
          }
        },
        {
          id: "mod_3",
          type: "video",
          content_type: "property_tour",
          title: "Inappropriate Content in Property Tour",
          description: "Property tour video contains inappropriate material",
          content_url: "/moderation/inappropriate-tour.mp4",
          thumbnail_url: "/moderation/inappropriate-tour-thumb.jpg",
          reported_by: "system",
          reporter_name: "AI Moderation System",
          reported_by_role: "system",
          content_author: "creator_234",
          content_author_name: "Luxury Escapes Inc",
          reason: "Adult content detected in property tour video",
          category: "inappropriate",
          severity: "critical",
          status: "auto_rejected",
          ai_confidence: 0.94,
          ai_flags: ["adult_content", "nudity_detected", "policy_violation"],
          human_review_required: false,
          created_at: "2025-10-08T16:45:00Z",
          reviewed_at: "2025-10-08T16:46:00Z",
          auto_moderated: true,
          view_count: 45,
          engagement_score: 8,
          violation_history: 1,
          user_reputation_score: 4.1,
          metadata: {
            file_size: 87654321,
            dimensions: { width: 1920, height: 1080 },
            duration: 120
          }
        },
        {
          id: "mod_4",
          type: "profile",
          content_type: "creator_profile",
          title: "Suspicious Creator Profile",
          description: "Creator profile showing signs of fraud",
          reported_by: "user_567",
          reporter_name: "Amanda Chen",
          reported_by_role: "user",
          content_author: "creator_890",
          content_author_name: "Fake Luxury Rentals",
          reason: "Profile uses stolen photos and fake credentials",
          category: "fake",
          severity: "high",
          status: "approved",
          ai_confidence: 0.78,
          ai_flags: ["duplicate_images", "suspicious_credentials", "new_account_pattern"],
          human_review_required: true,
          created_at: "2025-10-06T11:20:00Z",
          reviewed_at: "2025-10-07T14:15:00Z",
          reviewed_by: "admin_2",
          reviewer_name: "Mark Thompson",
          review_notes: "Profile suspended - verified identity documents required",
          auto_moderated: false,
          view_count: 678,
          engagement_score: 23,
          violation_history: 3,
          user_reputation_score: 1.2
        }
      ];

      const mockModerationRules: ModerationRule[] = [
        {
          id: "rule_1",
          name: "Adult Content Detection",
          description: "Automatically detects and flags adult or explicit content",
          category: "Content Safety",
          severity: "critical",
          content_types: ["image", "video"],
          keywords: ["explicit", "adult", "nsfw"],
          ai_model: "vision-safety-v2",
          confidence_threshold: 0.8,
          auto_action: "remove",
          active: true,
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-09-15T00:00:00Z",
          trigger_count: 45,
          accuracy_rate: 94.2
        },
        {
          id: "rule_2",
          name: "Spam Text Detection",
          description: "Identifies spam content in reviews and messages",
          category: "Spam Prevention",
          severity: "medium",
          content_types: ["text", "review"],
          keywords: ["spam", "promotional", "fake"],
          ai_model: "text-classifier-v3",
          confidence_threshold: 0.7,
          auto_action: "flag",
          active: true,
          created_at: "2025-02-01T00:00:00Z",
          updated_at: "2025-10-01T00:00:00Z",
          trigger_count: 234,
          accuracy_rate: 87.6
        },
        {
          id: "rule_3",
          name: "Copyright Violation Scanner",
          description: "Detects potential copyright violations in uploaded media",
          category: "Copyright Protection",
          severity: "high",
          content_types: ["image", "video", "audio"],
          keywords: ["copyright", "stolen", "watermark"],
          ai_model: "copyright-detector-v1",
          confidence_threshold: 0.85,
          auto_action: "quarantine",
          active: true,
          created_at: "2025-03-01T00:00:00Z",
          updated_at: "2025-09-20T00:00:00Z",
          trigger_count: 78,
          accuracy_rate: 91.3
        },
        {
          id: "rule_4",
          name: "Hate Speech Filter",
          description: "Identifies and filters hate speech and harassment",
          category: "Community Safety",
          severity: "high",
          content_types: ["text", "review", "message"],
          keywords: ["hate", "harassment", "discrimination"],
          ai_model: "sentiment-analysis-v4",
          confidence_threshold: 0.75,
          auto_action: "flag",
          active: true,
          created_at: "2025-01-15T00:00:00Z",
          updated_at: "2025-09-30T00:00:00Z",
          trigger_count: 156,
          accuracy_rate: 89.7
        }
      ];

      setModerationItems(mockModerationItems);
      setModerationRules(mockModerationRules);
    } catch (error) {
      console.error('Error fetching moderation data:', error);
      toast.error('Failed to load moderation data');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-green-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-red-400" />;
      case 'text':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'profile':
        return <User className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-white/60" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-400/20';
      case 'high':
        return 'text-orange-400 bg-orange-400/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'low':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-400/20';
      case 'rejected':
      case 'auto_rejected':
        return 'text-red-400 bg-red-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'escalated':
        return 'text-purple-400 bg-purple-400/20';
      case 'auto_approved':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const filteredItems = moderationItems.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content_author_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesSeverity && matchesType;
  });

  const stats = {
    total_items: moderationItems.length,
    pending: moderationItems.filter(item => item.status === 'pending').length,
    approved: moderationItems.filter(item => item.status === 'approved').length,
    rejected: moderationItems.filter(item => item.status === 'rejected' || item.status === 'auto_rejected').length,
    escalated: moderationItems.filter(item => item.status === 'escalated').length,
    auto_moderated: moderationItems.filter(item => item.auto_moderated).length,
    high_priority: moderationItems.filter(item => item.severity === 'critical' || item.severity === 'high').length,
    avg_confidence: moderationItems.reduce((sum, item) => sum + item.ai_confidence, 0) / moderationItems.length || 0,
    human_review_required: moderationItems.filter(item => item.human_review_required).length
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
            Content Moderation
          </h1>
          <p className="text-white/60 mt-2">Monitor and moderate user-generated content</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Queue
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_items}</div>
              <div className="text-sm text-white/60">Total</div>
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
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <div className="text-sm text-white/60">Approved</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-2xl font-bold">{stats.rejected}</div>
              <div className="text-sm text-white/60">Rejected</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-2xl font-bold">{stats.escalated}</div>
              <div className="text-sm text-white/60">Escalated</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-2xl font-bold">{stats.auto_moderated}</div>
              <div className="text-sm text-white/60">Auto</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Flag className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-2xl font-bold">{stats.high_priority}</div>
              <div className="text-sm text-white/60">Priority</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{(stats.avg_confidence * 100).toFixed(0)}%</div>
              <div className="text-sm text-white/60">AI Accuracy</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-2xl font-bold">{stats.human_review_required}</div>
              <div className="text-sm text-white/60">Review Req</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-lg w-fit">
        <button
          onClick={() => setSelectedTab('queue')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'queue'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Moderation Queue ({stats.pending})
        </button>
        <button
          onClick={() => setSelectedTab('rules')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'rules'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Rules & Filters ({moderationRules.length})
        </button>
        <button
          onClick={() => setSelectedTab('analytics')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'analytics'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Analytics & Reports
        </button>
      </div>

      {selectedTab === 'queue' && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search moderation items..."
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="escalated">Escalated</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="frosted-input min-w-[150px]"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="frosted-input min-w-[150px]"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="text">Text</option>
              <option value="profile">Profiles</option>
            </select>
          </div>

          {/* Moderation Queue */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Moderation Queue ({filteredItems.length})
              </h2>
              <div className="flex items-center gap-2">
                <button className="frosted-input px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Bulk Approve
                </button>
                <button className="frosted-input px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Bulk Reject
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredItems.map(item => (
                <div key={item.id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex gap-4">
                    {/* Content Preview */}
                    <div className="flex-shrink-0">
                      {item.thumbnail_url ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 relative">
                          <Image
                            src={item.thumbnail_url}
                            alt="Content preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            {item.title || `${item.type} content`}
                            {item.auto_moderated && (
                              <span className="px-2 py-1 rounded-full text-xs bg-cyan-400/20 text-cyan-400">
                                Auto
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-white/60 mt-1">
                            By {item.content_author_name} • Reported by {item.reporter_name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                            {item.severity}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status.replace('_', ' ')}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-white/80 mb-2">
                          <strong>Reason:</strong> {item.reason}
                        </p>
                        {item.text_content && (
                          <p className="text-sm text-white/70 italic">&quot;{item.text_content}&quot;</p>
                        )}
                      </div>

                      {/* AI Analysis */}
                      <div className="mb-3">
                        <div className="flex items-center gap-4 text-sm text-white/60 mb-2">
                          <span>AI Confidence: <strong className="text-white">{(item.ai_confidence * 100).toFixed(0)}%</strong></span>
                          <span>User Rep: <strong className="text-white">{item.user_reputation_score.toFixed(1)}/5.0</strong></span>
                          <span>Violations: <strong className="text-white">{item.violation_history}</strong></span>
                          {item.human_review_required && (
                            <span className="px-2 py-1 rounded-full text-xs bg-orange-400/20 text-orange-400">
                              Human Review Required
                            </span>
                          )}
                        </div>

                        {item.ai_flags.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-white/70 italic mb-2">&quot;{item.text_content}&quot;</p>
                            <div className="flex flex-wrap gap-1">
                              {item.ai_flags.map(flag => (
                                <span key={flag} className="px-2 py-1 rounded-full text-xs bg-red-400/20 text-red-400">
                                  {flag.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Review Notes */}
                      {item.review_notes && (
                        <div className="p-3 bg-blue-400/10 border-l-4 border-blue-400 mb-3">
                          <p className="text-sm text-white/80">
                            <strong>Review Notes:</strong> {item.review_notes}
                          </p>
                          <p className="text-xs text-white/60 mt-1">
                            Reviewed by {item.reviewer_name} on {new Date(item.reviewed_at!).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.view_count} views
                          </span>
                          {item.location && (
                            <span>{item.location}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {item.status === 'pending' && (
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button className="liquid-btn px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button className="frosted-input px-4 py-2 rounded-lg text-sm flex items-center gap-2 text-red-400">
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                        <button className="frosted-input px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                          <Flag className="w-4 h-4" />
                          Escalate
                        </button>
                        <button className="frosted-input p-2 rounded-lg">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 mx-auto mb-4 text-white/30" />
                <p className="text-white/60">No moderation items found matching your criteria</p>
              </div>
            )}
          </GlassCard>
        </>
      )
      }

      {
        selectedTab === 'rules' && (
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Moderation Rules ({moderationRules.length})
              </h2>
              <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
                <Settings className="w-4 h-4" />
                New Rule
              </button>
            </div>

            <div className="grid gap-4">
              {moderationRules.map(rule => (
                <div key={rule.id} className="p-4 border border-white/10 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        {rule.name}
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(rule.severity)}`}>
                          {rule.severity}
                        </div>
                        {rule.active ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-400/20 text-green-400">Active</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-400/20 text-red-400">Inactive</span>
                        )}
                      </h3>
                      <p className="text-sm text-white/60 mt-1">{rule.description}</p>
                    </div>
                    <button className="frosted-input p-2 rounded-lg">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-white/60">Content Types</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.content_types.map(type => (
                          <span key={type} className="px-2 py-1 rounded-full text-xs bg-blue-400/20 text-blue-400">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/60">AI Model</div>
                      <div>{rule.ai_model}</div>
                    </div>
                    <div>
                      <div className="text-white/60">Confidence Threshold</div>
                      <div>{(rule.confidence_threshold * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="text-white/60">Auto Action</div>
                      <div className="capitalize">{rule.auto_action.replace('_', ' ')}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-6 text-sm text-white/60">
                      <span>Triggers: <strong className="text-white">{rule.trigger_count}</strong></span>
                      <span>Accuracy: <strong className="text-white">{rule.accuracy_rate}%</strong></span>
                      <span>Updated: {new Date(rule.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="frosted-input px-3 py-1 rounded text-xs">Edit</button>
                      <button className="frosted-input px-3 py-1 rounded text-xs">
                        {rule.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )
      }

      {
        selectedTab === 'analytics' && (
          <div className="grid gap-6">
            {/* Performance Overview */}
            <GlassCard>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Moderation Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">94.2%</div>
                  <div className="text-white/60">Overall Accuracy</div>
                  <div className="text-sm text-white/60 mt-1">↑ 2.1% from last month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">2.3min</div>
                  <div className="text-white/60">Avg Review Time</div>
                  <div className="text-sm text-white/60 mt-1">↓ 15s from last month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">87%</div>
                  <div className="text-white/60">Auto-Resolution Rate</div>
                  <div className="text-sm text-white/60 mt-1">↑ 5% from last month</div>
                </div>
              </div>
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="p-2 rounded-full bg-red-400/20">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">High-priority content flagged</div>
                    <div className="text-xs text-white/60">Adult content detected in property tour video</div>
                  </div>
                  <div className="text-xs text-white/60">2 min ago</div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="p-2 rounded-full bg-green-400/20">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Bulk approval completed</div>
                    <div className="text-xs text-white/60">12 property photos approved automatically</div>
                  </div>
                  <div className="text-xs text-white/60">15 min ago</div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="p-2 rounded-full bg-purple-400/20">
                    <Settings className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">New moderation rule activated</div>
                    <div className="text-xs text-white/60">Copyright violation scanner updated</div>
                  </div>
                  <div className="text-xs text-white/60">1 hour ago</div>
                </div>
              </div>
            </GlassCard>
          </div>
        )
      }
    </div >
  );
}
