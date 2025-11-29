import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { colors } from '../../theme/colors';

interface BadgeProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', style, children, ...props }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant], style]} {...props}>
      <Text style={[styles.textBase, styles[`text_${variant}`]]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999, // full
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  // Variants
  default: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderWidth: 0,
  },
  destructive: {
    backgroundColor: colors.destructive,
    borderWidth: 0,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.foreground,
  },
  // Text Styles
  textBase: {
    fontSize: 12,
    fontWeight: '600',
  },
  text_default: {
    color: colors.primaryForeground,
  },
  text_secondary: {
    color: colors.secondaryForeground,
  },
  text_destructive: {
    color: colors.destructiveForeground,
  },
  text_outline: {
    color: colors.foreground,
  },
});
