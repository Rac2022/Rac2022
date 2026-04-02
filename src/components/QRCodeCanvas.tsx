"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeCanvasProps {
  value: string;
  size?: number;
}

export function QRCodeCanvas({ value, size = 200 }: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: { dark: "#1e293b", light: "#ffffff" },
    });
  }, [value, size]);

  return <canvas ref={canvasRef} />;
}
