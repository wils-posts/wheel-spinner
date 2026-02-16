function hslToString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function generateSliceColors(count: number, isDark = false): string[] {
  if (count === 0) return [];

  const colors: string[] = [];
  const baseLightness = isDark ? 38 : 65;

  for (let i = 0; i < count; i++) {
    const hue = (i * 360 / count) % 360;
    const saturation = i % 2 === 0 ? 45 : 35;
    const lightness = baseLightness + (i % 3 === 0 ? 5 : i % 3 === 1 ? -3 : 0);
    colors.push(hslToString(hue, saturation, lightness));
  }

  return colors;
}
