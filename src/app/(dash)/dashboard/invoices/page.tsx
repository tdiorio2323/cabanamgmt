"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  FileText,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  Search,
  Send,
  Edit,
  Plus,
  Building,
  Phone,
  Mail,
  MapPin,
  Receipt
} from "lucide-react";

type Invoice = {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  issue_date: string;
  paid_date?: string;
  description: string;
  items: InvoiceItem[];
  tax_rate: number;
  tax_amount: number;
  subtotal: number;
  total: number;
  notes?: string;
  created_at: string;
};

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
};

type ClientInfo = {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  total_invoiced: number;
  paid_amount: number;
  outstanding_amount: number;
  invoice_count: number;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<'invoices' | 'clients'>('invoices');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockInvoices: Invoice[] = [
        {
          id: "1",
          invoice_number: "INV-2025-001",
          client_id: "client_1",
          client_name: "Luxury Events Co.",
          client_email: "billing@luxuryevents.com",
          client_company: "Luxury Events Co.",
          amount: 5000.00,
          currency: "USD",
          status: "paid",
          due_date: "2025-10-15T00:00:00Z",
          issue_date: "2025-09-15T00:00:00Z",
          paid_date: "2025-10-10T00:00:00Z",
          description: "Luxury villa rental for corporate retreat",
          items: [
            {
              id: "item_1",
              description: "Villa rental (3 nights)",
              quantity: 3,
              unit_price: 1500.00,
              total: 4500.00
            },
            {
              id: "item_2",
              description: "Concierge services",
              quantity: 1,
              unit_price: 500.00,
              total: 500.00
            }
          ],
          tax_rate: 0.08,
          tax_amount: 400.00,
          subtotal: 5000.00,
          total: 5400.00,
          notes: "Payment terms: Net 30",
          created_at: "2025-09-15T00:00:00Z"
        },
        {
          id: "2",
          invoice_number: "INV-2025-002",
          client_id: "client_2",
          client_name: "Premium Productions",
          client_email: "accounts@premiumprod.com",
          client_company: "Premium Productions LLC",
          amount: 3750.00,
          currency: "USD",
          status: "overdue",
          due_date: "2025-09-30T00:00:00Z",
          issue_date: "2025-08-30T00:00:00Z",
          description: "Photo shoot location rental",
          items: [
            {
              id: "item_3",
              description: "Studio rental (2 days)",
              quantity: 2,
              unit_price: 1500.00,
              total: 3000.00
            },
            {
              id: "item_4",
              description: "Equipment rental",
              quantity: 1,
              unit_price: 750.00,
              total: 750.00
            }
          ],
          tax_rate: 0.08,
          tax_amount: 300.00,
          subtotal: 3750.00,
          total: 4050.00,
          created_at: "2025-08-30T00:00:00Z"
        },
        {
          id: "3",
          invoice_number: "INV-2025-003",
          client_id: "client_3",
          client_name: "Elite Magazine",
          client_email: "finance@elitemag.com",
          amount: 2500.00,
          currency: "USD",
          status: "sent",
          due_date: "2025-11-01T00:00:00Z",
          issue_date: "2025-10-01T00:00:00Z",
          description: "Editorial shoot venue",
          items: [
            {
              id: "item_5",
              description: "Location fee",
              quantity: 1,
              unit_price: 2500.00,
              total: 2500.00
            }
          ],
          tax_rate: 0.08,
          tax_amount: 200.00,
          subtotal: 2500.00,
          total: 2700.00,
          created_at: "2025-10-01T00:00:00Z"
        }
      ];

      const mockClients: ClientInfo[] = [
        {
          id: "client_1",
          name: "Luxury Events Co.",
          email: "billing@luxuryevents.com",
          company: "Luxury Events Co.",
          phone: "+1 (555) 123-4567",
          address: "123 Business District, NYC",
          total_invoiced: 15750.00,
          paid_amount: 12250.00,
          outstanding_amount: 3500.00,
          invoice_count: 8
        },
        {
          id: "client_2",
          name: "Premium Productions",
          email: "accounts@premiumprod.com",
          company: "Premium Productions LLC",
          phone: "+1 (555) 987-6543",
          address: "456 Creative Ave, LA",
          total_invoiced: 8920.00,
          paid_amount: 4870.00,
          outstanding_amount: 4050.00,
          invoice_count: 5
        },
        {
          id: "client_3",
          name: "Elite Magazine",
          email: "finance@elitemag.com",
          phone: "+1 (555) 456-7890",
          total_invoiced: 6200.00,
          paid_amount: 3500.00,
          outstanding_amount: 2700.00,
          invoice_count: 3
        }
      ];

      setInvoices(mockInvoices);
      setClients(mockClients);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'sent':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
      case 'viewed':
        return 'text-purple-400 bg-purple-400/20 border-purple-400/50';
      case 'overdue':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      case 'draft':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'cancelled':
        return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
      default:
        return 'text-white/60 bg-white/10 border-white/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'sent':
        return <Send className="w-4 h-4 text-blue-400" />;
      case 'viewed':
        return <Eye className="w-4 h-4 text-purple-400" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'draft':
        return <Edit className="w-4 h-4 text-yellow-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <FileText className="w-4 h-4 text-white/60" />;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredClients = clients.filter(client => {
    return client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const stats = {
    total_invoiced: invoices.reduce((sum, inv) => sum + inv.total, 0),
    total_paid: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
    total_outstanding: invoices.filter(inv => ['sent', 'viewed', 'overdue'].includes(inv.status)).reduce((sum, inv) => sum + inv.total, 0),
    overdue_count: invoices.filter(inv => inv.status === 'overdue').length,
    overdue_amount: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0),
    draft_count: invoices.filter(inv => inv.status === 'draft').length
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
            Invoices & Billing
          </h1>
          <p className="text-white/60 mt-2">Manage client invoices and billing records</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">${stats.total_invoiced.toLocaleString()}</div>
              <div className="text-sm text-white/60">Total Invoiced</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">${stats.total_paid.toLocaleString()}</div>
              <div className="text-sm text-white/60">Paid</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold">${stats.total_outstanding.toLocaleString()}</div>
              <div className="text-sm text-white/60">Outstanding</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-2xl font-bold">${stats.overdue_amount.toLocaleString()}</div>
              <div className="text-sm text-white/60">{stats.overdue_count} Overdue</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Edit className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold">{stats.draft_count}</div>
              <div className="text-sm text-white/60">Drafts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'invoices'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'clients'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
        >
          <Building className="w-4 h-4 inline mr-2" />
          Clients ({clients.length})
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
            placeholder={activeTab === 'invoices' ? "Search invoices..." : "Search clients..."}
            className="frosted-input w-full pl-10"
          />
        </div>
        {activeTab === 'invoices' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="frosted-input min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="viewed">Viewed</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'invoices' ? (
        <GlassCard>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Invoices ({filteredInvoices.length})
          </h2>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-white/30" />
              <p className="text-white/60">No invoices found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-2 font-medium text-white/60">Invoice #</th>
                    <th className="text-left py-3 px-2 font-medium text-white/60">Client</th>
                    <th className="text-left py-3 px-2 font-medium text-white/60">Amount</th>
                    <th className="text-left py-3 px-2 font-medium text-white/60">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-white/60">Due Date</th>
                    <th className="text-right py-3 px-2 font-medium text-white/60">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2">
                        <div className="font-medium">{invoice.invoice_number}</div>
                        <div className="text-sm text-white/60">
                          {new Date(invoice.issue_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Building className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{invoice.client_name}</div>
                            <div className="text-sm text-white/60">{invoice.client_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="font-semibold text-lg">${invoice.total.toLocaleString()}</div>
                        <div className="text-sm text-white/60">
                          Subtotal: ${invoice.subtotal.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </div>
                        {invoice.status === 'overdue' && (
                          <div className="text-xs text-red-400">
                            {Math.ceil((new Date().getTime() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400"
                            title="View Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {invoice.status === 'draft' && (
                            <button
                              className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400"
                              title="Send Invoice"
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
      ) : (
        <GlassCard>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Clients ({filteredClients.length})
          </h2>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 mx-auto mb-4 text-white/30" />
              <p className="text-white/60">No clients found matching your search</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredClients.map((client) => (
                <div key={client.id} className="border border-white/10 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{client.name}</h3>
                        {client.company && (
                          <p className="text-white/60">{client.company}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                          {client.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {client.email}
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {client.phone}
                            </div>
                          )}
                        </div>
                        {client.address && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-white/60">
                            <MapPin className="w-4 h-4" />
                            {client.address}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-green-400 font-semibold">
                            ${client.paid_amount.toLocaleString()}
                          </div>
                          <div className="text-white/60">Paid</div>
                        </div>
                        <div>
                          <div className="text-yellow-400 font-semibold">
                            ${client.outstanding_amount.toLocaleString()}
                          </div>
                          <div className="text-white/60">Outstanding</div>
                        </div>
                        <div>
                          <div className="text-blue-400 font-semibold">
                            {client.invoice_count}
                          </div>
                          <div className="text-white/60">Invoices</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-lg font-bold">
                          ${client.total_invoiced.toLocaleString()}
                        </div>
                        <div className="text-white/60">Total Invoiced</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
