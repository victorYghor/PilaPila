import { Colors } from '@/constants/colors';
import React from 'react';
import { DimensionValue, View } from 'react-native';

type ProgressBarProps = {
  progress: number;
  width?: DimensionValue;
  height?: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  width = '80%',
  height = 20,
}) => {
  const normalizedProgress = Math.max(0, Math.min(1, progress));

  return (
    <View
      style={{
        width,
        height,
        backgroundColor: Colors.white,
        borderRadius: height / 2,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${normalizedProgress * 100}%`,
          height: height,
          backgroundColor: Colors.black,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
};