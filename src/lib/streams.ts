import fs from "fs";
import path from "path";

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

const STREAMS_PATH = path.join(process.cwd(), "src/data/streams.json");

export function readStreamsConfig(): StreamsConfig {
  try {
    const raw = fs.readFileSync(STREAMS_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { channels: [], matchOverrides: {} };
  }
}

export function writeStreamsConfig(config: StreamsConfig): void {
  fs.writeFileSync(STREAMS_PATH, JSON.stringify(config, null, 2), "utf-8");
}

export function getChannelsForMatch(matchId: string): {
  channels: StreamChannel[];
  primaryChannel: string | null;
} {
  const config = readStreamsConfig();

  // Check if there's a match override
  const override = config.matchOverrides[matchId];
  if (override) {
    const channels = config.channels.filter((ch) =>
      override.channels.includes(ch.id)
    );
    return {
      channels,
      primaryChannel: override.primaryChannel || null,
    };
  }

  // Return all channels by default
  const defaultChannel = config.channels.find((ch) => ch.isDefault);
  return {
    channels: config.channels,
    primaryChannel: defaultChannel?.id || config.channels[0]?.id || null,
  };
}
