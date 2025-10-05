"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  FileText,
  FolderOpen,
  Upload,
  Download,
  Eye,
  Search,
  Plus,
  Share,
  Lock,
  FileImage,
  FileVideo,
  File,
  Shield,
  CheckCircle,
  HardDrive,
  TrendingUp,
  Grid,
  List
} from "lucide-react";

type Document = {
  id: string;
  name: string;
  type: 'contract' | 'agreement' | 'invoice' | 'receipt' | 'image' | 'video' | 'pdf' | 'other';
  file_type: string;
  size: number;
  url: string;
  folder_id?: string;
  folder_name?: string;
  status: 'active' | 'archived' | 'deleted';
  access_level: 'public' | 'internal' | 'confidential' | 'restricted';
  created_at: string;
  created_by: string;
  created_by_name: string;
  updated_at: string;
  last_accessed?: string;
  access_count: number;
  tags: string[];
  version: number;
  is_latest: boolean;
  encryption_status: 'encrypted' | 'not_encrypted';
  sharing_enabled: boolean;
  expiry_date?: string;
  related_contract_id?: string;
  related_booking_id?: string;
};

type Folder = {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  document_count: number;
  created_at: string;
  created_by: string;
  access_level: 'public' | 'internal' | 'confidential' | 'restricted';
  size_total: number;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [accessFilter, setAccessFilter] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [_selectedDocuments, _setSelectedDocuments] = useState<string[]>([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockDocuments: Document[] = [
        {
          id: "doc_1",
          name: "Luxury Villa Rental Agreement - Signed.pdf",
          type: "contract",
          file_type: "pdf",
          size: 2457600, // 2.4MB
          url: "/documents/contracts/luxury-villa-agreement.pdf",
          folder_id: "folder_1",
          folder_name: "Contracts",
          status: "active",
          access_level: "confidential",
          created_at: "2025-10-01T00:00:00Z",
          created_by: "admin_1",
          created_by_name: "Admin User",
          updated_at: "2025-10-05T14:30:00Z",
          last_accessed: "2025-10-09T10:15:00Z",
          access_count: 8,
          tags: ["signed", "rental", "luxury", "active"],
          version: 3,
          is_latest: true,
          encryption_status: "encrypted",
          sharing_enabled: false,
          related_contract_id: "contract_1",
          related_booking_id: "booking_1"
        },
        {
          id: "doc_2",
          name: "Photography Services Agreement - Draft.pdf",
          type: "agreement",
          file_type: "pdf",
          size: 1843200, // 1.8MB
          url: "/documents/agreements/photography-services.pdf",
          folder_id: "folder_2",
          folder_name: "Service Agreements",
          status: "active",
          access_level: "internal",
          created_at: "2025-10-05T00:00:00Z",
          created_by: "admin_1",
          created_by_name: "Admin User",
          updated_at: "2025-10-08T09:20:00Z",
          last_accessed: "2025-10-08T16:45:00Z",
          access_count: 3,
          tags: ["draft", "photography", "services"],
          version: 1,
          is_latest: true,
          encryption_status: "encrypted",
          sharing_enabled: true,
          expiry_date: "2025-12-31T00:00:00Z",
          related_contract_id: "contract_2"
        },
        {
          id: "doc_3",
          name: "Property Photos - Villa Sunset.zip",
          type: "image",
          file_type: "zip",
          size: 15728640, // 15MB
          url: "/documents/media/villa-sunset-photos.zip",
          folder_id: "folder_3",
          folder_name: "Property Media",
          status: "active",
          access_level: "public",
          created_at: "2025-09-15T00:00:00Z",
          created_by: "creator_1",
          created_by_name: "Sarah Johnson",
          updated_at: "2025-09-20T11:30:00Z",
          last_accessed: "2025-10-08T14:20:00Z",
          access_count: 24,
          tags: ["photos", "villa", "sunset", "portfolio"],
          version: 2,
          is_latest: true,
          encryption_status: "not_encrypted",
          sharing_enabled: true,
          related_booking_id: "booking_2"
        },
        {
          id: "doc_4",
          name: "NDA - Elite Magazine Partnership.pdf",
          type: "agreement",
          file_type: "pdf",
          size: 892160, // 871KB
          url: "/documents/legal/nda-elite-magazine.pdf",
          folder_id: "folder_4",
          folder_name: "Legal Documents",
          status: "active",
          access_level: "restricted",
          created_at: "2025-10-08T00:00:00Z",
          created_by: "legal_1",
          created_by_name: "Legal Team",
          updated_at: "2025-10-08T00:00:00Z",
          access_count: 1,
          tags: ["nda", "partnership", "elite-magazine", "confidential"],
          version: 1,
          is_latest: true,
          encryption_status: "encrypted",
          sharing_enabled: false,
          expiry_date: "2026-10-08T00:00:00Z"
        }
      ];

      const mockFolders: Folder[] = [
        {
          id: "folder_1",
          name: "Contracts",
          description: "Signed rental and service contracts",
          document_count: 12,
          created_at: "2025-01-01T00:00:00Z",
          created_by: "admin_1",
          access_level: "confidential",
          size_total: 28672000 // ~28MB
        },
        {
          id: "folder_2",
          name: "Service Agreements",
          description: "Service provider and vendor agreements",
          document_count: 8,
          created_at: "2025-02-15T00:00:00Z",
          created_by: "admin_1",
          access_level: "internal",
          size_total: 15360000 // ~15MB
        },
        {
          id: "folder_3",
          name: "Property Media",
          description: "Photos, videos, and marketing materials",
          document_count: 156,
          created_at: "2024-12-01T00:00:00Z",
          created_by: "creator_1",
          access_level: "public",
          size_total: 524288000 // ~500MB
        },
        {
          id: "folder_4",
          name: "Legal Documents",
          description: "NDAs, compliance docs, and legal filings",
          document_count: 24,
          created_at: "2024-11-01T00:00:00Z",
          created_by: "legal_1",
          access_level: "restricted",
          size_total: 12582912 // ~12MB
        }
      ];

      setDocuments(mockDocuments);
      setFolders(mockFolders);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileTypeIcon = (type: string, _file_type: string) => {
    switch (type) {
      case 'image':
        return <FileImage className="w-5 h-5 text-green-400" />;
      case 'video':
        return <FileVideo className="w-5 h-5 text-red-400" />;
      case 'contract':
      case 'agreement':
        return <FileText className="w-5 h-5 text-blue-400" />;
      default:
        return <File className="w-5 h-5 text-white/60" />;
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public':
        return 'text-green-400 bg-green-400/20';
      case 'internal':
        return 'text-blue-400 bg-blue-400/20';
      case 'confidential':
        return 'text-orange-400 bg-orange-400/20';
      case 'restricted':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesAccess = accessFilter === 'all' || doc.access_level === accessFilter;
    const matchesFolder = !selectedFolder || doc.folder_id === selectedFolder;
    return matchesSearch && matchesType && matchesAccess && matchesFolder;
  });

  const stats = {
    total_documents: documents.length,
    total_size: documents.reduce((sum, doc) => sum + doc.size, 0),
    encrypted_count: documents.filter(doc => doc.encryption_status === 'encrypted').length,
    shared_count: documents.filter(doc => doc.sharing_enabled).length,
    active_count: documents.filter(doc => doc.status === 'active').length,
    total_folders: folders.length,
    avg_access: documents.length > 0
      ? Math.round(documents.reduce((sum, doc) => sum + doc.access_count, 0) / documents.length)
      : 0
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
            Document Library
          </h1>
          <p className="text-white/60 mt-2">Manage and organize all your documents and files</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Folder
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_documents}</div>
              <div className="text-sm text-white/60">Documents</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_folders}</div>
              <div className="text-sm text-white/60">Folders</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{formatFileSize(stats.total_size)}</div>
              <div className="text-sm text-white/60">Total Size</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-2xl font-bold">{stats.encrypted_count}</div>
              <div className="text-sm text-white/60">Encrypted</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Share className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.shared_count}</div>
              <div className="text-sm text-white/60">Shared</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.active_count}</div>
              <div className="text-sm text-white/60">Active</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold">{stats.avg_access}</div>
              <div className="text-sm text-white/60">Avg Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents and tags..."
            className="frosted-input w-full pl-10"
          />
        </div>
        <select
          value={selectedFolder || 'all'}
          onChange={(e) => setSelectedFolder(e.target.value === 'all' ? null : e.target.value)}
          className="frosted-input min-w-[150px]"
        >
          <option value="all">All Folders</option>
          {folders.map(folder => (
            <option key={folder.id} value={folder.id}>{folder.name}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="frosted-input min-w-[150px]"
        >
          <option value="all">All Types</option>
          <option value="contract">Contracts</option>
          <option value="agreement">Agreements</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="pdf">PDFs</option>
        </select>
        <select
          value={accessFilter}
          onChange={(e) => setAccessFilter(e.target.value)}
          className="frosted-input min-w-[150px]"
        >
          <option value="all">All Access Levels</option>
          <option value="public">Public</option>
          <option value="internal">Internal</option>
          <option value="confidential">Confidential</option>
          <option value="restricted">Restricted</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
              ? 'bg-white/20 text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
              ? 'bg-white/20 text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Folders Section */}
      {!selectedFolder && (
        <GlassCard>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Folders ({folders.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {folders.map(folder => (
              <div
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className="p-4 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <FolderOpen className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(folder.access_level)}`}>
                    {folder.access_level}
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{folder.name}</h3>
                {folder.description && (
                  <p className="text-sm text-white/60 mb-2 line-clamp-2">{folder.description}</p>
                )}
                <div className="flex justify-between text-sm text-white/60">
                  <span>{folder.document_count} files</span>
                  <span>{formatFileSize(folder.size_total)}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Documents Section */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documents ({filteredDocuments.length})
            {selectedFolder && (
              <span className="text-sm text-white/60 ml-2">
                in {folders.find(f => f.id === selectedFolder)?.name}
              </span>
            )}
          </h2>
          {selectedFolder && (
            <button
              onClick={() => setSelectedFolder(null)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ← Back to all folders
            </button>
          )}
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-white/30" />
            <p className="text-white/60">No documents found matching your criteria</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map(doc => (
              <div key={doc.id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  {getFileTypeIcon(doc.type, doc.file_type)}
                  <div className="flex gap-1">
                    {doc.encryption_status === 'encrypted' && (
                      <Lock className="w-4 h-4 text-orange-400" />
                    )}
                    {doc.sharing_enabled && (
                      <Share className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                </div>
                <h3 className="font-medium mb-2 line-clamp-2 text-sm">{doc.name}</h3>
                <div className="space-y-2 text-xs text-white/60">
                  <div className="flex justify-between">
                    <span>{formatFileSize(doc.size)}</span>
                    <span>v{doc.version}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-center ${getAccessLevelColor(doc.access_level)}`}>
                    {doc.access_level}
                  </div>
                  <div className="flex justify-between">
                    <span>{doc.access_count} views</span>
                    <span>{new Date(doc.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-1 mt-3">
                  <button className="flex-1 p-2 rounded bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400">
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 rounded bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400">
                    <Download className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 rounded bg-white/10 hover:bg-white/20 transition-colors">
                    <Share className="w-4 h-4 mx-auto" />
                  </button>
                </div>
                {doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doc.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/60">
                        {tag}
                      </span>
                    ))}
                    {doc.tags.length > 3 && (
                      <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/60">
                        +{doc.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 font-medium text-white/60">Name</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Type</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Size</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Access</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Modified</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Views</th>
                  <th className="text-right py-3 px-2 font-medium text-white/60">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredDocuments.map(doc => (
                  <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        {getFileTypeIcon(doc.type, doc.file_type)}
                        <div>
                          <div className="font-medium max-w-[200px] truncate">{doc.name}</div>
                          <div className="text-sm text-white/60">
                            {doc.folder_name} • v{doc.version}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {doc.encryption_status === 'encrypted' && (
                            <Lock className="w-4 h-4 text-orange-400" />
                          )}
                          {doc.sharing_enabled && (
                            <Share className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="capitalize text-sm">{doc.type}</div>
                      <div className="text-xs text-white/60">{doc.file_type.toUpperCase()}</div>
                    </td>
                    <td className="py-4 px-2 text-sm">{formatFileSize(doc.size)}</td>
                    <td className="py-4 px-2">
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(doc.access_level)}`}>
                        {doc.access_level}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-sm">{new Date(doc.updated_at).toLocaleDateString()}</div>
                      <div className="text-xs text-white/60">{doc.created_by_name}</div>
                    </td>
                    <td className="py-4 px-2 text-sm">{doc.access_count}</td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Share">
                          <Share className="w-4 h-4" />
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
