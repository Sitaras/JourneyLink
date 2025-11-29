import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Icon } from '../../components/Icon';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user';
import { Text } from '../../components/ui/Text';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { colors } from '../../theme/colors';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ConfirmationSheet } from '../../components/ui/ConfirmationSheet';
import { ProfileEditSheet } from '../../components/profile/ProfileEditSheet';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const logoutSheetRef = useRef<BottomSheetModal>(null);
  const editSheetRef = useRef<BottomSheetModal>(null);

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userService.getUserProfile,
  });

  const handleLogoutPress = useCallback(() => {
    logoutSheetRef.current?.present();
  }, []);

  const handleEditPress = useCallback(() => {
    editSheetRef.current?.present();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
             <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
                <Icon name="create-outline" size={24} color={colors.primary} />
             </TouchableOpacity>
          </View>
          
          <Avatar 
            fallback={`${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`} 
            size={80} 
          />
          <View style={styles.headerText}>
            <Text variant="h2">{profile?.firstName} {profile?.lastName}</Text>
            <Text variant="muted">{profile?.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>Account</Text>
          <Card>
            <CardContent style={styles.menuContent}>
              <Button variant="ghost" style={styles.menuItem} onPress={() => {}}>
                <View style={styles.menuRow}>
                  <Icon name="settings-outline" size={20} color={colors.foreground} />
                  <Text style={styles.menuText}>Settings</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={colors.mutedForeground} />
              </Button>
              
              <View style={styles.separator} />

              <Button variant="ghost" style={styles.menuItem} onPress={() => {}}>
                <View style={styles.menuRow}>
                  <Icon name="card-outline" size={20} color={colors.foreground} />
                  <Text style={styles.menuText}>Payment Methods</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={colors.mutedForeground} />
              </Button>
            </CardContent>
          </Card>
        </View>

        <View style={styles.section}>
          <Button variant="destructive" onPress={handleLogoutPress}>
            Logout
          </Button>
        </View>
      </ScrollView>

      <ConfirmationSheet
        ref={logoutSheetRef}
        title="Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        confirmVariant="destructive"
        onConfirm={() => logout.mutate()}
      />

      {profile && (
        <ProfileEditSheet
            ref={editSheetRef}
            profile={profile}
            onSuccess={() => {
                refetch();
            }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
      paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 16,
    position: 'relative',
  },
  headerTop: {
      width: '100%',
      alignItems: 'flex-end',
      paddingHorizontal: 20,
      position: 'absolute',
      top: 20,
      zIndex: 10,
  },
  editButton: {
      padding: 8,
  },
  headerText: {
    alignItems: 'center',
    gap: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    marginLeft: 4,
  },
  menuContent: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
});
