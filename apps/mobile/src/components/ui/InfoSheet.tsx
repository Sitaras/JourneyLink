import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheet } from './BottomSheet';
import { Text } from './Text';
import { Button } from './Button';
import { Icon } from '../Icon';
import { colors } from '../../theme/colors';

interface InfoSheetProps {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  variant?: 'success' | 'error' | 'info';
}

export const InfoSheet = forwardRef<BottomSheetModal, InfoSheetProps>(
  ({ title, description, buttonText = 'OK', onButtonPress, variant = 'info' }, ref) => {
    
    const handlePress = () => {
      if (onButtonPress) onButtonPress();
      // @ts-ignore
      ref?.current?.dismiss();
    };

    const getIconName = () => {
        switch (variant) {
            case 'success': return 'checkmark-circle';
            case 'error': return 'alert-circle';
            default: return 'information-circle';
        }
    };

    const getIconColor = () => {
        switch (variant) {
            case 'success': return colors.primary;
            case 'error': return colors.destructive;
            default: return colors.primary;
        }
    };

    return (
      <BottomSheet ref={ref} snapPoints={['35%']}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Icon name={getIconName()} size={48} color={getIconColor()} />
            <Text variant="h3" style={styles.title}>{title}</Text>
            {description && <Text variant="muted" style={styles.description}>{description}</Text>}
          </View>
          
          <Button onPress={handlePress} style={styles.button}>
            {buttonText}
          </Button>
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  content: {
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
});
