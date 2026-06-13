import { format, isToday as dfIsToday, parseISO, formatDistanceToNow } from "date-fns";

export const COUNTRY_CODES: Record<string, string> = {
  Brazil: "br",
  Argentina: "ar",
  France: "fr",
  Germany: "de",
  Spain: "es",
  England: "gb-eng",
  Portugal: "pt",
  Netherlands: "nl",
  Morocco: "ma",
  USA: "us",
  Mexico: "mx",
  Canada: "ca",
  Japan: "jp",
  "South Korea": "kr",
  Australia: "au",
  Senegal: "sn",
  Uruguay: "uy",
  Colombia: "co",
  Ecuador: "ec",
  Switzerland: "ch",
  Croatia: "hr",
  Denmark: "dk",
  Belgium: "be",
  Poland: "pl",
  Qatar: "qa",
  "Saudi Arabia": "sa",
  Iran: "ir",
  Tunisia: "tn",
  Cameroon: "cm",
  Ghana: "gh",
  Nigeria: "ng",
  "Ivory Coast": "ci",
  "South Africa": "za",
  Haiti: "ht",
  Scotland: "gb-sct",
  Czechia: "cz",
  Turkey: "tr",
  Sweden: "se",
  "New Zealand": "nz",
  "Bosnia and Herzegovina": "ba",
  Paraguay: "py",
  Uzbekistan: "uz",
  Jordan: "jo",
  "Cabo Verde": "cv",
  Curacao: "cw",
  Panama: "pa",
  Norway: "no",
  "Congo DR": "cd",
};

export function getFlagUrl(countryName: string): string {
  const code = COUNTRY_CODES[countryName];
  if (!code) return "";
  return `https://flagcdn.com/w40/${code}.png`;
}

export function isLive(status: string): boolean {
  return ["LIVE", "IN_PLAY", "PAUSED"].includes(status);
}

export function isFinished(status: string): boolean {
  return ["FINISHED", "AWARDED"].includes(status);
}

export function formatKickoff(iso: string): string {
  try {
    const date = parseISO(iso);
    return format(date, "MMM d, yyyy · HH:mm");
  } catch {
    return iso;
  }
}

export function formatKickoffShort(iso: string): string {
  try {
    const date = parseISO(iso);
    return format(date, "HH:mm");
  } catch {
    return iso;
  }
}

export function isToday(iso: string): boolean {
  try {
    return dfIsToday(parseISO(iso));
  } catch {
    return false;
  }
}

export function getDateGroupKey(iso: string): string {
  try {
    return format(parseISO(iso), "yyyy-MM-dd");
  } catch {
    return "unknown";
  }
}

export function formatDateGroup(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    return format(d, "EEE · MMM d").toUpperCase();
  } catch {
    return dateStr;
  }
}

export function getCountdown(iso: string): string {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true });
  } catch {
    return "";
  }
}

export function getStageLabel(stage: string): string {
  const labels: Record<string, string> = {
    GROUP_STAGE: "Group Stage",
    ROUND_OF_32: "Round of 32",
    ROUND_OF_16: "Round of 16",
    QUARTER_FINALS: "Quarter-finals",
    SEMI_FINALS: "Semi-finals",
    THIRD_PLACE: "Third Place",
    FINAL: "Final",
    PRELIMINARY_ROUND: "Preliminary Round",
    PLAYOFF_ROUND: "Playoff Round",
  };
  return labels[stage] || stage.replace(/_/g, " ");
}

export function getLocalTime(iso: string): string {
  try {
    const d = parseISO(iso);
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(d);
  } catch {
    return "";
  }
}
