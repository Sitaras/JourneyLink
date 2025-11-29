import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheet } from './BottomSheet';
import { Text } from './Text';
import { Button } from './Button';
import { colors } from '../../theme/colors';

interface ConfirmationSheetProps {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmVariant?: 'default' | 'destructive';
  loading?: boolean;
}

export const ConfirmationSheet = forwardRef<BottomSheetModal, ConfirmationSheetProps>(
  ({ title, description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, confirmVariant = 'default', loading }, ref) => {
    
    const handleCancel = () => {
      if (onCancel) onCancel();
      // @ts-ignore
      ref?.current?.dismiss();
    };

    return (
      <BottomSheet ref={ref} snapPoints={['30%']}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text variant="h3" style={styles.title}>{title}</Text>
            {description && <Text variant="muted" style={styles.description}>{description}</Text>}
          </View>
          
          <View style={styles.buttonContainer}>
            <Button variant="outline" onPress={handleCancel} style={styles.button}>
              {cancelText}
            </Button>
            <Button variant={confirmVariant} onPress={onConfirm} loading={loading} style={styles.button}>
              {confirmText}
            </Button>
          </View>
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    gap: 8,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
