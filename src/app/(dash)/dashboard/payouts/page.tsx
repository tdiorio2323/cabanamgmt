"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Download,
  Search,
  DollarSign,
  Calendar,
  ArrowUpRight,
  Send,
  CreditCard,
  Banknote as Bank,
  Smartphone,
  Bitcoin,
  Users,
  Target,
  Award,
  Plus
} from "lucide-react";

type Payout = {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_email: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payout_method: 'bank_transfer' | 'paypal' | 'stripe' | 'crypto';
  fee_amount: number;
  net_amount: number;
  reference_id?: string;
  booking_count: number;
  total_earnings: number;
  created_at: string;
  processed_at?: string;
  scheduled_date?: string;
  failure_reason?: string;
  tax_withheld?: number;
};

type PayoutSchedule = {
  id: string;
  creator_id: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  minimum_amount: number;
  method: 'bank_transfer' | 'paypal' | 'stripe';
  next_payout: string;
  active: boolean;
};

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [schedules, setSchedules] = useState<PayoutSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockPayouts: Payout[] = [
        {
          id: "1",
          creator_id: "creator_1",
          creator_name: "Sarah Johnson",
          creator_email: "sarah@example.com",
          amount: 2400.00,
          currency: "USD",
          status: "completed",
          payout_method: "bank_transfer",
          fee_amount: 72.00,
          net_amount: 2328.00,
          reference_id: "payout_abc123",
          booking_count: 8,
          total_earnings: 12580.50,
          created_at: "2025-10-05T09:00:00Z",
          processed_at: "2025-10-05T09:15:00Z",
          tax_withheld: 240.00
        },
        {
          id: "2",
          creator_id: "creator_2",
          creator_name: "Michael Chen",
          creator_email: "michael@example.com",
          amount: 1875.00,
          currency: "USD",
          status: "processing",
          payout_method: "paypal",
          fee_amount: 56.25,
          net_amount: 1818.75,
          booking_count: 6,
          total_earnings: 8420.25,
          created_at: "2025-10-05T10:30:00Z",
          scheduled_date: "2025-10-07T00:00:00Z"
        },
        {
          id: "3",
          creator_id: "creator_3",
          creator_name: "Emma Rodriguez",
          creator_email: "emma@example.com",
          amount: 3200.00,
          currency: "USD",
          status: "pending",
          payout_method: "stripe",
          fee_amount: 96.00,
          net_amount: 3104.00,
          booking_count: 12,
          total_earnings: 18750.00,
          created_at: "2025-10-04T15:20:00Z",
          scheduled_date: "2025-10-08T00:00:00Z"
        },
        {
          id: "4",
          creator_id: "creator_4",
          creator_name: "David Park",
          creator_email: "david@example.com",
          amount: 1200.00,
          currency: "USD",
          status: "failed",
          payout_method: "bank_transfer",
          fee_amount: 36.00,
          net_amount: 1164.00,
          booking_count: 4,
          total_earnings: 5620.75,
          created_at: "2025-10-04T12:45:00Z",
          failure_reason: "Invalid bank account information"
        }
      ];

      const mockSchedules: PayoutSchedule[] = [
        {
          id: "1",
          creator_id: "creator_1",
          frequency: "weekly",
          minimum_amount: 100,
          method: "bank_transfer",
          next_payout: "2025-10-12T00:00:00Z",
          active: true
        },
        {
          id: "2",
          creator_id: "creator_2",
          frequency: "monthly",
          minimum_amount: 500,
          method: "paypal",
          next_payout: "2025-11-01T00:00:00Z",
          active: true
        }
      ];

      setPayouts(mockPayouts);
      setSchedules(mockSchedules);
    } catch (error) {
      console.error('Error fetching payouts:', error);
      toast.error('Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'processing':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'failed':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      case 'cancelled':
        return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
      default:
        return 'text-white/60 bg-white/10 border-white/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-white/60" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Bank className="w-4 h-4" />;
      case 'paypal':
        return <Smartphone className="w-4 h-4" />;
      case 'stripe':
        return <CreditCard className="w-4 h-4" />;
      case 'crypto':
        return <Bitcoin className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.creator_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.creator_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.reference_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payout.payout_method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = {
    total_amount: payouts.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0),
    total_count: payouts.length,
    pending: payouts.filter(p => p.status === 'pending').length,
    processing: payouts.filter(p => p.status === 'processing').length,
    completed: payouts.filter(p => p.status === 'completed').length,
    failed: payouts.filter(p => p.status === 'failed').length,
    pending_amount: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    active_creators: new Set(payouts.map(p => p.creator_id)).size
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
            Creator Payouts
          </h1>
          <p className="text-white/60 mt-2">Manage creator earnings and payout schedules</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Send className="w-4 h-4" />
            Process Payouts
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Schedule Payout
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">${stats.total_amount.toLocaleString()}</div>
              <div className="text-sm text-white/60">Total Paid</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold">${stats.pending_amount.toLocaleString()}</div>
              <div className="text-sm text-white/60">Pending</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-2xl font-bold">{stats.active_creators}</div>
              <div className="text-sm text-white/60">Creators</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm text-white/60">Pending</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.processing}</div>
              <div className="text-sm text-white/60">Processing</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-sm text-white/60">Completed</div>
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
            placeholder="Search creators..."
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
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="frosted-input min-w-[150px]"
        >
          <option value="all">All Methods</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="paypal">PayPal</option>
          <option value="stripe">Stripe</option>
          <option value="crypto">Crypto</option>
        </select>
      </div>

      {/* Payouts Table */}
      <GlassCard>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5" />
          Creator Payouts ({filteredPayouts.length})
        </h2>
        {filteredPayouts.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-white/30" />
            <p className="text-white/60">No payouts found matching your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 font-medium text-white/60">Creator</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Amount</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Earnings</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Method</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Date</th>
                  <th className="text-right py-3 px-2 font-medium text-white/60">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{payout.creator_name}</div>
                          <div className="text-sm text-white/60">{payout.creator_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="font-semibold text-lg">${payout.amount.toLocaleString()}</div>
                      <div className="text-sm text-white/60">
                        Fee: ${payout.fee_amount} • Net: ${payout.net_amount}
                        {payout.tax_withheld && (
                          <><br />Tax: ${payout.tax_withheld}</>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-sm">
                        <div className="text-green-400 font-medium">${payout.total_earnings.toLocaleString()}</div>
                        <div className="text-white/60">{payout.booking_count} bookings</div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payout.payout_method)}
                        <span className="capitalize">{payout.payout_method.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payout.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payout.status)}`}>
                          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                        </span>
                      </div>
                      {payout.failure_reason && (
                        <div className="text-xs text-red-400 mt-1">{payout.failure_reason}</div>
                      )}
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-sm">
                        <div>{new Date(payout.created_at).toLocaleDateString()}</div>
                        <div className="text-white/60">
                          {payout.processed_at
                            ? `Processed ${new Date(payout.processed_at).toLocaleDateString()}`
                            : payout.scheduled_date
                              ? `Scheduled ${new Date(payout.scheduled_date).toLocaleDateString()}`
                              : 'Pending'
                          }
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          title="Download Statement"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {payout.status === 'pending' && (
                          <button
                            className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400"
                            title="Process Now"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Payout Schedules */}
      <GlassCard>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Payout Schedules ({schedules.length})
        </h2>
        {schedules.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 mx-auto mb-4 text-white/30" />
            <p className="text-white/60">No automatic payout schedules configured</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getMethodIcon(schedule.method)}
                    <div>
                      <div className="font-medium">
                        {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} Payout
                      </div>
                      <div className="text-sm text-white/60">
                        Min ${schedule.minimum_amount} • via {schedule.method.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      Next: {new Date(schedule.next_payout).toLocaleDateString()}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${schedule.active ? 'text-green-400 bg-green-400/20' : 'text-gray-400 bg-gray-400/20'}`}>
                      {schedule.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
