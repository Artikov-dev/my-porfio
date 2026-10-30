// Single source for work history: the Experience section and the terminal's `resume` command
// both read it, so the two can't drift apart (the terminal used to claim "2023 – Present").
export interface ExperienceItem {
  roleKey: string;
  companyKey: string;
  start: string; // 'YYYY-MM' or 'YYYY'
  end: string | null | undefined; // null → still working there, undefined → single year
  descKey: string;
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    roleKey: "exp5_role",
    companyKey: "exp5_comp",
    start: "2026-07", end: null,
    descKey: "exp5_desc"
  },
  {
    roleKey: "exp4_role",
    companyKey: "exp4_comp",
    start: "2026", end: undefined,
    descKey: "exp4_desc"
  },
  {
    roleKey: "exp3_role",
    companyKey: "exp3_comp",
    start: "2025-12", end: "2026-04",
    descKey: "exp3_desc"
  },
  {
    roleKey: "exp2_role",
    companyKey: "exp2_comp",
    start: "2025-07", end: "2025-09",
    descKey: "exp2_desc"
  },
  {
    roleKey: "exp1_role",
    companyKey: "exp1_comp",
    start: "2024-11", end: "2025-01",
    descKey: "exp1_desc"
  }
];

// Periods are formatted in the visitor's language
const LOCALES: Record<string, string> = { en: 'en-US', uz: 'uz-UZ', ru: 'ru-RU' };

const formatDate = (value: string, language: string) => {
  if (!value.includes('-')) return value; // year only
  const [year, month] = value.split('-').map(Number);
  return new Date(year, month - 1).toLocaleDateString(LOCALES[language] ?? 'en-US', { month: 'short', year: 'numeric' });
};

export const formatPeriod = (item: ExperienceItem, language: string, presentLabel: string) =>
  item.end === undefined
    ? formatDate(item.start, language)
    : `${formatDate(item.start, language)} – ${item.end === null ? presentLabel : formatDate(item.end, language)}`;
