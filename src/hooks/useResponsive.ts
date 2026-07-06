import { useWindowDimensions } from "react-native";

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  // Screen breakpoints
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isWideScreen = width >= 1024;

  // Screen orientation
  const isPortrait = height >= width;
  const isLandscape = width > height;

  // Font/spacing normalization factor based on standard mobile width (375px baseline)
  const scale = width / 375;
  const normalize = (size: number, factor = 0.5) => {
    const newSize = size + (scale * size - size) * factor;
    return Math.round(newSize);
  };

  return {
    width,
    height,
    isMobile,
    isTablet,
    isWideScreen,
    isPortrait,
    isLandscape,
    normalize,
  };
};
export type ResponsiveMetrics = ReturnType<typeof useResponsive>;
