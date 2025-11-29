import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { colors } from '../../theme/colors';

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoints?: string[];
  onDismiss?: () => void;
}

export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ children, snapPoints = ['50%'], onDismiss }, ref) => {
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onDismiss={onDismiss}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.background,
    borderRadius: 24,
  },
  indicator: {
    backgroundColor: colors.border,
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
});
