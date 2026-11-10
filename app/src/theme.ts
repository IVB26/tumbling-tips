// Design tokens ported from the HTML prototype.
export const light = {
  pink: '#E6246E', pinkDeep: '#B5124F', blush: '#FFE3EE', petal: '#FFC2D9',
  ink: '#3A0A20', ink2: '#7A4A5E', bg: '#FFF6F9', surface: '#FFFFFF', line: '#F5CFDD',
  onPink: '#FFFFFF', good: '#1F8A5B', xmas: '#B5124F', holly: '#1E8E5A',
};
export const dark: typeof light = {
  pink: '#FF4F8E', pinkDeep: '#FF8AB3', blush: '#3D1427', petal: '#5C1E3A',
  ink: '#FFE8F0', ink2: '#D9A6BA', bg: '#1E0A14', surface: '#2A0F1D', line: '#4A1B31',
  onPink: '#FFFFFF', good: '#5CD39B', xmas: '#8E1442', holly: '#2FA36C',
};
export type Colors = typeof light;
export const fonts = {
  display: 'BricolageGrotesque_800ExtraBold',
  displayMid: 'BricolageGrotesque_600SemiBold',
  body: 'Figtree_400Regular',
  bodyBold: 'Figtree_700Bold',
};
