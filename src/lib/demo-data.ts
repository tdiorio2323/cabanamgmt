
export const demoUser = {
  id: 'demo-admin-user',
  email: 'demo@cabana.local',
  role: 'admin',
  user_metadata: {
    full_name: 'Demo Admin',
  },
};

export const demoTalent = [
  {
    id: 'talent-1',
    first_name: 'Sarah',
    last_name: 'Jenkins',
    email: 'sarah.j@example.com',
    status: 'active',
    verification_status: 'verified',
    bio: 'Lifestyle and wellness creator based in LA.',
    instagram_handle: '@sarahj_life',
    follower_count: 150000,
    rate_card: { post: 1500, story: 500 },
    created_at: '2023-01-15T10:00:00Z',
  },
  {
    id: 'talent-2',
    first_name: 'Mike',
    last_name: 'Chen',
    email: 'mike.c@example.com',
    status: 'pending',
    verification_status: 'pending_id',
    bio: 'Tech reviewer and gadget enthusiast.',
    instagram_handle: '@techwithmike',
    follower_count: 85000,
    rate_card: { post: 2000, video: 3500 },
    created_at: '2023-02-20T14:30:00Z',
  },
  {
    id: 'talent-3',
    first_name: 'Elena',
    last_name: 'Rodriguez',
    email: 'elena.r@example.com',
    status: 'active',
    verification_status: 'verified',
    bio: 'Fashion model and travel blogger.',
    instagram_handle: '@elena_travels',
    follower_count: 500000,
    rate_card: { post: 5000, story: 1500 },
    created_at: '2023-03-10T09:15:00Z',
  },
];

export const demoClients = [
  {
    id: 'client-1',
    name: 'Glow Cosmetics',
    industry: 'Beauty',
    contact_email: 'marketing@glowcosmetics.com',
    status: 'active',
    created_at: '2023-01-05T11:00:00Z',
  },
  {
    id: 'client-2',
    name: 'TechNova',
    industry: 'Technology',
    contact_email: 'partnerships@technova.io',
    status: 'active',
    created_at: '2023-02-15T16:20:00Z',
  },
];

export const demoBookings = [
  {
    id: 'booking-1',
    talent_id: 'talent-1',
    client_id: 'client-1',
    status: 'confirmed',
    project_name: 'Summer Glow Campaign',
    amount: 3500,
    start_date: '2023-06-01',
    end_date: '2023-06-15',
    created_at: '2023-05-20T10:00:00Z',
  },
  {
    id: 'booking-2',
    talent_id: 'talent-2',
    client_id: 'client-2',
    status: 'requested',
    project_name: 'Q3 Product Launch',
    amount: 5000,
    start_date: '2023-07-10',
    end_date: '2023-07-12',
    created_at: '2023-06-05T14:00:00Z',
  },
  {
    id: 'booking-3',
    talent_id: 'talent-3',
    client_id: 'client-1',
    status: 'completed',
    project_name: 'Spring Collection',
    amount: 7500,
    start_date: '2023-04-01',
    end_date: '2023-04-05',
    created_at: '2023-03-15T09:00:00Z',
  },
];

export const demoStats = {
  total_revenue: 150000,
  active_bookings: 12,
  pending_requests: 5,
  total_talent: 45,
};
