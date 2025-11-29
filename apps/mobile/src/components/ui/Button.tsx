import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { colors } from '../../theme/colors';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'default', 
  size = 'default', 
  loading = false,
  style, 
  children,
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.base, 
        styles[variant], 
        size === 'default' ? styles.defaultSize : styles[size], 
        disabled && styles.disabled,
        style
      ]} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' || variant === 'secondary' ? colors.foreground : colors.primaryForeground} />
      ) : (
        typeof children === 'string' ? (
          <Text style={[styles.textBase, styles[`text_${variant}`]]}>{children}</Text>
        ) : children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: colors.radius,
  },
  disabled: {
    opacity: 0.5,
  },
  // Variants
  default: {
    backgroundColor: colors.primary,
  },
  destructive: {
    backgroundColor: colors.destructive,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.input,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
  },
  // Sizes
  defaultSize: {
    height: 44,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sm: {
    height: 36,
    paddingHorizontal: 12,
  },
  lg: {
    height: 50,
    paddingHorizontal: 32,
  },
  icon: {
    height: 40,
    width: 40,
  },
  // Text Styles
  textBase: {
    fontSize: 14,
    fontWeight: '500',
  },
  text_default: {
    color: colors.primaryForeground,
  },
  text_destructive: {
    color: colors.destructiveForeground,
  },
  text_outline: {
    color: colors.foreground,
  },
  text_secondary: {
    color: colors.secondaryForeground,
  },
  text_ghost: {
    color: colors.foreground,
  },
  text_link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
