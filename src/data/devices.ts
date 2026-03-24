export interface DeviceRecord {
  imei: string;
  model: string;
  brand: string;
  storage: string;
  color: string;
  cosmeticGrade: "A+" | "A" | "B+" | "B" | "C";
  batteryHealth: number; // percentage
  carrierStatus: "Unlocked" | "Locked" | string;
  diagnosticSummary: string;
  warrantyStatus: string;
  certifiedDate: string;
  resellerId: string;
  sellerName: string;
  sellerContact: string;
  imageUrl?: string;
}

// Mock certification data — swap with real API later
export const mockDevices: DeviceRecord[] = [
  {
    imei: "353456789012345",
    model: "iPhone 14 Pro",
    brand: "Apple",
    storage: "128GB",
    color: "Space Black",
    cosmeticGrade: "A",
    batteryHealth: 92,
    carrierStatus: "Unlocked",
    diagnosticSummary:
      "All sensors passed. Touch, display, cameras, speakers, microphone — all functional. No water damage detected.",
    warrantyStatus: "90-day Plug Warranty",
    certifiedDate: "2026-03-20",
    resellerId: "demo",
    sellerName: "PhoneFlip Pro",
    sellerContact: "tel:+15551234567",
  },
  {
    imei: "861234567890123",
    model: "Samsung Galaxy S23",
    brand: "Samsung",
    storage: "256GB",
    color: "Phantom Black",
    cosmeticGrade: "A+",
    batteryHealth: 97,
    carrierStatus: "Unlocked",
    diagnosticSummary:
      "Flawless diagnostics. All 47 test points passed. No prior repairs detected.",
    warrantyStatus: "90-day Plug Warranty",
    certifiedDate: "2026-03-18",
    resellerId: "demo",
    sellerName: "PhoneFlip Pro",
    sellerContact: "tel:+15551234567",
  },
  {
    imei: "490154203237518",
    model: "iPhone 13",
    brand: "Apple",
    storage: "64GB",
    color: "Blue",
    cosmeticGrade: "B+",
    batteryHealth: 85,
    carrierStatus: "T-Mobile",
    diagnosticSummary:
      "Minor cosmetic wear on edges. All hardware tests passed. Original screen confirmed.",
    warrantyStatus: "30-day Plug Warranty",
    certifiedDate: "2026-03-15",
    resellerId: "demo",
    sellerName: "PhoneFlip Pro",
    sellerContact: "tel:+15551234567",
  },
  {
    imei: "352789012345678",
    model: "Google Pixel 8",
    brand: "Google",
    storage: "128GB",
    color: "Hazel",
    cosmeticGrade: "A",
    batteryHealth: 94,
    carrierStatus: "Unlocked",
    diagnosticSummary:
      "All tests passed. Camera, display, connectivity all verified. Factory reset complete.",
    warrantyStatus: "90-day Plug Warranty",
    certifiedDate: "2026-03-22",
    resellerId: "demo",
    sellerName: "PhoneFlip Pro",
    sellerContact: "tel:+15551234567",
  },
];

export function getDeviceByImei(imei: string): DeviceRecord | undefined {
  return mockDevices.find((d) => d.imei === imei);
}

export function getDevicesByReseller(resellerId: string): DeviceRecord[] {
  return mockDevices.filter((d) => d.resellerId === resellerId);
}

export function generateListingCopy(device: DeviceRecord): string {
  const gradeDescriptions: Record<string, string> = {
    "A+": "Like-new condition — virtually flawless",
    A: "Excellent condition — minimal signs of use",
    "B+": "Very good condition — light cosmetic wear",
    B: "Good condition — normal signs of use",
    C: "Fair condition — visible wear but fully functional",
  };

  const gradeDesc = gradeDescriptions[device.cosmeticGrade] || "Good condition";
  const batteryEmoji = device.batteryHealth >= 90 ? "🔋" : "🪫";
  const unlocked = device.carrierStatus === "Unlocked" ? "Factory Unlocked" : device.carrierStatus;

  return `✅ Plug Verified — ${device.brand} ${device.model} | ${device.storage} | ${device.color}

${gradeDesc}. ${batteryEmoji} Battery at ${device.batteryHealth}%. ${unlocked}. Full diagnostic check passed — ${device.warrantyStatus} included.

Every device comes with a Plug Trust Pass — scan the QR code or visit the link to see the full certification report. Buy with confidence! 🛡️`;
}
