"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Search,
  Plus,
  Share,
  Star,
  FolderOpen,
  Grid3X3,
  List,
  Play,
  Heart,
  Award,
  HardDrive,
  Camera,
  X
} from "lucide-react";

type MediaItem = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  format: string;
  size: number;
  dimensions?: { width: number; height: number };
  duration?: number; // for video/audio in seconds
  url: string;
  thumbnail_url?: string;
  folder_id?: string;
  folder_name?: string;
  uploaded_by: string;
  uploaded_by_name: string;
  uploaded_at: string;
  last_accessed?: string;
  view_count: number;
  download_count: number;
  like_count: number;
  comment_count: number;
  tags: string[];
  alt_text?: string;
  caption?: string;
  location?: string;
  camera_settings?: {
    camera: string;
    lens: string;
    iso: number;
    aperture: string;
    shutter_speed: string;
  };
  status: 'active' | 'processing' | 'archived' | 'deleted';
  visibility: 'public' | 'private' | 'unlisted';
  featured: boolean;
  created_at: string;
  booking_id?: string;
  property_id?: string;
  usage_rights: 'exclusive' | 'non_exclusive' | 'royalty_free' | 'restricted';
};

type MediaFolder = {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  item_count: number;
  total_size: number;
  created_at: string;
  created_by: string;
  visibility: 'public' | 'private';
  cover_image_url?: string;
};

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [folderFilter, setFolderFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchMediaLibrary();
  }, []);

  const fetchMediaLibrary = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockMediaItems: MediaItem[] = [
        {
          id: "media_1",
          name: "Villa Sunset Exterior",
          type: "image",
          format: "jpg",
          size: 4567890,
          dimensions: { width: 4000, height: 3000 },
          url: "/media/images/villa-sunset-exterior.jpg",
          thumbnail_url: "/media/thumbs/villa-sunset-exterior-thumb.jpg",
          folder_id: "folder_1",
          folder_name: "Property Photos",
          uploaded_by: "creator_1",
          uploaded_by_name: "Sarah Johnson",
          uploaded_at: "2025-09-15T10:30:00Z",
          last_accessed: "2025-10-08T14:20:00Z",
          view_count: 245,
          download_count: 34,
          like_count: 18,
          comment_count: 5,
          tags: ["villa", "sunset", "exterior", "luxury", "architecture"],
          alt_text: "Luxury villa exterior view during sunset with palm trees",
          caption: "Stunning sunset view of our premium villa property",
          location: "Malibu, California",
          camera_settings: {
            camera: "Canon EOS R5",
            lens: "24-70mm f/2.8",
            iso: 100,
            aperture: "f/8",
            shutter_speed: "1/250"
          },
          status: "active",
          visibility: "public",
          featured: true,
          created_at: "2025-09-15T10:30:00Z",
          booking_id: "booking_1",
          property_id: "property_1",
          usage_rights: "exclusive"
        },
        {
          id: "media_2",
          name: "Interior Living Room 360",
          type: "video",
          format: "mp4",
          size: 87654321,
          dimensions: { width: 3840, height: 2160 },
          duration: 45,
          url: "/media/videos/interior-living-360.mp4",
          thumbnail_url: "/media/thumbs/interior-living-360-thumb.jpg",
          folder_id: "folder_2",
          folder_name: "Video Tours",
          uploaded_by: "creator_2",
          uploaded_by_name: "Michael Chen",
          uploaded_at: "2025-09-20T15:45:00Z",
          last_accessed: "2025-10-07T09:15:00Z",
          view_count: 156,
          download_count: 12,
          like_count: 23,
          comment_count: 8,
          tags: ["interior", "living room", "360", "tour", "luxury"],
          caption: "360-degree tour of the main living area",
          status: "active",
          visibility: "public",
          featured: false,
          created_at: "2025-09-20T15:45:00Z",
          property_id: "property_1",
          usage_rights: "exclusive"
        },
        {
          id: "media_3",
          name: "Ambient Beach Sounds",
          type: "audio",
          format: "mp3",
          size: 12345678,
          duration: 180,
          url: "/media/audio/ambient-beach-sounds.mp3",
          folder_id: "folder_3",
          folder_name: "Audio Assets",
          uploaded_by: "creator_3",
          uploaded_by_name: "Emma Rodriguez",
          uploaded_at: "2025-08-10T12:00:00Z",
          view_count: 89,
          download_count: 23,
          like_count: 15,
          comment_count: 3,
          tags: ["ambient", "beach", "relaxing", "nature", "sounds"],
          caption: "Peaceful beach sounds for property ambiance",
          status: "active",
          visibility: "public",
          featured: false,
          created_at: "2025-08-10T12:00:00Z",
          usage_rights: "royalty_free"
        },
        {
          id: "media_4",
          name: "Property Specifications",
          type: "document",
          format: "pdf",
          size: 2345678,
          url: "/media/docs/property-specifications.pdf",
          thumbnail_url: "/media/thumbs/pdf-thumb.jpg",
          folder_id: "folder_4",
          folder_name: "Marketing Materials",
          uploaded_by: "admin_1",
          uploaded_by_name: "Admin User",
          uploaded_at: "2025-10-01T09:00:00Z",
          view_count: 67,
          download_count: 45,
          like_count: 8,
          comment_count: 2,
          tags: ["specifications", "marketing", "property", "details"],
          caption: "Detailed property specifications and amenities",
          status: "active",
          visibility: "public",
          featured: false,
          created_at: "2025-10-01T09:00:00Z",
          property_id: "property_1",
          usage_rights: "exclusive"
        }
      ];

      const mockFolders: MediaFolder[] = [
        {
          id: "folder_1",
          name: "Property Photos",
          description: "High-quality photos of all properties",
          item_count: 124,
          total_size: 567890123,
          created_at: "2025-01-01T00:00:00Z",
          created_by: "admin_1",
          visibility: "public",
          cover_image_url: "/media/thumbs/villa-sunset-exterior-thumb.jpg"
        },
        {
          id: "folder_2",
          name: "Video Tours",
          description: "360° tours and promotional videos",
          item_count: 28,
          total_size: 2456789012,
          created_at: "2025-02-15T00:00:00Z",
          created_by: "admin_1",
          visibility: "public",
          cover_image_url: "/media/thumbs/interior-living-360-thumb.jpg"
        },
        {
          id: "folder_3",
          name: "Audio Assets",
          description: "Ambient sounds and audio content",
          item_count: 15,
          total_size: 123456789,
          created_at: "2025-03-01T00:00:00Z",
          created_by: "creator_3",
          visibility: "public"
        },
        {
          id: "folder_4",
          name: "Marketing Materials",
          description: "Brochures, specs, and promotional content",
          item_count: 45,
          total_size: 234567890,
          created_at: "2025-01-15T00:00:00Z",
          created_by: "admin_1",
          visibility: "public"
        }
      ];

      setMediaItems(mockMediaItems);
      setFolders(mockFolders);
    } catch (error) {
      console.error('Error fetching media library:', error);
      toast.error('Failed to load media library');
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-green-400" />;
      case 'video':
        return <Video className="w-5 h-5 text-red-400" />;
      case 'audio':
        return <Music className="w-5 h-5 text-purple-400" />;
      case 'document':
        return <FileText className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-white/60" />;
    }
  };

  const getUsageRightsColor = (rights: string) => {
    switch (rights) {
      case 'exclusive':
        return 'text-green-400 bg-green-400/20';
      case 'non_exclusive':
        return 'text-blue-400 bg-blue-400/20';
      case 'royalty_free':
        return 'text-purple-400 bg-purple-400/20';
      case 'restricted':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const filteredMediaItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.caption?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesFolder = folderFilter === 'all' || item.folder_id === folderFilter;
    return matchesSearch && matchesType && matchesFolder;
  });

  const stats = {
    total_items: mediaItems.length,
    total_size: mediaItems.reduce((sum, item) => sum + item.size, 0),
    images: mediaItems.filter(item => item.type === 'image').length,
    videos: mediaItems.filter(item => item.type === 'video').length,
    audio: mediaItems.filter(item => item.type === 'audio').length,
    documents: mediaItems.filter(item => item.type === 'document').length,
    featured: mediaItems.filter(item => item.featured).length,
    total_views: mediaItems.reduce((sum, item) => sum + item.view_count, 0),
    total_downloads: mediaItems.reduce((sum, item) => sum + item.download_count, 0)
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
            Media Library
          </h1>
          <p className="text-white/60 mt-2">Manage photos, videos, audio, and documents</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Media
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Folder
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_items}</div>
              <div className="text-sm text-white/60">Total</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.images}</div>
              <div className="text-sm text-white/60">Images</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-2xl font-bold">{stats.videos}</div>
              <div className="text-sm text-white/60">Videos</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Music className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-2xl font-bold">{stats.audio}</div>
              <div className="text-sm text-white/60">Audio</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.documents}</div>
              <div className="text-sm text-white/60">Docs</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold">{stats.featured}</div>
              <div className="text-sm text-white/60">Featured</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-2xl font-bold">{formatFileSize(stats.total_size)}</div>
              <div className="text-sm text-white/60">Storage</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_views.toLocaleString()}</div>
              <div className="text-sm text-white/60">Views</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_downloads}</div>
              <div className="text-sm text-white/60">Downloads</div>
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
            placeholder="Search media by name, tags, or caption..."
            className="frosted-input w-full pl-10"
          />
        </div>
        <select
          value={folderFilter}
          onChange={(e) => setFolderFilter(e.target.value)}
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
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
          <option value="document">Documents</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
              ? 'bg-white/20 text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
          >
            <Grid3X3 className="w-4 h-4" />
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
      <GlassCard>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Media Folders ({folders.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map(folder => (
            <div
              key={folder.id}
              className="relative p-4 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition-all group overflow-hidden"
            >
              {folder.cover_image_url && (
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                  <Image
                    src={folder.cover_image_url}
                    alt={folder.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <FolderOpen className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${folder.visibility === 'public' ? 'text-green-400 bg-green-400/20' : 'text-orange-400 bg-orange-400/20'}`}>
                    {folder.visibility}
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{folder.name}</h3>
                {folder.description && (
                  <p className="text-sm text-white/60 mb-2 line-clamp-2">{folder.description}</p>
                )}
                <div className="flex justify-between text-sm text-white/60">
                  <span>{folder.item_count} items</span>
                  <span>{formatFileSize(folder.total_size)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Media Items */}
      <GlassCard>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Media Items ({filteredMediaItems.length})
        </h2>

        {filteredMediaItems.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-white/30" />
            <p className="text-white/60">No media items found matching your criteria</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMediaItems.map(item => (
              <div key={item.id} className="group relative">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10">
                  {item.type === 'image' && item.thumbnail_url ? (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.alt_text || item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : item.type === 'video' && item.thumbnail_url ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.thumbnail_url}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      {item.duration && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">
                          {formatDuration(item.duration)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getTypeIcon(item.type)}
                      {item.type === 'audio' && item.duration && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">
                          {formatDuration(item.duration)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <Eye className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                      <Download className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                      <Share className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-2 left-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </div>
                  )}

                  {/* Usage Rights Badge */}
                  <div className="absolute top-2 right-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUsageRightsColor(item.usage_rights)}`}>
                      {item.usage_rights.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Item Info */}
                <div className="mt-3 space-y-2">
                  <h3 className="font-medium line-clamp-1">{item.name}</h3>
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>{formatFileSize(item.size)}</span>
                    <span>{item.dimensions && `${item.dimensions.width}×${item.dimensions.height}`}</span>
                  </div>
                  {item.caption && (
                    <p className="text-sm text-white/60 line-clamp-2">{item.caption}</p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-white/60">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {item.view_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {item.like_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {item.download_count}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/60">
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/60">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 font-medium text-white/60">Preview</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Name</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Type</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Size</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Dimensions</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Stats</th>
                  <th className="text-left py-3 px-2 font-medium text-white/60">Uploaded</th>
                  <th className="text-right py-3 px-2 font-medium text-white/60">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredMediaItems.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center relative">
                        {item.thumbnail_url ? (
                          <Image
                            src={item.thumbnail_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          getTypeIcon(item.type)
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div>
                        <div className="font-medium max-w-[200px] truncate">{item.name}</div>
                        <div className="text-sm text-white/60">{item.folder_name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(item.type)}
                        <span className="capitalize text-sm">{item.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-sm">{formatFileSize(item.size)}</td>
                    <td className="py-4 px-2 text-sm">
                      {item.dimensions
                        ? `${item.dimensions.width}×${item.dimensions.height}`
                        : item.duration
                          ? formatDuration(item.duration)
                          : '—'
                      }
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex gap-3 text-sm text-white/60">
                        <span>{item.view_count} views</span>
                        <span>{item.download_count} downloads</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-sm">
                        <div>{new Date(item.uploaded_at).toLocaleDateString()}</div>
                        <div className="text-white/60">{item.uploaded_by_name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          title="Share"
                        >
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

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-full">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <GlassCard>
              <div className="grid lg:grid-cols-2 gap-6 p-6">
                <div className="flex items-center justify-center">
                  {previewItem.type === 'image' ? (
                    <div className="relative max-w-full max-h-96">
                      <Image
                        src={previewItem.url}
                        alt={previewItem.alt_text || previewItem.name}
                        width={800}
                        height={600}
                        className="max-w-full max-h-96 object-contain rounded-lg"
                      />
                    </div>
                  ) : previewItem.type === 'video' ? (
                    <video
                      src={previewItem.url}
                      controls
                      className="max-w-full max-h-96 rounded-lg"
                    />
                  ) : previewItem.type === 'audio' ? (
                    <audio
                      src={previewItem.url}
                      controls
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-64 bg-white/5 rounded-lg">
                      {getTypeIcon(previewItem.type)}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{previewItem.name}</h2>
                  {previewItem.caption && (
                    <p className="text-white/80">{previewItem.caption}</p>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white/60">Size</div>
                      <div>{formatFileSize(previewItem.size)}</div>
                    </div>
                    <div>
                      <div className="text-white/60">Format</div>
                      <div>{previewItem.format.toUpperCase()}</div>
                    </div>
                    {previewItem.dimensions && (
                      <>
                        <div>
                          <div className="text-white/60">Dimensions</div>
                          <div>{previewItem.dimensions.width}×{previewItem.dimensions.height}</div>
                        </div>
                      </>
                    )}
                    {previewItem.duration && (
                      <div>
                        <div className="text-white/60">Duration</div>
                        <div>{formatDuration(previewItem.duration)}</div>
                      </div>
                    )}
                  </div>
                  {previewItem.camera_settings && (
                    <div>
                      <h3 className="font-semibold mb-2">Camera Settings</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Camera: {previewItem.camera_settings.camera}</div>
                        <div>Lens: {previewItem.camera_settings.lens}</div>
                        <div>ISO: {previewItem.camera_settings.iso}</div>
                        <div>Aperture: {previewItem.camera_settings.aperture}</div>
                        <div>Shutter: {previewItem.camera_settings.shutter_speed}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {previewItem.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/80">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
                      <Share className="w-4 h-4" />
                      Share
                    </button>
                    <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
