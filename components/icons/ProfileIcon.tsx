import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const ProfileIcon = ({ size = 24, color = '#ffffff' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="7" r="4" fill={color} />
    <Path
      d="M4,21 H20 V19 C20,16.24 16.42,14 12,14 C7.58,14 4,16.24 4,19 V21 Z"
      fill={color}
    />
  </Svg>
);

export default ProfileIcon;