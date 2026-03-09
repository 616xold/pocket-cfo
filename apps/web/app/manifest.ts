import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pocket CTO",
    short_name: "Pocket CTO",
    description: "Evidence-native engineering mission control.",
    display: "standalone",
    background_color: "#0b1020",
    theme_color: "#0b1020",
    start_url: "/",
  };
}
