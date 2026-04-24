export const Colors = {
  // ─── Primary Scale ───────────────────────────────────────────
  primary700: '#355872',   // Dark blue  — buttons, labels, active states
  primary400: '#7AAACE',   // Mid blue   — header background, accents
  primary200: '#9CD5FF',   // Light blue — highlights, secondary accents

  // ─── Neutral ─────────────────────────────────────────────────
  neutral50: '#F7F8F0',    // Off-white  — backgrounds, card surfaces

  // ─── Background ──────────────────────────────────────────────
  backgroundPrimary: '#1F2F3A',  // Dark navy — main app background (dark mode)

  // ─── Text ────────────────────────────────────────────────────
  textPrimary: '#F7F8F0',        // Off-white — primary text on dark backgrounds
  textSecondary: '#B8C9D9',      // Muted blue-grey — subtitles, hints
  textGray: '#7A8A99',           // Gray — placeholder, disabled text
  textWhite: '#FFFFFF',          // Pure white — text on solid buttons

  // ─── Semantic / Finance ──────────────────────────────────────
  incomeGreen: '#2FBF71',        // Green  — receitas (income)
  expenseRed: '#E45858',         // Red    — despesas (expenses)

  // ─── Surfaces ────────────────────────────────────────────────
  cardBackground: '#FFFFFF',     // White  — card backgrounds
  white: '#FFFFFF',              // Pure white

  // ─── Input / Border ──────────────────────────────────────────
  inputBackground: '#F3F3F5',
  borderDefault: '#D1D5DC',
  iconMuted: '#6A7282',

  // ─── Shadow ──────────────────────────────────────────────────
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  black: '#000000',

  // ─── Aliases (backward-compat with previous tokens) ──────────
  /** @deprecated use primary700 */ primary: '#355872',
  /** @deprecated use primary400 */ primaryLight: '#7AAACE',
  /** @deprecated use neutral50  */ background: '#F7F8F0',
  /** @deprecated use textGray   */ textMuted: '#7A8A99',
  /** @deprecated use primary700 */ textLabel: '#355872',
};