import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const AccountDeleteIcon = ({ size = 24, color = '#cccccc' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G transform="translate(-1, -1)"> {/* Ajuste para centralizar */}
      <Path
        d="M4,20 A1,1 0 0,0 5,21 H19 A1,1 0 0,0 20,20 V6 H4 Z M6,6 H18 V20 H6 Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8,4 H16 V2 H8 Z"
        stroke={color}
        strokeWidth={2}
      />
      <G transform="translate(0, 0)">
        <Path d="M8,9 H10 V17 H8 Z" fill={color} />
        <Path d="M11,9 H13 V17 H11 Z" fill={color} />
        <Path d="M14,9 H16 V17 H14 Z" fill={color} />
      </G>
    </G>
  </Svg>
);

export default AccountDeleteIcon;