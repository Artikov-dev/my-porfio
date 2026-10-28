// CV files in /public, one per site language. Every resume link (hero, /resume page,
// command palette, terminal) reads from here, so replacing a CV means editing only this map.
const RESUME_FILES = {
  en: 'Rozimuhammadkhon_Artikov_CV_EN.pdf',
  uz: 'Rozimuhammadxon_Artikov_CV_UZ.pdf',
  ru: "Ro'zimuhammad CV Resume (rus).pdf",
} as const;

export type ResumeLanguage = keyof typeof RESUME_FILES;

export const getResume = (language: string) => {
  const fileName = RESUME_FILES[language as ResumeLanguage] ?? RESUME_FILES.en;
  return { url: `/${encodeURIComponent(fileName)}`, fileName };
};
