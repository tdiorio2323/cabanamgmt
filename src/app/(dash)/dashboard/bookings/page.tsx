import { supabaseServer } from "@/lib/supabaseServer";
import GlassCard from "@/components/ui/GlassCard";
import { Calendar, Filter, Plus, Search, Eye, Edit, Trash2, Users, CheckCircle, Clock, X } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const supabase = await supabaseServer();
  const { data: rows, error } = await supabase
    .from("bookings")
    .select("id, user_id, slot, deposit_status, interview_status, nda_signed, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  // Calculate stats
  const totalBookings = rows?.length || 0;
  const confirmedCount = rows?.filter(b => b.deposit_status === 'confirmed').length || 0;
  const pendingCount = rows?.filter(b => b.deposit_status === 'pending').length || 0;
  const completedCount = rows?.filter(b => b.nda_signed === true).length || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'cancelled': return <X className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Bookings Management
          </h1>
          <p className="text-white/60 mt-2">Manage all property bookings and reservations</p>
        </div>
        <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Booking
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
          Error loading bookings: {error.message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <div className="text-sm text-white/60">Total Bookings</div>
            </div>
            <Users className="w-8 h-8 text-white/40" />
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-400">{confirmedCount}</div>
              <div className="text-sm text-white/60">Confirmed</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400/40" />
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
              <div className="text-sm text-white/60">Pending</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-400/40" />
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-400">{completedCount}</div>
              <div className="text-sm text-white/60">Completed</div>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-400/40" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            <input
              type="text"
              placeholder="Search bookings by user ID..."
              className="frosted-input pl-10 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/60" />
            <select className="frosted-input w-auto min-w-[120px]">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Bookings Table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-medium text-white/80">Created</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">User ID</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Slot</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Deposit</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Interview</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">NDA</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Booking ID</th>
                <th className="text-right py-3 px-4 font-medium text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(rows ?? []).map((booking) => (
                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-sm text-white/80">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-sm">{booking.user_id?.slice(0, 8)}...</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white/60" />
                      <span className="text-sm">
                        {booking.slot ? new Date(booking.slot).toLocaleDateString() : 'Not scheduled'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.deposit_status)}`}>
                      {getStatusIcon(booking.deposit_status)}
                      {booking.deposit_status || 'pending'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.interview_status)}`}>
                      {getStatusIcon(booking.interview_status)}
                      {booking.interview_status || 'pending'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${booking.nda_signed ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-400/10'}`}>
                      {booking.nda_signed ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {booking.nda_signed ? 'Signed' : 'Pending'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-xs text-white/60">{booking.id}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-white/10 rounded transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded transition-colors" title="Edit Booking">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 rounded transition-colors text-red-400" title="Cancel Booking">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows?.length && (
            <div className="text-center py-8 text-white/60">
              No bookings found
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
