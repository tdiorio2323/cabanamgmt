import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {

  async redirects() {
    return [
      {
        source: '/invites/new',
        destination: '/dashboard/invites/new',
        permanent: true,
      },
      {
        source: '/invites/resend',
        destination: '/dashboard/invites/resend',
        permanent: true,
      },
      {
        source: '/invites/revoke',
        destination: '/dashboard/invites/revoke',
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
