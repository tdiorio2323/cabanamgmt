"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  HeadphonesIcon,
  MessageSquare,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Paperclip,
  Send,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Globe,
  FileText,
  Image,
  Video,
  File,
  Download,
  Archive,
  Star,
  RefreshCw,
  Settings,
  Info
} from "lucide-react";

type SupportTicket = {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: 'new' | 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'account' | 'booking' | 'property' | 'general';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    tier: 'standard' | 'premium' | 'vip';
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'support' | 'manager' | 'admin';
  };
  tags: string[];
  attachments: {
    id: string;
    filename: string;
    size: number;
    type: string;
    url: string;
  }[];
  messages: TicketMessage[];
  satisfaction_rating?: {
    rating: number;
    feedback?: string;
    rated_at: string;
  };
  sla: {
    response_due: string;
    resolution_due: string;
    is_breached: boolean;
  };
  metadata: {
    source: 'email' | 'chat' | 'phone' | 'web' | 'api';
    user_agent?: string;
    ip_address?: string;
    page_url?: string;
  };
};

type TicketMessage = {
  id: string;
  author: {
    id: string;
    name: string;
    email: string;
    type: 'customer' | 'agent' | 'system';
  };
  content: string;
  timestamp: string;
  is_internal: boolean;
  attachments?: {
    id: string;
    filename: string;
    size: number;
    type: string;
    url: string;
  }[];
};

type SupportStats = {
  total_tickets: number;
  new_tickets: number;
  open_tickets: number;
  pending_tickets: number;
  resolved_today: number;
  avg_response_time: number;
  avg_resolution_time: number;
  satisfaction_score: number;
  by_priority: Record<string, number>;
  by_category: Record<string, number>;
  by_status: Record<string, number>;
  by_assignee: Record<string, number>;
  sla_performance: {
    response_sla_met: number;
    resolution_sla_met: number;
    total_breaches: number;
  };
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [_selectedTicket, _setSelectedTicket] = useState<object | null>(null);
  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [newMessage, setNewMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    fetchSupportData();
  }, []);

  const fetchSupportData = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockTickets: SupportTicket[] = [
        {
          id: "ticket_1",
          ticket_number: "SUP-2025-001234",
          subject: "Unable to complete booking payment",
          description: "I'm having trouble completing the payment for my booking. The payment form keeps showing an error message when I try to submit my card details.",
          status: "open",
          priority: "high",
          category: "booking",
          created_at: "2025-10-08T09:30:00Z",
          updated_at: "2025-10-08T10:15:00Z",
          customer: {
            id: "customer_1",
            name: "Sarah Johnson",
            email: "sarah.j@example.com",
            tier: "premium"
          },
          assignee: {
            id: "agent_1",
            name: "Mike Rodriguez",
            email: "mike@cabana.test",
            role: "support"
          },
          tags: ["payment", "booking", "urgent"],
          attachments: [
            {
              id: "att_1",
              filename: "error_screenshot.png",
              size: 245678,
              type: "image/png",
              url: "/attachments/error_screenshot.png"
            }
          ],
          messages: [
            {
              id: "msg_1",
              author: {
                id: "customer_1",
                name: "Sarah Johnson",
                email: "sarah.j@example.com",
                type: "customer"
              },
              content: "I'm having trouble completing the payment for my booking. The payment form keeps showing an error message when I try to submit my card details. I've attached a screenshot of the error.",
              timestamp: "2025-10-08T09:30:00Z",
              is_internal: false,
              attachments: [
                {
                  id: "att_1",
                  filename: "error_screenshot.png",
                  size: 245678,
                  type: "image/png",
                  url: "/attachments/error_screenshot.png"
                }
              ]
            },
            {
              id: "msg_2",
              author: {
                id: "agent_1",
                name: "Mike Rodriguez",
                email: "mike@cabana.test",
                type: "agent"
              },
              content: "Hi Sarah, thanks for reaching out. I can see the screenshot and it looks like there might be a validation issue with the payment form. Let me check this with our payment processor and get back to you within 2 hours.",
              timestamp: "2025-10-08T09:45:00Z",
              is_internal: false
            },
            {
              id: "msg_3",
              author: {
                id: "agent_1",
                name: "Mike Rodriguez",
                email: "mike@cabana.test",
                type: "agent"
              },
              content: "Internal note: Checked with Stripe - there was a temporary API issue between 9:15-9:35 AM that would have caused this error. The issue is now resolved.",
              timestamp: "2025-10-08T10:15:00Z",
              is_internal: true
            }
          ],
          sla: {
            response_due: "2025-10-08T11:30:00Z",
            resolution_due: "2025-10-09T09:30:00Z",
            is_breached: false
          },
          metadata: {
            source: "web",
            user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            ip_address: "192.168.1.100",
            page_url: "https://cabana.com/booking/payment"
          }
        },
        {
          id: "ticket_2",
          ticket_number: "SUP-2025-001235",
          subject: "Question about VIP membership benefits",
          description: "I'd like to understand more about the VIP membership tier and what benefits it includes compared to my current premium membership.",
          status: "pending",
          priority: "medium",
          category: "account",
          created_at: "2025-10-08T08:45:00Z",
          updated_at: "2025-10-08T09:20:00Z",
          resolved_at: "2025-10-08T09:20:00Z",
          customer: {
            id: "customer_2",
            name: "David Chen",
            email: "d.chen@example.com",
            tier: "premium"
          },
          assignee: {
            id: "agent_2",
            name: "Lisa Thompson",
            email: "lisa@cabana.test",
            role: "support"
          },
          tags: ["membership", "vip", "inquiry"],
          attachments: [],
          messages: [
            {
              id: "msg_4",
              author: {
                id: "customer_2",
                name: "David Chen",
                email: "d.chen@example.com",
                type: "customer"
              },
              content: "I'd like to understand more about the VIP membership tier and what benefits it includes compared to my current premium membership.",
              timestamp: "2025-10-08T08:45:00Z",
              is_internal: false
            },
            {
              id: "msg_5",
              author: {
                id: "agent_2",
                name: "Lisa Thompson",
                email: "lisa@cabana.test",
                type: "agent"
              },
              content: "Hi David! I'd be happy to explain the VIP membership benefits. VIP members get: 1) Priority booking access, 2) 24/7 concierge service, 3) Exclusive properties, 4) Complimentary upgrades when available, 5) 15% discount on all bookings, and 6) Access to VIP-only events. Would you like me to send you a detailed comparison document?",
              timestamp: "2025-10-08T09:20:00Z",
              is_internal: false
            }
          ],
          satisfaction_rating: {
            rating: 5,
            feedback: "Very helpful and thorough explanation!",
            rated_at: "2025-10-08T09:25:00Z"
          },
          sla: {
            response_due: "2025-10-08T10:45:00Z",
            resolution_due: "2025-10-09T08:45:00Z",
            is_breached: false
          },
          metadata: {
            source: "chat",
            ip_address: "203.0.113.45"
          }
        },
        {
          id: "ticket_3",
          ticket_number: "SUP-2025-001236",
          subject: "Property listing not displaying correctly",
          description: "The photos for my property listing are not showing up on the website. I uploaded them yesterday but they're still not visible to potential guests.",
          status: "new",
          priority: "medium",
          category: "property",
          created_at: "2025-10-08T10:00:00Z",
          updated_at: "2025-10-08T10:00:00Z",
          customer: {
            id: "customer_3",
            name: "Maria Garcia",
            email: "maria.g@example.com",
            tier: "standard"
          },
          tags: ["property", "listing", "photos"],
          attachments: [],
          messages: [
            {
              id: "msg_6",
              author: {
                id: "customer_3",
                name: "Maria Garcia",
                email: "maria.g@example.com",
                type: "customer"
              },
              content: "The photos for my property listing are not showing up on the website. I uploaded them yesterday but they're still not visible to potential guests. This is affecting my bookings.",
              timestamp: "2025-10-08T10:00:00Z",
              is_internal: false
            }
          ],
          sla: {
            response_due: "2025-10-08T14:00:00Z",
            resolution_due: "2025-10-09T10:00:00Z",
            is_breached: false
          },
          metadata: {
            source: "email",
            ip_address: "198.51.100.30"
          }
        }
      ];

      const mockStats: SupportStats = {
        total_tickets: 1567,
        new_tickets: 23,
        open_tickets: 45,
        pending_tickets: 12,
        resolved_today: 34,
        avg_response_time: 45, // minutes
        avg_resolution_time: 4.2, // hours
        satisfaction_score: 4.7,
        by_priority: {
          low: 234,
          medium: 567,
          high: 123,
          urgent: 45
        },
        by_category: {
          technical: 345,
          billing: 234,
          account: 456,
          booking: 298,
          property: 167,
          general: 67
        },
        by_status: {
          new: 23,
          open: 45,
          pending: 12,
          resolved: 890,
          closed: 597
        },
        by_assignee: {
          "mike@cabana.test": 34,
          "lisa@cabana.test": 28,
          "john@cabana.test": 23,
          "sarah@cabana.test": 19
        },
        sla_performance: {
          response_sla_met: 94.5,
          resolution_sla_met: 89.2,
          total_breaches: 15
        }
      };

      setTickets(mockTickets);
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching support data:', error);
      toast.error('Failed to load support data');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'text-green-400 bg-green-400/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'high':
        return 'text-orange-400 bg-orange-400/20';
      case 'urgent':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'text-blue-400 bg-blue-400/20';
      case 'open':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'pending':
        return 'text-orange-400 bg-orange-400/20';
      case 'resolved':
        return 'text-green-400 bg-green-400/20';
      case 'closed':
        return 'text-white/60 bg-white/10';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Plus className="w-4 h-4 text-blue-400" />;
      case 'open':
        return <MessageSquare className="w-4 h-4 text-yellow-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-400" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-white/60" />;
      default:
        return <MessageSquare className="w-4 h-4 text-white/60" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <Settings className="w-4 h-4" />;
      case 'billing':
        return <FileText className="w-4 h-4" />;
      case 'account':
        return <User className="w-4 h-4" />;
      case 'booking':
        return <Calendar className="w-4 h-4" />;
      case 'property':
        return <Globe className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'vip':
        return 'text-purple-400 bg-purple-400/20';
      case 'premium':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'standard':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />; {/* eslint-disable-line jsx-a11y/alt-text */ }
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type === 'application/pdf') return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const toggleTicketExpansion = (ticketId: string) => {
    const newExpanded = new Set(expandedTickets);
    if (newExpanded.has(ticketId)) {
      newExpanded.delete(ticketId);
    } else {
      newExpanded.add(ticketId);
    }
    setExpandedTickets(newExpanded);
  };

  const handleSendMessage = (ticketId: string) => {
    if (!newMessage.trim()) return;

    // In a real app, this would send the message via API
    console.log('Sending message:', { ticketId, content: newMessage, isInternal });
    toast.success('Message sent successfully');
    setNewMessage("");
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory;
    const matchesAssignee = selectedAssignee === 'all' || ticket.assignee?.email === selectedAssignee;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignee;
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
            Support Center
          </h1>
          <p className="text-white/60 mt-2">Customer support ticketing and management system</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Ticket
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
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">{stats.open_tickets}</div>
                <div className="text-sm text-white/60">Open Tickets</div>
              </div>
            </div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold">{stats.avg_response_time}m</div>
                <div className="text-sm text-white/60">Avg Response</div>
              </div>
            </div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-2xl font-bold">{stats.resolved_today}</div>
                <div className="text-sm text-white/60">Resolved Today</div>
              </div>
            </div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold">{stats.satisfaction_score}</div>
                <div className="text-sm text-white/60">Satisfaction</div>
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
            placeholder="Search tickets..."
            className="frosted-input w-full pl-10"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="frosted-input"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="frosted-input"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="frosted-input"
        >
          <option value="all">All Categories</option>
          <option value="technical">Technical</option>
          <option value="billing">Billing</option>
          <option value="account">Account</option>
          <option value="booking">Booking</option>
          <option value="property">Property</option>
          <option value="general">General</option>
        </select>
        <select
          value={selectedAssignee}
          onChange={(e) => setSelectedAssignee(e.target.value)}
          className="frosted-input"
        >
          <option value="all">All Agents</option>
          {stats && Object.keys(stats.by_assignee).map(assignee => (
            <option key={assignee} value={assignee}>{assignee}</option>
          ))}
        </select>
        <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Support Tickets */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <HeadphonesIcon className="w-5 h-5" />
            Support Tickets ({filteredTickets.length})
          </h2>
        </div>

        <div className="space-y-2">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleTicketExpansion(ticket.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getStatusIcon(ticket.status)}
                    {expandedTickets.has(ticket.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <code className="font-mono font-semibold text-white">{ticket.ticket_number}</code>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(ticket.customer.tier)}`}>
                        {ticket.customer.tier}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        {getCategoryIcon(ticket.category)}
                        {ticket.category}
                      </div>
                      {ticket.sla.is_breached && (
                        <div className="px-2 py-1 rounded-full text-xs bg-red-400/20 text-red-400 font-medium">
                          SLA Breached
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-white mb-2">{ticket.subject}</h3>
                    <p className="text-sm text-white/80 mb-3 line-clamp-2">{ticket.description}</p>

                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {ticket.customer.name} ({ticket.customer.email})
                      </div>
                      {ticket.assignee && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {ticket.assignee.name}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(ticket.created_at).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {ticket.messages.length} messages
                      </div>
                      {ticket.attachments.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          {ticket.attachments.length}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {ticket.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-full text-xs bg-blue-400/20 text-blue-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-white/60 flex-shrink-0">
                    {new Date(ticket.updated_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {expandedTickets.has(ticket.id) && (
                <div className="border-t border-white/10 p-4 bg-white/5">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Messages */}
                    <div className="lg:col-span-2">
                      <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Conversation ({ticket.messages.length})
                      </h4>

                      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                        {ticket.messages.map(message => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-lg ${message.author.type === 'customer'
                              ? 'bg-blue-400/10 border-l-4 border-blue-400'
                              : message.is_internal
                                ? 'bg-orange-400/10 border-l-4 border-orange-400'
                                : 'bg-green-400/10 border-l-4 border-green-400'
                              }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">{message.author.name}</span>
                                <span className="text-white/60">({message.author.type})</span>
                                {message.is_internal && (
                                  <span className="px-2 py-1 rounded-full text-xs bg-orange-400/20 text-orange-400">
                                    Internal
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-white/60">
                                {new Date(message.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-white/90 mb-2">{message.content}</p>

                            {message.attachments && message.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {message.attachments.map(attachment => (
                                  <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white/10 rounded text-xs">
                                    {getFileTypeIcon(attachment.type)}
                                    <span>{attachment.filename}</span>
                                    <span className="text-white/60">({formatFileSize(attachment.size)})</span>
                                    <button className="p-1 rounded hover:bg-white/10">
                                      <Download className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* New Message Form */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={isInternal}
                              onChange={(e) => setIsInternal(e.target.checked)}
                              className="rounded"
                            />
                            Internal Note
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            rows={3}
                            className="frosted-input flex-1 resize-none"
                          />
                          <button
                            onClick={() => handleSendMessage(ticket.id)}
                            className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Send
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Details */}
                    <div>
                      <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Ticket Details
                      </h4>

                      <div className="space-y-4 text-sm">
                        <div>
                          <div className="text-white/60 mb-1">Customer</div>
                          <div className="font-medium">{ticket.customer.name}</div>
                          <div className="text-white/60">{ticket.customer.email}</div>
                        </div>

                        {ticket.assignee && (
                          <div>
                            <div className="text-white/60 mb-1">Assigned To</div>
                            <div className="font-medium">{ticket.assignee.name}</div>
                            <div className="text-white/60">{ticket.assignee.email}</div>
                          </div>
                        )}

                        <div>
                          <div className="text-white/60 mb-1">SLA Times</div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Response Due:</span>
                              <span className={new Date(ticket.sla.response_due) < new Date() ? 'text-red-400' : 'text-green-400'}>
                                {new Date(ticket.sla.response_due).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Resolution Due:</span>
                              <span className={new Date(ticket.sla.resolution_due) < new Date() ? 'text-red-400' : 'text-green-400'}>
                                {new Date(ticket.sla.resolution_due).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {ticket.satisfaction_rating && (
                          <div>
                            <div className="text-white/60 mb-1">Customer Satisfaction</div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= ticket.satisfaction_rating!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`}
                                  />
                                ))}
                              </div>
                              <span>({ticket.satisfaction_rating.rating}/5)</span>
                            </div>
                            {ticket.satisfaction_rating.feedback && (
                              <p className="text-white/80 mt-1">&ldquo;{ticket.satisfaction_rating.feedback}&rdquo;</p>
                            )}
                          </div>
                        )}

                        <div>
                          <div className="text-white/60 mb-1">Source</div>
                          <div className="font-medium capitalize">{ticket.metadata.source}</div>
                          {ticket.metadata.ip_address && (
                            <div className="text-white/60">{ticket.metadata.ip_address}</div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 space-y-2">
                        <button className="w-full liquid-btn px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Mark as Resolved
                        </button>
                        <button className="w-full frosted-input px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                        <button className="w-full frosted-input px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                          <Users className="w-4 h-4" />
                          Reassign
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12 text-white/60">
            <HeadphonesIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No support tickets found matching your criteria</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
