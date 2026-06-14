import type { Match } from "@/lib/types";

const FOOTBALL_DATA_URL =
  "https://api.football-data.org/v4/competitions/WC/matches";

/**
 * Fetches matches from football-data.org API, with fallback mock data.
 * Caches with 60-second revalidation.
 */
export async function fetchMatches(): Promise<Match[]> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  // If no API key, return mock data
  if (!apiKey || apiKey === "your_key_from_football-data.org") {
    return getMockMatches();
  }

  try {
    const res = await fetch(FOOTBALL_DATA_URL, {
      headers: { "X-Auth-Token": apiKey },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`football-data.org returned ${res.status}, using mock data`);
      return getMockMatches();
    }

    const data = await res.json();

    if (!data.matches || !Array.isArray(data.matches)) {
      return getMockMatches();
    }

    return data.matches.map(normalizeMatch).filter(Boolean) as Match[];
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return getMockMatches();
  }
}

/**
 * Fetches a single match by ID.
 */
export async function fetchMatch(id: string): Promise<Match | null> {
  const matches = await fetchMatches();
  return matches.find((m) => m.id === id) ?? null;
}

interface APIMatch {
  id: number;
  utcDate: string;
  status: string;
  stage: string;
  group: string | null;
  matchday: number | null;
  venue: string;
  homeTeam: { name: string; shortName?: string; tla?: string };
  awayTeam: { name: string; shortName?: string; tla?: string };
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime?: { home: number | null; away: number | null };
    regularTime?: { home: number | null; away: number | null };
  };
}

function normalizeMatch(apiMatch: APIMatch): Match | null {
  try {
    if (!apiMatch.homeTeam?.name || !apiMatch.awayTeam?.name) return null;

    return {
      id: String(apiMatch.id),
      homeTeam: {
        name: apiMatch.homeTeam.name,
        code: apiMatch.homeTeam.tla || apiMatch.homeTeam.shortName || apiMatch.homeTeam.name.slice(0, 3).toUpperCase(),
        flag: "",
      },
      awayTeam: {
        name: apiMatch.awayTeam.name,
        code: apiMatch.awayTeam.tla || apiMatch.awayTeam.shortName || apiMatch.awayTeam.name.slice(0, 3).toUpperCase(),
        flag: "",
      },
      kickoff: apiMatch.utcDate || new Date().toISOString(),
      status: mapStatus(apiMatch.status),
      score: {
        home: apiMatch.score?.fullTime?.home ?? apiMatch.score?.regularTime?.home ?? null,
        away: apiMatch.score?.fullTime?.away ?? apiMatch.score?.regularTime?.away ?? null,
      },
      stage: apiMatch.stage || "GROUP_STAGE",
      group: apiMatch.group || null,
      venue: apiMatch.venue || "TBD",
      matchDay: apiMatch.matchday ?? null,
    };
  } catch {
    return null;
  }
}

function mapStatus(status: string): Match["status"] {
  switch (status) {
    case "SCHEDULED":
    case "TIMED":
      return "TIMED";
    case "LIVE":
    case "IN_PLAY":
      return "LIVE";
    case "PAUSED":
      return "LIVE";
    case "FINISHED":
      return "FINISHED";
    case "AWARDED":
      return "FINISHED";
    case "POSTPONED":
      return "SCHEDULED";
    default:
      return "SCHEDULED";
  }
}

// --- Mock Data for Development ---

function getMockMatches(): Match[] {
  const now = new Date();
  const day = 86400000; // ms in a day

  return [
    {
      id: "mock-1",
      homeTeam: { name: "Brazil", code: "BRA", flag: "" },
      awayTeam: { name: "Argentina", code: "ARG", flag: "" },
      kickoff: new Date(now.getTime() - 0.5 * day).toISOString(),
      status: "LIVE",
      score: { home: 2, away: 1 },
      stage: "GROUP_STAGE",
      group: "Group A",
      venue: "Estádio do Maracanã, Rio de Janeiro",
      matchDay: 1,
    },
    {
      id: "mock-2",
      homeTeam: { name: "France", code: "FRA", flag: "" },
      awayTeam: { name: "England", code: "ENG", flag: "" },
      kickoff: new Date(now.getTime() + 2 * day + 7200000).toISOString(),
      status: "TIMED",
      score: { home: null, away: null },
      stage: "GROUP_STAGE",
      group: "Group B",
      venue: "Stade de France, Paris",
      matchDay: 1,
    },
    {
      id: "mock-3",
      homeTeam: { name: "Germany", code: "GER", flag: "" },
      awayTeam: { name: "Spain", code: "ESP", flag: "" },
      kickoff: new Date(now.getTime() + 3 * day).toISOString(),
      status: "TIMED",
      score: { home: null, away: null },
      stage: "GROUP_STAGE",
      group: "Group C",
      venue: "Allianz Arena, Munich",
      matchDay: 2,
    },
    {
      id: "mock-4",
      homeTeam: { name: "Portugal", code: "POR", flag: "" },
      awayTeam: { name: "Netherlands", code: "NED", flag: "" },
      kickoff: new Date(now.getTime() + 3 * day + 7200000).toISOString(),
      status: "TIMED",
      score: { home: null, away: null },
      stage: "GROUP_STAGE",
      group: "Group D",
      venue: "Estádio da Luz, Lisbon",
      matchDay: 2,
    },
    {
      id: "mock-5",
      homeTeam: { name: "USA", code: "USA", flag: "" },
      awayTeam: { name: "Mexico", code: "MEX", flag: "" },
      kickoff: new Date(now.getTime() + 5 * day).toISOString(),
      status: "TIMED",
      score: { home: null, away: null },
      stage: "GROUP_STAGE",
      group: "Group E",
      venue: "MetLife Stadium, New Jersey",
      matchDay: 3,
    },
    {
      id: "mock-6",
      homeTeam: { name: "Morocco", code: "MAR", flag: "" },
      awayTeam: { name: "Senegal", code: "SEN", flag: "" },
      kickoff: new Date(now.getTime() + 5 * day + 7200000).toISOString(),
      status: "TIMED",
      score: { home: null, away: null },
      stage: "GROUP_STAGE",
      group: "Group F",
      venue: "Stade Mohammed V, Casablanca",
      matchDay: 3,
    },
  ];
}
