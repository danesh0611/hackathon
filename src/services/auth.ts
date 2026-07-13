import api, { useMockData } from "./api";
import type { LoginRequest, LoginResponse } from "@/types/api";

// ─── Mock Data ───────────────────────────────────────────────────────

const mockLoginResponse: LoginResponse = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvZmZpY2VyMSIsIm5hbWUiOiJJbnNwLiBSYWplc2ggS3VtYXIiLCJleHAiOjk5OTk5OTk5OTl9.mock",
  officer: {
    id: "OFF-001",
    name: "Insp. Rajesh Kumar",
    badge: "TN-4521",
    rank: "Inspector",
    station: "Cyber Crime Cell, Chennai",
    avatar: undefined,
  },
};

// ─── Service Functions ───────────────────────────────────────────────

export async function loginOfficer(payload: LoginRequest): Promise<LoginResponse> {
  if (useMockData()) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    if (payload.username && payload.password) {
      return mockLoginResponse;
    }
    throw new Error("Badge number and password are required");
  }

  const { data } = await api.post<LoginResponse>("/login", payload);
  return data;
}
