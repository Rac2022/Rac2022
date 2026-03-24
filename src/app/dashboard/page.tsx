"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@/lib/auth";
import {
  type DeviceRecord,
  getDevicesByReseller,
  mockDevices,
} from "@/data/devices";

function GradeColor({ grade }: { grade: string }) {
  const colors: Record<string, string> = {
    "A+": "bg-emerald-100 text-emerald-700",
    A: "bg-green-100 text-green-700",
    "B+": "bg-blue-100 text-blue-700",
    B: "bg-yellow-100 text-yellow-700",
    C: "bg-orange-100 text-orange-700",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${colors[grade] || "bg-gray-100 text-gray-700"}`}
    >
      Grade {grade}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [imeiInput, setImeiInput] = useState("");
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("plugpass_user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(stored) as User;
    setUser(parsed);
    setDevices(getDevicesByReseller(parsed.id));
  }, [router]);

  function handleAddDevice(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = imeiInput.trim();
    if (!trimmed) return;

    // Check if device already in list
    if (devices.find((d) => d.imei === trimmed)) {
      setImeiInput("");
      return;
    }

    // Check mock database first
    const existing = mockDevices.find((d) => d.imei === trimmed);
    if (existing) {
      setDevices((prev) => [existing, ...prev]);
    } else {
      // Generate a mock device for any IMEI
      const newDevice: DeviceRecord = {
        imei: trimmed,
        model: "iPhone 15",
        brand: "Apple",
        storage: "128GB",
        color: "Black",
        cosmeticGrade: "A",
        batteryHealth: 91,
        carrierStatus: "Unlocked",
        diagnosticSummary:
          "All 42 diagnostic tests passed. No issues detected.",
        warrantyStatus: "90-day Plug Warranty",
        certifiedDate: new Date().toISOString().split("T")[0],
        resellerId: user?.id || "demo",
        sellerName: user?.businessName || "Reseller",
        sellerContact: "tel:+15551234567",
      };
      mockDevices.push(newDevice);
      setDevices((prev) => [newDevice, ...prev]);
    }

    setImeiInput("");
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  }

  function handleLogout() {
    localStorage.removeItem("plugpass_user");
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-plug-green text-sm font-bold text-white">
              P
            </div>
            <div>
              <h1 className="text-lg font-bold text-plug-navy">
                {user.businessName}
              </h1>
              <p className="text-xs text-slate-400">Plug Trust Pass Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 transition hover:text-slate-600"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Add Device */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Add New Device
          </h2>
          <form onSubmit={handleAddDevice} className="flex gap-3">
            <input
              type="text"
              value={imeiInput}
              onChange={(e) => setImeiInput(e.target.value)}
              placeholder="Enter or scan IMEI number..."
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-plug-green focus:ring-2 focus:ring-plug-green/20 focus:outline-none"
              pattern="[0-9]{15}"
              title="IMEI must be 15 digits"
              maxLength={15}
            />
            <button
              type="submit"
              className="rounded-lg bg-plug-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-plug-green-dark"
            >
              Certify
            </button>
          </form>
          {showAdded && (
            <p className="mt-2 text-sm text-plug-green font-medium">
              Device added successfully!
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-plug-navy">{devices.length}</p>
            <p className="text-xs text-slate-400">Total Devices</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-plug-green">
              {devices.filter((d) => ["A+", "A"].includes(d.cosmeticGrade)).length}
            </p>
            <p className="text-xs text-slate-400">Grade A+/A</p>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-plug-blue">
              {devices.filter((d) => d.carrierStatus === "Unlocked").length}
            </p>
            <p className="text-xs text-slate-400">Unlocked</p>
          </div>
        </div>

        {/* Device List */}
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Certified Devices
        </h2>
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.imei}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-plug-navy">
                    {device.brand} {device.model}
                  </h3>
                  <GradeColor grade={device.cosmeticGrade} />
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {device.storage} · {device.color} · IMEI: {device.imei}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/device/${device.imei}`}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
                >
                  Manage
                </Link>
                <Link
                  href={`/public/${device.imei}`}
                  className="rounded-lg bg-plug-green/10 px-3 py-1.5 text-xs font-medium text-plug-green transition hover:bg-plug-green/20"
                >
                  Public Page
                </Link>
              </div>
            </div>
          ))}

          {devices.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-slate-400">
                No devices yet. Enter an IMEI above to certify your first device.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
