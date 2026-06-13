export interface Team {
  name: string;
  code: string;
  flag: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  kickoff: string;
  status: "SCHEDULED" | "LIVE" | "FINISHED" | "TIMED" | "IN_PLAY" | "PAUSED" | "POSTPONED";
  score: { home: number | null; away: number | null };
  stage: string;
  group: string | null;
  venue: string;
  matchDay: number | null;
}

export interface StreamChannel {
  id: string;
  name: string;
  country: string;
  logo: string;
  streamUrl: string;
  type: "hls" | "iframe";
  embedUrl?: string;
  youtubeVideoId?: string;
  isDefault: boolean;
}

export interface MatchOverride {
  channels: string[];
  primaryChannel: string;
}

export interface StreamsConfig {
  channels: StreamChannel[];
  matchOverrides: Record<string, MatchOverride>;
}
