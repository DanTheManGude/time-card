import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Time Card",
    short_name: "Time Card",
    description: "Time Card estimates for pay period",
    start_url: "/",
    lang: "en",
    display: "standalone",
    theme_color: "#121212",
    background_color: "#121212",
    icons: [
      {
        src: "favicon.ico",
        type: "image/x-icon",
        sizes: "48x48",
      },
      { src: "apple-icon.png", type: "image/png", sizes: "900x900" },
    ],
  };
}
