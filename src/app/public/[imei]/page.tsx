"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { type DeviceRecord, getDeviceByImei } from "@/data/devices";
import { QRCodeCanvas } from "@/components/QRCodeCanvas";

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-plug-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function BatteryBar({ health }: { health: number }) {
  const color =
    health >= 90
      ? "bg-emerald-500"
      : health >= 80
        ? "bg-green-500"
        : health >= 70
          ? "bg-yellow-500"
          : "bg-red-500";

  return (
    <div className="flex items-center gap-3">
      <div className="h-2.5 flex-1 rounded-full bg-slate-200">
        <div
          className={`h-2.5 rounded-full ${color} transition-all`}
          style={{ width: `${health}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-plug-navy">{health}%</span>
    </div>
  );
}

export default function PublicDevicePage() {
  const params = useParams();
  const imei = params.imei as string;
  const [device, setDevice] = useState<DeviceRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const d = getDeviceByImei(imei);
    if (d) {
      setDevice(d);
    } else {
      setNotFound(true);
    }
  }, [imei]);

  if (notFound) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-plug-navy">Device Not Found</h1>
          <p className="mt-2 text-slate-400">
            This IMEI is not registered in our system.
          </p>
        </div>
      </main>
    );
  }

  if (!device) return null;

  const publicUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `/public/${device.imei}`;

  const gradeLabels: Record<string, string> = {
    "A+": "Like New",
    A: "Excellent",
    "B+": "Very Good",
    B: "Good",
    C: "Fair",
  };

  return (
    <main className="min-h-screen pb-24">
      {/* Trust Header */}
      <div className="bg-plug-green px-4 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-lg">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-sm font-bold">
              P
            </div>
            <span className="text-sm font-semibold">Plug Trust Pass</span>
          </div>
          <h1 className="text-2xl font-bold">
            {device.brand} {device.model}
          </h1>
          <p className="mt-1 text-sm text-white/80">
            {device.storage} · {device.color}
          </p>
        </div>
      </div>

      <div className="mx-auto -mt-4 max-w-lg px-4">
        {/* Verified Badge */}
        <div
          className="mb-4 flex items-center gap-3 rounded-xl bg-white p-4 shadow-md"
          style={{ animation: "pulse-badge 2s ease-in-out infinite" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-plug-green">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-plug-green">Plug Verified</p>
            <p className="text-xs text-slate-400">
              Certified on {device.certifiedDate} · Sold by {device.sellerName}
            </p>
          </div>
        </div>

        {/* Device Specs */}
        <div className="mb-4 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">
            Device Specifications
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Model</span>
              <span className="font-medium text-plug-navy">
                {device.brand} {device.model}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Storage</span>
              <span className="font-medium text-plug-navy">{device.storage}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Color</span>
              <span className="font-medium text-plug-navy">{device.color}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Cosmetic Grade</span>
              <span className="font-medium text-plug-navy">
                {device.cosmeticGrade} — {gradeLabels[device.cosmeticGrade]}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Carrier</span>
              <span className="font-medium text-plug-navy">
                {device.carrierStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Battery Health */}
        <div className="mb-4 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Battery Health
          </h2>
          <BatteryBar health={device.batteryHealth} />
        </div>

        {/* Diagnostics */}
        <div className="mb-4 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Diagnostic Report
          </h2>
          <div className="space-y-2">
            {[
              "Display & Touch",
              "Front & Rear Cameras",
              "Speakers & Microphone",
              "WiFi & Bluetooth",
              "Charging Port",
              "Face ID / Biometrics",
              "Sensors & GPS",
            ].map((test) => (
              <div key={test} className="flex items-center gap-2 text-sm">
                <CheckIcon />
                <span className="text-slate-600">{test}</span>
                <span className="ml-auto text-xs font-medium text-plug-green">
                  Passed
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg bg-slate-50 p-3">
            <p className="text-xs leading-relaxed text-slate-500">
              {device.diagnosticSummary}
            </p>
          </div>
        </div>

        {/* Warranty */}
        <div className="mb-4 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">
            Warranty
          </h2>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-plug-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium text-plug-navy">
              {device.warrantyStatus}
            </span>
          </div>
        </div>

        {/* QR Code */}
        <div className="mb-4 rounded-xl bg-white p-5 shadow-sm text-center">
          <QRCodeCanvas value={publicUrl} size={140} />
          <p className="mt-2 text-xs text-slate-400">
            IMEI: {device.imei}
          </p>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4">
        <div className="mx-auto max-w-lg">
          <a
            href={device.sellerContact}
            className="block w-full rounded-xl bg-plug-green py-3.5 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-plug-green-dark"
          >
            Contact Seller — {device.sellerName}
          </a>
        </div>
      </div>
    </main>
  );
}
