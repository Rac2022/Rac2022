// Simple mock auth — replace with real auth provider later

export interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
}

const MOCK_USERS: Record<string, User> = {
  demo: {
    id: "demo",
    name: "Demo Reseller",
    email: "demo@plugpass.io",
    businessName: "PhoneFlip Pro",
  },
};

const MOCK_PASSWORD = "demo123";

export function authenticate(
  email: string,
  password: string
): User | null {
  if (email === "demo@plugpass.io" && password === MOCK_PASSWORD) {
    return MOCK_USERS["demo"];
  }
  return null;
}

export function getUserById(id: string): User | null {
  return MOCK_USERS[id] ?? null;
}
