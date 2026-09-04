import { HardHat, BookOpen, Wrench, Flame, Snowflake, type LucideIcon } from "lucide-react";

const ICON_BY_KEYWORD: Array<{ match: RegExp; icon: LucideIcon }> = [
  { match: /ppe|safety|protect/i, icon: HardHat },
  { match: /station/i, icon: BookOpen },
  { match: /tool|hardware/i, icon: Wrench },
  { match: /fabricat/i, icon: Flame },
  { match: /ice/i, icon: Snowflake },
];

export function iconForDivision(name: string): LucideIcon {
  return ICON_BY_KEYWORD.find((e) => e.match.test(name))?.icon ?? Wrench;
}
