import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'lead' | 'large' | 'small' | 'muted';
}

export function Text({ style, variant = 'p', ...props }: TextProps) {
  return (
    <RNText style={[styles[variant], style]} {...props} />
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32, // scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl
    fontWeight: '800',
    color: colors.foreground,
    letterSpacing: -1,
  },
  h2: {
    fontSize: 24, // scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0
    fontWeight: '600',
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 20, // scroll-m-20 text-2xl font-semibold tracking-tight
    fontWeight: '600',
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  h4: {
    fontSize: 18, // scroll-m-20 text-xl font-semibold tracking-tight
    fontWeight: '600',
    color: colors.foreground,
  },
  p: {
    fontSize: 16, // leading-7 [&:not(:first-child)]:mt-6
    lineHeight: 24,
    color: colors.foreground,
  },
  lead: {
    fontSize: 20, // text-xl text-muted-foreground
    color: colors.mutedForeground,
  },
  large: {
    fontSize: 18, // text-lg font-semibold
    fontWeight: '600',
    color: colors.foreground,
  },
  small: {
    fontSize: 14, // text-sm font-medium leading-none
    fontWeight: '500',
    color: colors.foreground,
  },
  muted: {
    fontSize: 14, // text-sm text-muted-foreground
    color: colors.mutedForeground,
  },
});
