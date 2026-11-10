import type { Metadata, Viewport } from "next";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/animation/smooth-scroll-provider";

export const metadata: Metadata = {
  title: "FORME — Interior Architecture & Collectible Objects",
  description: "Thoughtful spaces. Extraordinary everyday living. An interior architecture and collectible objects design concept, based on the FORME Figma design.",
};
export const viewport: Viewport = { themeColor: "#fdfdfc" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SmoothScrollProvider>{children}</SmoothScrollProvider></body></html>;
}
