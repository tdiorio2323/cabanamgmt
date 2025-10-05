"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  BarChart3,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Target,
  Globe,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  PieChart,
  LineChart
} from "lucide-react";

type AnalyticsData = {
  revenue: {
    total: number;
    growth: number;
    monthly: { month: string; amount: number }[];
  };
  users: {
    total: number;
    new_this_month: number;
    growth: number;
    by_type: { type: string; count: number }[];
  };
  bookings: {
    total: number;
    completed: number;
    conversion_rate: number;
    average_value: number;
  };
  performance: {
    page_views: number;
    session_duration: number;
    bounce_rate: number;
    top_pages: { page: string; views: number }[];
  };
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      // Mock data for now - replace with actual analytics queries
      const mockAnalytics: AnalyticsData = {
        revenue: {
          total: 127500,
          growth: 12.5,
          monthly: [
            { month: "Jan", amount: 45000 },
            { month: "Feb", amount: 52000 },
            { month: "Mar", amount: 48000 },
            { month: "Apr", amount: 55000 },
            { month: "May", amount: 61000 },
            { month: "Jun", amount: 58000 }
          ]
        },
        users: {
          total: 2847,
          new_this_month: 156,
          growth: 18.3,
          by_type: [
            { type: "creators", count: 1205 },
            { type: "clients", count: 1542 },
            { type: "vip", count: 100 }
          ]
        },
        bookings: {
          total: 847,
          completed: 768,
          conversion_rate: 68.4,
          average_value: 850
        },
        performance: {
          page_views: 25847,
          session_duration: 4.2,
          bounce_rate: 32.1,
          top_pages: [
            { page: "/dashboard", views: 5847 },
            { page: "/bookings", views: 4231 },
            { page: "/profile", views: 3892 },
            { page: "/calendar", views: 2945 }
          ]
        }
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ?
      <ArrowUpRight className="w-4 h-4 text-green-400" /> :
      <ArrowDownLeft className="w-4 h-4 text-red-400" />;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-white/30" />
        <p className="text-white/60">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-white/60 mt-2">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="frosted-input px-3 py-2 rounded-lg"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="frosted-input px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex items-center gap-1">
              {getGrowthIcon(analytics.revenue.growth)}
              <span className={`text-sm font-medium ${getGrowthColor(analytics.revenue.growth)}`}>
                {analytics.revenue.growth.toFixed(1)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold">{formatCurrency(analytics.revenue.total)}</p>
            <p className="text-sm text-white/60">Total Revenue</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-1">
              {getGrowthIcon(analytics.users.growth)}
              <span className={`text-sm font-medium ${getGrowthColor(analytics.users.growth)}`}>
                {analytics.users.growth.toFixed(1)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold">{formatNumber(analytics.users.total)}</p>
            <p className="text-sm text-white/60">Total Users</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">
                {analytics.bookings.conversion_rate.toFixed(1)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold">{analytics.bookings.total}</p>
            <p className="text-sm text-white/60">Total Bookings</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                {analytics.performance.session_duration.toFixed(1)}m
              </span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold">{formatCurrency(analytics.bookings.average_value)}</p>
            <p className="text-sm text-white/60">Avg Booking Value</p>
          </div>
        </GlassCard>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'revenue', label: 'Revenue', icon: DollarSign },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'performance', label: 'Performance', icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Revenue Trend
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {analytics.revenue.monthly.map((data, index) => {
                const height = (data.amount / Math.max(...analytics.revenue.monthly.map(d => d.amount))) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg mb-2 transition-all hover:opacity-80"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-white/60">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* User Distribution */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              User Distribution
            </h3>
            <div className="space-y-4">
              {analytics.users.by_type.map((userType) => {
                const percentage = (userType.count / analytics.users.total) * 100;
                return (
                  <div key={userType.type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize text-sm font-medium">{userType.type}</span>
                      <span className="text-sm text-white/60">{userType.count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Monthly Revenue Breakdown</h3>
              <div className="space-y-4">
                {analytics.revenue.monthly.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="font-medium">{month.month} 2025</span>
                    <span className="text-lg font-bold">{formatCurrency(month.amount)}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
          <div>
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Revenue Metrics</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-white/60 mb-2">Average Monthly Revenue</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(analytics.revenue.monthly.reduce((sum, m) => sum + m.amount, 0) / analytics.revenue.monthly.length)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-2">Growth Rate</p>
                  <p className={`text-xl font-bold ${getGrowthColor(analytics.revenue.growth)}`}>
                    +{analytics.revenue.growth.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-2">Revenue per User</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(analytics.revenue.total / analytics.users.total)}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Users</span>
                <span className="text-2xl font-bold">{analytics.users.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>New This Month</span>
                <span className="text-xl font-semibold text-green-400">+{analytics.users.new_this_month}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Growth Rate</span>
                <span className={`text-xl font-semibold ${getGrowthColor(analytics.users.growth)}`}>
                  +{analytics.users.growth.toFixed(1)}%
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">User Segments</h3>
            <div className="space-y-4">
              {analytics.users.by_type.map((segment) => (
                <div key={segment.type} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="capitalize font-medium">{segment.type}</span>
                  <div className="text-right">
                    <p className="font-semibold">{segment.count.toLocaleString()}</p>
                    <p className="text-sm text-white/60">
                      {((segment.count / analytics.users.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Website Performance</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Page Views</span>
                </div>
                <span className="text-xl font-bold">{analytics.performance.page_views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span>Avg Session Duration</span>
                </div>
                <span className="text-xl font-bold">{analytics.performance.session_duration}m</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-yellow-400" />
                  <span>Bounce Rate</span>
                </div>
                <span className="text-xl font-bold">{analytics.performance.bounce_rate}%</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
            <div className="space-y-3">
              {analytics.performance.top_pages.map((page, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="font-mono text-sm">{page.page}</span>
                  <span className="font-semibold">{page.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
