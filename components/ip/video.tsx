"use client"
import { useState } from "react";

export default function Video() {
  return (
    <video className="w-full h-full" preload="none"  autoPlay={true} muted>
      <source src="/ip-tracker.mp4" type="video/mp4"  />
    </video>
  );
}
