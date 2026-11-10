import type { Metadata } from "next";
import { MotionLab } from "@/components/motion-lab";
export const metadata: Metadata = { title: "Animation Examples — FORME", robots: { index: false, follow: false } };
export default function MotionPage() { return <MotionLab />; }
