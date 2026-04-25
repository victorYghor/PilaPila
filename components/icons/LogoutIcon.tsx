import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  frameColor?: string;
}

const LogoutIcon = ({ size = 24, color = '#cccccc', frameColor = '#444444' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect width="24" height="24" rx="4" fill={frameColor} />
    <Path
      d="M10,8 H18 L15,11 H13 L15,9 H10 Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5,4 V20 H12 V18 H7 V6 H12 V4 H5 Z"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

export default LogoutIcon;