import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconProps } from 'react-native-vector-icons/Icon';

export const Icon = (props: IconProps) => {
  const IconComponent = Ionicons as any;
  return <IconComponent {...props} />;
};
