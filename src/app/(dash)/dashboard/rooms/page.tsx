"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  Home,
  Plus,
  Edit,
  Search,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Camera,
  Star,
  Calendar,
  DollarSign,
  Eye,
  Settings
} from "lucide-react";

type Room = {
  id: string;
  name: string;
  type: 'studio' | 'bedroom' | 'suite' | 'penthouse';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  capacity: number;
  bedrooms?: number;
  bathrooms?: number;
  price_per_night: number;
  amenities: string[];
  description?: string;
  images?: string[];
  location?: string;
  bookings_count?: number;
  rating?: number;
  last_cleaned?: string;
  next_maintenance?: string;
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockRooms: Room[] = [
        {
          id: "1",
          name: "Ocean View Studio",
          type: "studio",
          status: "available",
          capacity: 2,
          bedrooms: 1,
          bathrooms: 1,
          price_per_night: 250,
          amenities: ["wifi", "parking", "pool", "gym"],
          description: "Stunning ocean view studio with modern amenities",
          location: "Floor 3, Unit 301",
          bookings_count: 45,
          rating: 4.8,
          last_cleaned: "2025-10-04T10:00:00Z",
          next_maintenance: "2025-10-15T09:00:00Z"
        },
        {
          id: "2",
          name: "Luxury Suite",
          type: "suite",
          status: "occupied",
          capacity: 4,
          bedrooms: 2,
          bathrooms: 2,
          price_per_night: 450,
          amenities: ["wifi", "parking", "pool", "gym", "balcony", "kitchen"],
          description: "Spacious luxury suite with premium finishes",
          location: "Floor 5, Unit 501",
          bookings_count: 32,
          rating: 4.9,
          last_cleaned: "2025-10-03T14:00:00Z",
          next_maintenance: "2025-10-20T09:00:00Z"
        },
        {
          id: "3",
          name: "Penthouse Elite",
          type: "penthouse",
          status: "maintenance",
          capacity: 6,
          bedrooms: 3,
          bathrooms: 3,
          price_per_night: 750,
          amenities: ["wifi", "parking", "pool", "gym", "balcony", "kitchen", "jacuzzi"],
          description: "Ultimate luxury penthouse experience",
          location: "Floor 10, Penthouse A",
          bookings_count: 28,
          rating: 5.0,
          last_cleaned: "2025-10-02T16:00:00Z",
          next_maintenance: "2025-10-05T08:00:00Z"
        }
      ];

      setRooms(mockRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'occupied':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
      case 'maintenance':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      case 'reserved':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      default:
        return 'text-white/60 bg-white/10 border-white/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'studio':
        return <Home className="w-4 h-4" />;
      case 'bedroom':
        return <Bed className="w-4 h-4" />;
      case 'suite':
        return <Users className="w-4 h-4" />;
      case 'penthouse':
        return <Star className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="w-3 h-3" />;
      case 'parking':
        return <Car className="w-3 h-3" />;
      case 'pool':
        return <div className="w-3 h-3 bg-blue-400 rounded-full" />;
      case 'gym':
        return <div className="w-3 h-3 bg-red-400 rounded-sm" />;
      case 'camera':
        return <Camera className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    avgPrice: Math.round(rooms.reduce((sum, r) => sum + r.price_per_night, 0) / rooms.length || 0)
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
            Room Management
          </h1>
          <p className="text-white/60 mt-2">Manage properties, availability, and maintenance</p>
        </div>
        <button
          className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-white/60">Total Rooms</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full" />
            <div>
              <div className="text-2xl font-bold">{stats.available}</div>
              <div className="text-sm text-white/60">Available</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full" />
            <div>
              <div className="text-2xl font-bold">{stats.occupied}</div>
              <div className="text-sm text-white/60">Occupied</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <div>
              <div className="text-2xl font-bold">{stats.maintenance}</div>
              <div className="text-sm text-white/60">Maintenance</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold">${stats.avgPrice}</div>
              <div className="text-sm text-white/60">Avg/Night</div>
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
            placeholder="Search rooms..."
            className="frosted-input w-full pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="frosted-input min-w-[150px]"
        >
          <option value="all">All Types</option>
          <option value="studio">Studio</option>
          <option value="bedroom">Bedroom</option>
          <option value="suite">Suite</option>
          <option value="penthouse">Penthouse</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="frosted-input min-w-[150px]"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <GlassCard key={room.id}>
            <div className="space-y-4">
              {/* Room Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    {getTypeIcon(room.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{room.name}</h3>
                    <p className="text-sm text-white/60 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {room.location}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>

              {/* Room Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/60" />
                  <span>{room.capacity} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-white/60" />
                  <span>{room.bedrooms} bed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-white/60" />
                  <span>{room.bathrooms} bath</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{room.rating}/5.0</span>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <p className="text-sm text-white/60 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.slice(0, 4).map((amenity) => (
                    <div key={amenity} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10">
                      {getAmenityIcon(amenity)}
                      <span className="text-xs capitalize">{amenity}</span>
                    </div>
                  ))}
                  {room.amenities.length > 4 && (
                    <div className="px-2 py-1 rounded-lg bg-white/10 text-xs">
                      +{room.amenities.length - 4} more
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <p className="text-2xl font-bold">${room.price_per_night}</p>
                  <p className="text-sm text-white/60">per night</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">{room.bookings_count} bookings</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 liquid-btn px-3 py-2 rounded-lg flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Calendar className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <Home className="w-12 h-12 mx-auto mb-4 text-white/30" />
          <p className="text-white/60">No rooms found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
