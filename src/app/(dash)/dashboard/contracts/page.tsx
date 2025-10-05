"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  Search,
  Plus,
  Edit,
  Send,
  Signature,
  Building,
  DollarSign,
  Upload,
  Copy,
  Archive,
  Star,
  Users,
  FileSignature,
  BookOpen,
  Award,
  Target
} from "lucide-react";

type Contract = {
  id: string;
  template_id: string;
  contract_number: string;
  title: string;
  type: 'rental' | 'service' | 'partnership' | 'nda' | 'employment';
  status: 'draft' | 'pending_signature' | 'signed' | 'executed' | 'expired' | 'terminated';
  client_id: string;
  client_name: string;
  client_email: string;
  value: number;
  currency: string;
  start_date: string;
  end_date: string;
  signature_date?: string;
  created_at: string;
  created_by: string;
  template_name: string;
  terms_count: number;
  signatures_required: number;
  signatures_completed: number;
  renewal_date?: string;
  auto_renew: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
};

type ContractTemplate = {
  id: string;
  name: string;
  type: 'rental' | 'service' | 'partnership' | 'nda' | 'employment';
  description: string;
  version: string;
  status: 'active' | 'draft' | 'archived';
  usage_count: number;
  created_at: string;
  created_by: string;
  last_updated: string;
  tags: string[];
  is_default: boolean;
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<'contracts' | 'templates'>('contracts');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockContracts: Contract[] = [
        {
          id: "1",
          template_id: "template_1",
          contract_number: "CTR-2025-001",
          title: "Luxury Villa Rental Agreement",
          type: "rental",
          status: "signed",
          client_id: "client_1",
          client_name: "Luxury Events Co.",
          client_email: "legal@luxuryevents.com",
          value: 15000.00,
          currency: "USD",
          start_date: "2025-11-01T00:00:00Z",
          end_date: "2025-11-07T00:00:00Z",
          signature_date: "2025-10-15T00:00:00Z",
          created_at: "2025-10-01T00:00:00Z",
          created_by: "admin",
          template_name: "Standard Rental Agreement",
          terms_count: 12,
          signatures_required: 2,
          signatures_completed: 2,
          renewal_date: "2025-10-15T00:00:00Z",
          auto_renew: false,
          priority: "high"
        },
        {
          id: "2",
          template_id: "template_2",
          contract_number: "CTR-2025-002",
          title: "Photography Services Agreement",
          type: "service",
          status: "pending_signature",
          client_id: "client_2",
          client_name: "Premium Productions",
          client_email: "contracts@premiumprod.com",
          value: 5000.00,
          currency: "USD",
          start_date: "2025-10-20T00:00:00Z",
          end_date: "2025-10-22T00:00:00Z",
          created_at: "2025-10-05T00:00:00Z",
          created_by: "admin",
          template_name: "Service Provider Agreement",
          terms_count: 8,
          signatures_required: 2,
          signatures_completed: 1,
          auto_renew: false,
          priority: "medium"
        },
        {
          id: "3",
          template_id: "template_3",
          contract_number: "CTR-2025-003",
          title: "Partnership Agreement - Elite Magazine",
          type: "partnership",
          status: "draft",
          client_id: "client_3",
          client_name: "Elite Magazine",
          client_email: "partnerships@elitemag.com",
          value: 25000.00,
          currency: "USD",
          start_date: "2025-12-01T00:00:00Z",
          end_date: "2026-11-30T00:00:00Z",
          created_at: "2025-10-03T00:00:00Z",
          created_by: "admin",
          template_name: "Strategic Partnership Agreement",
          terms_count: 15,
          signatures_required: 3,
          signatures_completed: 0,
          renewal_date: "2026-10-01T00:00:00Z",
          auto_renew: true,
          priority: "urgent"
        }
      ];

      const mockTemplates: ContractTemplate[] = [
        {
          id: "template_1",
          name: "Standard Rental Agreement",
          type: "rental",
          description: "Comprehensive rental agreement for luxury properties",
          version: "v2.1",
          status: "active",
          usage_count: 24,
          created_at: "2025-01-15T00:00:00Z",
          created_by: "Legal Team",
          last_updated: "2025-09-01T00:00:00Z",
          tags: ["luxury", "rental", "standard"],
          is_default: true
        },
        {
          id: "template_2",
          name: "Service Provider Agreement",
          type: "service",
          description: "Agreement for creative and professional services",
          version: "v1.8",
          status: "active",
          usage_count: 18,
          created_at: "2025-02-10T00:00:00Z",
          created_by: "Legal Team",
          last_updated: "2025-08-15T00:00:00Z",
          tags: ["service", "creative", "professional"],
          is_default: false
        },
        {
          id: "template_3",
          name: "Strategic Partnership Agreement",
          type: "partnership",
          description: "Long-term strategic partnership template",
          version: "v1.0",
          status: "active",
          usage_count: 3,
          created_at: "2025-09-01T00:00:00Z",
          created_by: "Legal Team",
          last_updated: "2025-09-20T00:00:00Z",
          tags: ["partnership", "strategic", "long-term"],
          is_default: false
        },
        {
          id: "template_4",
          name: "Non-Disclosure Agreement",
          type: "nda",
          description: "Standard NDA for confidential information",
          version: "v3.2",
          status: "active",
          usage_count: 47,
          created_at: "2024-12-01T00:00:00Z",
          created_by: "Legal Team",
          last_updated: "2025-07-10T00:00:00Z",
          tags: ["nda", "confidential", "standard"],
          is_default: true
        }
      ];

      setContracts(mockContracts);
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
      case 'executed':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'pending_signature':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'draft':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
      case 'expired':
      case 'terminated':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      default:
        return 'text-white/60 bg-white/10 border-white/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
      case 'executed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending_signature':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'draft':
        return <Edit className="w-4 h-4 text-blue-400" />;
      case 'expired':
      case 'terminated':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <FileText className="w-4 h-4 text-white/60" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rental':
        return 'text-blue-400 bg-blue-400/20';
      case 'service':
        return 'text-green-400 bg-green-400/20';
      case 'partnership':
        return 'text-purple-400 bg-purple-400/20';
      case 'nda':
        return 'text-orange-400 bg-orange-400/20';
      case 'employment':
        return 'text-pink-400 bg-pink-400/20';
      default:
        return 'text-white/60 bg-white/10';
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

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total_contracts: contracts.length,
    signed: contracts.filter(c => c.status === 'signed' || c.status === 'executed').length,
    pending: contracts.filter(c => c.status === 'pending_signature').length,
    draft: contracts.filter(c => c.status === 'draft').length,
    total_value: contracts.filter(c => c.status === 'signed' || c.status === 'executed').reduce((sum, c) => sum + c.value, 0),
    active_templates: templates.filter(t => t.status === 'active').length,
    expiring_soon: contracts.filter(c => {
      const endDate = new Date(c.end_date);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length
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
            Contracts & Documents
          </h1>
          <p className="text-white/60 mt-2">Manage contracts, templates, and digital signatures</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Contract
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_contracts}</div>
              <div className="text-sm text-white/60">Total</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.signed}</div>
              <div className="text-sm text-white/60">Signed</div>
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
            <Edit className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.draft}</div>
              <div className="text-sm text-white/60">Draft</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">${stats.total_value.toLocaleString()}</div>
              <div className="text-sm text-white/60">Value</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-2xl font-bold">{stats.active_templates}</div>
              <div className="text-sm text-white/60">Templates</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-2xl font-bold">{stats.expiring_soon}</div>
              <div className="text-sm text-white/60">Expiring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('contracts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'contracts'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
        >
          <FileSignature className="w-4 h-4 inline mr-2" />
          Contracts ({contracts.length})
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'templates'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Templates ({templates.length})
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
            placeholder={activeTab === 'contracts' ? "Search contracts..." : "Search templates..."}
            className="frosted-input w-full pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="frosted-input min-w-[150px]"
        >
          <option value="all">All Types</option>
          <option value="rental">Rental</option>
          <option value="service">Service</option>
          <option value="partnership">Partnership</option>
          <option value="nda">NDA</option>
          <option value="employment">Employment</option>
        </select>
        {activeTab === 'contracts' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="frosted-input min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending_signature">Pending Signature</option>
            <option value="signed">Signed</option>
            <option value="executed">Executed</option>
            <option value="expired">Expired</option>
            <option value="terminated">Terminated</option>
          </select>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'contracts' ? (
        <GlassCard>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileSignature className="w-5 h-5" />
            Contracts ({filteredContracts.length})
          </h2>
          {filteredContracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-white/30" />
              <p className="text-white/60">No contracts found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-2 font-medium text-white/60">Contract</th>
                    <th className="text-left py-3 px-2 font-medium text-white/60">Client</th>
                    <th className="text-left py-3 px-2 font-medium text-white/60">Type</th>
                    <th className="text-left py-3 px-2 font-medium text-white/60">Value</th>
                    <th className="text-left py-3 px-2 font-medium text-white/60">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-white/60">Signatures</th>
                    <th className="text-left py-3 px-2 font-medium text-white/60">Dates</th>
                    <th className="text-right py-3 px-2 font-medium text-white/60">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2">
                        <div>
                          <div className="font-medium">{contract.contract_number}</div>
                          <div className="text-sm text-white/60 max-w-[200px] truncate">{contract.title}</div>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPriorityColor(contract.priority)}`}>
                            <Target className="w-3 h-3" />
                            {contract.priority}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Building className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{contract.client_name}</div>
                            <div className="text-sm text-white/60">{contract.client_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(contract.type)}`}>
                          <span className="capitalize">{contract.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="font-semibold">${contract.value.toLocaleString()}</div>
                        <div className="text-sm text-white/60">{contract.currency}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(contract.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                            {contract.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <Signature className="w-4 h-4 text-blue-400" />
                          <span className={`text-sm ${contract.signatures_completed === contract.signatures_required ? 'text-green-400' : 'text-yellow-400'}`}>
                            {contract.signatures_completed}/{contract.signatures_required}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm">
                          <div>Start: {new Date(contract.start_date).toLocaleDateString()}</div>
                          <div>End: {new Date(contract.end_date).toLocaleDateString()}</div>
                          {contract.signature_date && (
                            <div className="text-green-400">Signed: {new Date(contract.signature_date).toLocaleDateString()}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400"
                            title="View Contract"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {contract.status === 'draft' && (
                            <button
                              className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400"
                              title="Send for Signature"
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
            <BookOpen className="w-5 h-5" />
            Contract Templates ({filteredTemplates.length})
          </h2>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-white/30" />
              <p className="text-white/60">No templates found matching your criteria</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="border border-white/10 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{template.name}</h3>
                          {template.is_default && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-yellow-400 bg-yellow-400/20">
                              <Star className="w-3 h-3" />
                              Default
                            </div>
                          )}
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                            {template.type.toUpperCase()}
                          </div>
                        </div>
                        <p className="text-white/60 mt-1">{template.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {template.usage_count} uses
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {template.version}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Updated {new Date(template.last_updated).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {template.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/60">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400"
                        title="Use Template"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        title="Edit Template"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 transition-colors text-gray-400"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
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
