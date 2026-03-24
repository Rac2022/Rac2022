"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  type DeviceRecord,
  getDeviceByImei,
  generateListingCopy,
} from "@/data/devices";
import type { User } from "@/lib/auth";
import { QRCodeCanvas } from "@/components/QRCodeCanvas";

export default function DeviceManagePage() {
  const router = useRouter();
  const params = useParams();
  const imei = params.imei as string;

  const [user, setUser] = useState<User | null>(null);
  const [device, setDevice] = useState<DeviceRecord | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("plugpass_user");
    if (!stored) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(stored) as User);

    const d = getDeviceByImei(imei);
    if (!d) {
      router.push("/dashboard");
      return;
    }
    setDevice(d);
  }, [imei, router]);

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  if (!device || !user) return null;

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/public/${device.imei}`
      : `/public/${device.imei}`;
  const listingCopy = generateListingCopy(device);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 transition hover:text-slate-600"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href={`/public/${device.imei}`}
            className="text-sm font-medium text-plug-green transition hover:text-plug-green-dark"
          >
            View Public Page →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-plug-navy">
            {device.brand} {device.model}
          </h1>
          <p className="text-sm text-slate-400">IMEI: {device.imei}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Device Info */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">
              Device Details
            </h2>
            <div className="space-y-3">
              {[
                ["Model", `${device.brand} ${device.model}`],
                ["Storage", device.storage],
                ["Color", device.color],
                ["Cosmetic Grade", device.cosmeticGrade],
                ["Battery Health", `${device.batteryHealth}%`],
                ["Carrier Status", device.carrierStatus],
                ["Warranty", device.warrantyStatus],
                ["Certified", device.certifiedDate],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium text-plug-navy">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code & Links */}
          <div className="space-y-4">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-slate-700">
                QR Code
              </h2>
              <div className="flex justify-center">
                <QRCodeCanvas value={publicUrl} size={180} />
              </div>
              <p className="mt-3 text-center text-xs text-slate-400">
                Scan to view the buyer trust page
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">
                Shareable Link
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
                />
                <button
                  onClick={() => copyToClipboard(publicUrl, "link")}
                  className="rounded-lg bg-plug-green px-3 py-2 text-xs font-medium text-white transition hover:bg-plug-green-dark"
                >
                  {copied === "link" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Listing Copy */}
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              Listing Copy (Facebook / eBay)
            </h2>
            <button
              onClick={() => copyToClipboard(listingCopy, "listing")}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
            >
              {copied === "listing" ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-sans">
              {listingCopy}
            </pre>
          </div>
        </div>

        {/* Diagnostic Summary */}
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Diagnostic Summary
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {device.diagnosticSummary}
          </p>
        </div>
      </main>
    </div>
  );
}
