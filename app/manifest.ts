import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Time Card App",
    short_name: "Time Card",
    description: "Time Card estimates for pay period",
    start_url: "/",
    lang: "en",
    display: "standalone",
    background_color: "#000",
    theme_color: "#fff",
    icons: [
      {
        src: "favicon.ico",
        type: "image/x-icon",
        sizes: "48x48",
      },
      { src: "apple-icon.png", type: "image/png", sizes: "1000x1000" },
    ],
  };
}
