"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  Image as ImageIcon,
  Video,
  Plus,
  Edit,
  Eye,
  Star,
  Share,
  Settings,
  Calendar,
  MapPin,
  Award,
  TrendingUp,
  Heart,
  MessageSquare,
  BookOpen,
  Camera,
  Briefcase,
  Search,
  Grid3X3,
  List,
  Layout,
  CheckCircle,
  Crown,
  Gem,
  ExternalLink
} from "lucide-react";

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  type: 'property' | 'experience' | 'lifestyle' | 'amenity';
  category: string;
  cover_image_url: string;
  media_count: number;
  video_count: number;
  location: string;
  featured: boolean;
  premium: boolean;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'unlisted';
  tags: string[];
  created_by: string;
  creator_name: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  view_count: number;
  like_count: number;
  share_count: number;
  comment_count: number;
  inquiry_count: number;
  booking_count: number;
  revenue_generated: number;
  client_rating: number;
  client_testimonial?: string;
  seo_title?: string;
  seo_description?: string;
  social_shares: {
    facebook: number;
    instagram: number;
    twitter: number;
    pinterest: number;
  };
  performance_metrics: {
    conversion_rate: number;
    engagement_rate: number;
    bounce_rate: number;
    avg_time_spent: number;
  };
};

type PortfolioCollection = {
  id: string;
  name: string;
  description: string;
  type: 'showcase' | 'gallery' | 'catalog' | 'presentation';
  cover_image_url?: string;
  item_count: number;
  visibility: 'public' | 'private' | 'client_only';
  created_at: string;
  created_by: string;
  creator_name: string;
  items: PortfolioItem[];
  custom_branding: {
    logo_url?: string;
    color_scheme: string;
    font_family: string;
  };
  analytics: {
    total_views: number;
    total_inquiries: number;
    conversion_rate: number;
  };
};

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [collections, setCollections] = useState<PortfolioCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'items' | 'collections'>('items');
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [_selectedItems, _setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockPortfolioItems: PortfolioItem[] = [
        {
          id: "portfolio_1",
          title: "Luxury Malibu Villa - Sunset Collection",
          description: "Breathtaking oceanfront villa featuring panoramic views, infinity pool, and world-class amenities. Perfect for intimate gatherings and exclusive events.",
          type: "property",
          category: "Luxury Villa",
          cover_image_url: "/portfolio/malibu-villa-sunset.jpg",
          media_count: 24,
          video_count: 3,
          location: "Malibu, California",
          featured: true,
          premium: true,
          status: "published",
          visibility: "public",
          tags: ["luxury", "oceanfront", "villa", "malibu", "premium", "events"],
          created_by: "creator_1",
          creator_name: "Sarah Johnson",
          created_at: "2025-09-01T00:00:00Z",
          updated_at: "2025-10-01T00:00:00Z",
          published_at: "2025-09-05T00:00:00Z",
          view_count: 2547,
          like_count: 189,
          share_count: 67,
          comment_count: 23,
          inquiry_count: 45,
          booking_count: 12,
          revenue_generated: 125000,
          client_rating: 4.9,
          client_testimonial: "Absolutely stunning property with incredible attention to detail. The sunset views were unforgettable!",
          seo_title: "Luxury Malibu Villa Rental - Oceanfront with Infinity Pool",
          seo_description: "Experience ultimate luxury in this stunning Malibu villa with panoramic ocean views, infinity pool, and premium amenities.",
          social_shares: {
            facebook: 234,
            instagram: 567,
            twitter: 89,
            pinterest: 123
          },
          performance_metrics: {
            conversion_rate: 8.5,
            engagement_rate: 12.3,
            bounce_rate: 32.1,
            avg_time_spent: 4.2
          }
        },
        {
          id: "portfolio_2",
          title: "Private Chef Experience - Gourmet Dining",
          description: "Exclusive culinary experience featuring Michelin-star trained chefs creating bespoke meals using locally sourced ingredients.",
          type: "experience",
          category: "Culinary Experience",
          cover_image_url: "/portfolio/chef-experience.jpg",
          media_count: 18,
          video_count: 2,
          location: "Various Locations",
          featured: false,
          premium: true,
          status: "published",
          visibility: "public",
          tags: ["culinary", "chef", "dining", "gourmet", "exclusive", "michelin"],
          created_by: "creator_2",
          creator_name: "Michael Chen",
          created_at: "2025-08-15T00:00:00Z",
          updated_at: "2025-09-20T00:00:00Z",
          published_at: "2025-08-20T00:00:00Z",
          view_count: 1823,
          like_count: 156,
          share_count: 43,
          comment_count: 18,
          inquiry_count: 32,
          booking_count: 8,
          revenue_generated: 45000,
          client_rating: 4.8,
          social_shares: {
            facebook: 145,
            instagram: 423,
            twitter: 56,
            pinterest: 89
          },
          performance_metrics: {
            conversion_rate: 6.2,
            engagement_rate: 15.7,
            bounce_rate: 28.4,
            avg_time_spent: 5.1
          }
        },
        {
          id: "portfolio_3",
          title: "Luxury Lifestyle Concierge",
          description: "Personalized concierge services providing exclusive access to premium experiences, events, and luxury amenities.",
          type: "lifestyle",
          category: "Concierge Service",
          cover_image_url: "/portfolio/concierge-lifestyle.jpg",
          media_count: 12,
          video_count: 1,
          location: "Global",
          featured: true,
          premium: false,
          status: "published",
          visibility: "public",
          tags: ["concierge", "lifestyle", "luxury", "premium", "global", "exclusive"],
          created_by: "creator_3",
          creator_name: "Emma Rodriguez",
          created_at: "2025-07-10T00:00:00Z",
          updated_at: "2025-09-15T00:00:00Z",
          published_at: "2025-07-15T00:00:00Z",
          view_count: 3421,
          like_count: 287,
          share_count: 91,
          comment_count: 34,
          inquiry_count: 67,
          booking_count: 23,
          revenue_generated: 89000,
          client_rating: 4.7,
          social_shares: {
            facebook: 198,
            instagram: 645,
            twitter: 112,
            pinterest: 167
          },
          performance_metrics: {
            conversion_rate: 9.8,
            engagement_rate: 18.5,
            bounce_rate: 25.7,
            avg_time_spent: 6.3
          }
        },
        {
          id: "portfolio_4",
          title: "Spa & Wellness Retreat",
          description: "Transformative wellness experience featuring world-class spa treatments, yoga sessions, and holistic healing practices.",
          type: "amenity",
          category: "Wellness & Spa",
          cover_image_url: "/portfolio/spa-wellness.jpg",
          media_count: 20,
          video_count: 4,
          location: "Sedona, Arizona",
          featured: false,
          premium: true,
          status: "draft",
          visibility: "private",
          tags: ["spa", "wellness", "retreat", "holistic", "yoga", "healing"],
          created_by: "creator_1",
          creator_name: "Sarah Johnson",
          created_at: "2025-09-25T00:00:00Z",
          updated_at: "2025-10-05T00:00:00Z",
          view_count: 156,
          like_count: 23,
          share_count: 5,
          comment_count: 2,
          inquiry_count: 8,
          booking_count: 0,
          revenue_generated: 0,
          client_rating: 0,
          social_shares: {
            facebook: 12,
            instagram: 34,
            twitter: 8,
            pinterest: 15
          },
          performance_metrics: {
            conversion_rate: 0,
            engagement_rate: 8.2,
            bounce_rate: 45.3,
            avg_time_spent: 2.1
          }
        }
      ];

      const mockCollections: PortfolioCollection[] = [
        {
          id: "collection_1",
          name: "Premium Properties Showcase",
          description: "Our finest collection of luxury properties featuring stunning architecture and breathtaking locations.",
          type: "showcase",
          cover_image_url: "/collections/premium-properties.jpg",
          item_count: 15,
          visibility: "public",
          created_at: "2025-08-01T00:00:00Z",
          created_by: "admin_1",
          creator_name: "Admin User",
          items: [mockPortfolioItems[0]],
          custom_branding: {
            logo_url: "/branding/cabana-logo.png",
            color_scheme: "luxury-gold",
            font_family: "Cinzel"
          },
          analytics: {
            total_views: 12456,
            total_inquiries: 234,
            conversion_rate: 12.5
          }
        },
        {
          id: "collection_2",
          name: "Exclusive Experiences Gallery",
          description: "Curated collection of unique experiences designed to create unforgettable memories.",
          type: "gallery",
          cover_image_url: "/collections/experiences-gallery.jpg",
          item_count: 8,
          visibility: "public",
          created_at: "2025-07-15T00:00:00Z",
          created_by: "creator_2",
          creator_name: "Michael Chen",
          items: [mockPortfolioItems[1]],
          custom_branding: {
            color_scheme: "elegant-blue",
            font_family: "Manrope"
          },
          analytics: {
            total_views: 8934,
            total_inquiries: 167,
            conversion_rate: 8.9
          }
        }
      ];

      setPortfolioItems(mockPortfolioItems);
      setCollections(mockCollections);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <Briefcase className="w-5 h-5 text-blue-400" />;
      case 'experience':
        return <Star className="w-5 h-5 text-purple-400" />;
      case 'lifestyle':
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 'amenity':
        return <Gem className="w-5 h-5 text-green-400" />;
      default:
        return <Camera className="w-5 h-5 text-white/60" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-400 bg-green-400/20';
      case 'draft':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'archived':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total_items: portfolioItems.length,
    published: portfolioItems.filter(item => item.status === 'published').length,
    featured: portfolioItems.filter(item => item.featured).length,
    premium: portfolioItems.filter(item => item.premium).length,
    total_views: portfolioItems.reduce((sum, item) => sum + item.view_count, 0),
    total_inquiries: portfolioItems.reduce((sum, item) => sum + item.inquiry_count, 0),
    total_bookings: portfolioItems.reduce((sum, item) => sum + item.booking_count, 0),
    total_revenue: portfolioItems.reduce((sum, item) => sum + item.revenue_generated, 0),
    avg_rating: portfolioItems.filter(item => item.client_rating > 0)
      .reduce((sum, item) => sum + item.client_rating, 0) /
      portfolioItems.filter(item => item.client_rating > 0).length || 0
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
            Portfolio Management
          </h1>
          <p className="text-white/60 mt-2">Showcase your properties and experiences</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Item
          </button>
          <button className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2">
            <Layout className="w-4 h-4" />
            New Collection
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
            <BookOpen className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_items}</div>
              <div className="text-sm text-white/60">Total</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.published}</div>
              <div className="text-sm text-white/60">Published</div>
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
            <Crown className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-2xl font-bold">{stats.premium}</div>
              <div className="text-sm text-white/60">Premium</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_views.toLocaleString()}</div>
              <div className="text-sm text-white/60">Views</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_inquiries}</div>
              <div className="text-sm text-white/60">Inquiries</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total_bookings}</div>
              <div className="text-sm text-white/60">Bookings</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">${(stats.total_revenue / 1000).toFixed(0)}k</div>
              <div className="text-sm text-white/60">Revenue</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold">{stats.avg_rating.toFixed(1)}</div>
              <div className="text-sm text-white/60">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-lg w-fit">
        <button
          onClick={() => setSelectedTab('items')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'items'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Portfolio Items ({portfolioItems.length})
        </button>
        <button
          onClick={() => setSelectedTab('collections')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedTab === 'collections'
            ? 'bg-white/20 text-white'
            : 'text-white/60 hover:text-white'
            }`}
        >
          Collections ({collections.length})
        </button>
      </div>

      {selectedTab === 'items' ? (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search portfolio items..."
                className="frosted-input w-full pl-10"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="frosted-input min-w-[150px]"
            >
              <option value="all">All Types</option>
              <option value="property">Properties</option>
              <option value="experience">Experiences</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="amenity">Amenities</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="frosted-input min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
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

          {/* Portfolio Items */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Portfolio Items ({filteredItems.length})
            </h2>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-white/30" />
                <p className="text-white/60">No portfolio items found matching your criteria</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <div key={item.id} className="group relative">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-white/5 border border-white/10">
                      <Image
                        src={item.cover_image_url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
                        <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                          <Eye className="w-5 h-5 text-white" />
                        </button>
                        <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                          <Edit className="w-5 h-5 text-white" />
                        </button>
                        <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                          <Share className="w-5 h-5 text-white" />
                        </button>
                        <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex gap-2">
                        {item.featured && (
                          <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-400/20 text-yellow-400 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Featured
                          </div>
                        )}
                        {item.premium && (
                          <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-400/20 text-purple-400 flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Premium
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </div>
                      </div>

                      {/* Media Count */}
                      <div className="absolute bottom-2 left-2 flex gap-2">
                        <div className="px-2 py-1 rounded bg-black/70 text-white text-xs flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {item.media_count}
                        </div>
                        {item.video_count > 0 && (
                          <div className="px-2 py-1 rounded bg-black/70 text-white text-xs flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            {item.video_count}
                          </div>
                        )}
                      </div>

                      {/* Rating */}
                      {item.client_rating > 0 && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-yellow-400" />
                          {item.client_rating}
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start gap-2">
                        {getTypeIcon(item.type)}
                        <div className="flex-1">
                          <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                          <p className="text-sm text-white/60">{item.category}</p>
                        </div>
                      </div>
                      <p className="text-sm text-white/70 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-3 text-white/60">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {item.view_count.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {item.like_count}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {item.inquiry_count}
                          </div>
                        </div>
                        {item.revenue_generated > 0 && (
                          <div className="text-green-400 font-medium">
                            ${(item.revenue_generated / 1000).toFixed(0)}k
                          </div>
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
                      <th className="text-left py-3 px-2 font-medium text-white/60">Item</th>
                      <th className="text-left py-3 px-2 font-medium text-white/60">Type</th>
                      <th className="text-left py-3 px-2 font-medium text-white/60">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-white/60">Performance</th>
                      <th className="text-left py-3 px-2 font-medium text-white/60">Revenue</th>
                      <th className="text-left py-3 px-2 font-medium text-white/60">Updated</th>
                      <th className="text-right py-3 px-2 font-medium text-white/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 relative">
                              <Image
                                src={item.cover_image_url}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium max-w-[200px] truncate">{item.title}</div>
                              <div className="text-sm text-white/60">{item.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            <span className="capitalize text-sm">{item.type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <Eye className="w-3 h-3 text-white/60" />
                              {item.view_count.toLocaleString()} views
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-3 h-3 text-white/60" />
                              {item.inquiry_count} inquiries
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm">
                            <div className="font-medium text-green-400">
                              ${item.revenue_generated.toLocaleString()}
                            </div>
                            <div className="text-white/60">{item.booking_count} bookings</div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-sm">
                            <div>{new Date(item.updated_at).toLocaleDateString()}</div>
                            <div className="text-white/60">{item.creator_name}</div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                              <ExternalLink className="w-4 h-4" />
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
        </>
      ) : (
        /* Collections Tab */
        <GlassCard>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Portfolio Collections ({collections.length})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {collections.map(collection => (
              <div key={collection.id} className="group relative p-6 border border-white/10 rounded-lg hover:bg-white/5 transition-all overflow-hidden">
                {collection.cover_image_url && (
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Image
                      src={collection.cover_image_url}
                      alt={collection.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10">
                        <Layout className="w-6 h-6 text-white/80" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{collection.name}</h3>
                        <p className="text-sm text-white/60 capitalize">{collection.type}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${collection.visibility === 'public'
                      ? 'text-green-400 bg-green-400/20'
                      : 'text-orange-400 bg-orange-400/20'
                      }`}>
                      {collection.visibility}
                    </div>
                  </div>

                  <p className="text-white/80 mb-4 line-clamp-2">{collection.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold">{collection.item_count}</div>
                      <div className="text-xs text-white/60">Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{collection.analytics.total_views.toLocaleString()}</div>
                      <div className="text-xs text-white/60">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{collection.analytics.conversion_rate}%</div>
                      <div className="text-xs text-white/60">Conversion</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                    <span>Created by {collection.creator_name}</span>
                    <span>{new Date(collection.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 liquid-btn px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Collection
                    </button>
                    <button className="frosted-input px-4 py-2 rounded-lg text-sm">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="frosted-input px-4 py-2 rounded-lg text-sm">
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
