import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vxupacabyonpnkxhmkzh.supabase.co"
      },
      {
        protocol: "https",
        hostname: "**.supabase.co"
      },
      {
        protocol: "https",
        hostname: "http2.mlstatic.com"
      },
      {
        protocol: "https",
        hostname: "down-br.img.susercontent.com"
      }
    ]
  },
  async redirects() {
    return [
      {
        source: "/hello-world",
        destination: "/",
        permanent: true
      },
      {
        source: "/a-sua-loja-no-mercado-pago/home",
        destination: "/",
        permanent: true
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.tudoexpressbrasil.com.br"
          }
        ],
        destination: "https://tudoexpressbrasil.com.br/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
