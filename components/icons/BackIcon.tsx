import { Colors } from '@/constants/colors';
import { FontSize } from '@/constants/metrics';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

type BackIconProps = {
  size?: number;
  color?: string;
};

export const BackIcon: React.FC<BackIconProps> = ({
  size = FontSize.xl * 2,
  color = Colors.black,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
