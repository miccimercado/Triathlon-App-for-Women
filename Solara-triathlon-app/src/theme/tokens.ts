export const colors = {
  ink: '#24312E',
  inkMuted: '#65716D',
  forest: '#315C53',
  forestDeep: '#203E38',
  sage: '#A8BDB1',
  sagePale: '#E3ECE6',
  cream: '#F8F3ED',
  canvas: '#FCFAF7',
  white: '#FFFFFF',
  peach: '#E8B6A2',
  peachPale: '#F7E5DE',
  lilac: '#ACA5C7',
  lilacPale: '#EBE8F3',
  gold: '#D8A353',
  blue: '#6D9FA6',
  bluePale: '#E1EFF0',
  red: '#AE574D',
  redPale: '#F7E3E0',
  border: '#E7E1D9',
  shadow: '#203E3814',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 10, md: 16, lg: 22, xl: 30, pill: 999 } as const;
export const type = {
  display: { fontSize: 38, lineHeight: 43, fontWeight: '600' as const, letterSpacing: -1.2 },
  h1: { fontSize: 30, lineHeight: 36, fontWeight: '600' as const, letterSpacing: -0.7 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const, letterSpacing: -0.35 },
  h3: { fontSize: 17, lineHeight: 23, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' as const },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '700' as const, letterSpacing: 0.7 },
} as const;

export const shadows = {
  card: { shadowColor: colors.ink, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 18, elevation: 2 },
};

