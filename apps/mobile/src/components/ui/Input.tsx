import React from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, label, error, ...props }, ref) => {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            error && styles.inputError,
            style
          ]}
          placeholderTextColor={colors.mutedForeground}
          {...props}
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: colors.radius,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.destructive,
  },
  error: {
    fontSize: 12,
    color: colors.destructive,
  },
});
