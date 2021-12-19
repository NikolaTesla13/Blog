import { VitePWA } from "vite-plugin-pwa";

export default {
  plugins: [
    VitePWA({
      includeAssets: ["favicon.ico", "robots.txt"],
      manifest: {
        name: "Asandei Stefan's Portfolio",
        short_name: "Asandei Stefan",
        description: "The Portfolio of Asandei Stefan.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "favicon.ico",
            sizes: "192x192",
            type: "image/x-icon",
          },
          {
            src: "favicon.ico",
            sizes: "512x512",
            type: "image/x-icon",
          },
          {
            src: "favicon.ico",
            sizes: "512x512",
            type: "image/x-icon",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
};
