"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Download,
  Search,
  Send,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  Plus
} from "lucide-react";

type Payment = {
  id: string;
  user_id: string;
  user_name: string;
  amount: number;
  currency: string;
  type: 'payout' | 'refund' | 'fee' | 'commission';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  method: 'bank_transfer' | 'paypal' | 'stripe' | 'crypto';
  reference_id?: string;
  booking_id?: string;
  created_at: string;
  processed_at?: string;
  description?: string;
  fee_amount?: number;
  net_amount?: number;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockPayments: Payment[] = [
        {
          id: "1",
          user_id: "user_1",
          user_name: "Sarah Johnson",
          amount: 1875.00,
          currency: "USD",
          type: "payout",
          status: "completed",
          method: "bank_transfer",
          reference_id: "payout_abc123",
          booking_id: "booking_456",
          created_at: "2025-10-05T09:00:00Z",
          processed_at: "2025-10-05T09:15:00Z",
          description: "Creator payout for photoshoot session",
          fee_amount: 56.25,
          net_amount: 1818.75
        },
        {
          id: "2",
          user_id: "user_2",
          user_name: "Michael Chen",
          amount: 500.00,
          currency: "USD",
          type: "refund",
          status: "pending",
          method: "stripe",
          reference_id: "ref_xyz789",
          booking_id: "booking_789",
          created_at: "2025-10-05T10:30:00Z",
          description: "Booking cancellation refund"
        },
        {
          id: "3",
          user_id: "user_3",
          user_name: "Emma Rodriguez",
          amount: 750.00,
          currency: "USD",
          type: "commission",
          status: "processing",
          method: "paypal",
          reference_id: "comm_def456",
          created_at: "2025-10-04T15:20:00Z",
          description: "Platform commission payment",
          fee_amount: 22.50,
          net_amount: 727.50
        },
        {
          id: "4",
          user_id: "user_4",
          user_name: "David Park",
          amount: 125.00,
          currency: "USD",
          type: "fee",
          status: "failed",
          method: "bank_transfer",
          created_at: "2025-10-04T12:45:00Z",
          description: "Service fee payment - insufficient funds"
        }
      ];

      setPayments(mockPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payout':
        return 'text-green-400 bg-green-400/20';
      case 'refund':
        return 'text-blue-400 bg-blue-400/20';
      case 'commission':
        return 'text-purple-400 bg-purple-400/20';
      case 'fee':
        return 'text-yellow-400 bg-yellow-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payout':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'refund':
        return <ArrowDownLeft className="w-4 h-4" />;
      case 'commission':
        return <DollarSign className="w-4 h-4" />;
      case 'fee':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
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

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total_amount: payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0),
    total_count: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    processing: payments.filter(p => p.status === 'processing').length,
    completed: payments.filter(p => p.status === 'completed').length,
    failed: payments.filter(p => p.status === 'failed').length,
    payouts: payments.filter(p => p.type === 'payout' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    refunds: payments.filter(p => p.type === 'refund' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
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
            Payments & Payouts
          </h1>
          <p className="text-white/60 mt-2">Manage outgoing payments, refunds, and payouts</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Payment
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
            <ArrowUpRight className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">${stats.payouts.toLocaleString()}</div>
              <div className="text-sm text-white/60">Payouts</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ArrowDownLeft className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">${stats.refunds.toLocaleString()}</div>
              <div className="text-sm text-white/60">Refunds</div>
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
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.processing}</div>
              <div className="text-sm text-white/60">Processing</div>
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
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search payments..."
            className="frosted-input w-full pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="frosted-input min-w-[150px]"
        >
          <option value="all">All Types</option>
          <option value="payout">Payouts</option>
          <option value="refund">Refunds</option>
          <option value="commission">Commission</option>
          <option value="fee">Fees</option>
        </select>
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
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Payments Table */}
      <GlassCard>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Send className="w-5 h-5" />
          Recent Payments ({filteredPayments.length})
        </h2>
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-white/30" />
            <p className="text-white/60">No payments found matching your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 font-medium text-white/60">Recipient</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Amount</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Type</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Method</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Date</th>
                  <th className="text-right py-3 px-2 font-medium text-white/60">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{payment.user_name}</div>
                          <div className="text-sm text-white/60">{payment.user_id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="font-semibold text-lg">${payment.amount.toLocaleString()}</div>
                      {payment.fee_amount && (
                        <div className="text-sm text-white/60">
                          Fee: ${payment.fee_amount} • Net: ${payment.net_amount}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-2">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(payment.type)}`}>
                        {getTypeIcon(payment.type)}
                        <span className="capitalize">{payment.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-sm">
                        <div>{new Date(payment.created_at).toLocaleDateString()}</div>
                        <div className="text-white/60">{new Date(payment.created_at).toLocaleTimeString()}</div>
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
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
