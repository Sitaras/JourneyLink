import React from 'react';
import { View, Text, StyleSheet, Image, ImageProps } from 'react-native';
import { colors } from '../../theme/colors';

interface AvatarProps {
  source?: ImageProps['source'];
  fallback?: string;
  size?: number;
}

export function Avatar({ source, fallback, size = 40 }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {source ? (
        <Image source={source} style={[styles.image, { borderRadius: size / 2 }]} />
      ) : (
        <Text style={[styles.fallback, { fontSize: size * 0.4 }]}>{fallback?.slice(0, 2).toUpperCase()}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    color: colors.secondaryForeground,
    fontWeight: '600',
  },
});
