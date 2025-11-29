import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Text } from './Text';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

export function CardHeader({ style, ...props }: ViewProps) {
  return <View style={[styles.header, style]} {...props} />;
}

export function CardTitle({ style, ...props }: ViewProps) {
  return <Text variant="h3" style={[styles.title, style]} {...props} />;
}

export function CardContent({ style, ...props }: ViewProps) {
  return <View style={[styles.content, style]} {...props} />;
}

export function CardFooter({ style, ...props }: ViewProps) {
  return <View style={[styles.footer, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: colors.radius,
    borderWidth: 1,
    borderColor: colors.border,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  header: {
    padding: 24,
    paddingBottom: 12,
  },
  title: {
    // Inherits h3 styles
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  footer: {
    padding: 24,
    paddingTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
