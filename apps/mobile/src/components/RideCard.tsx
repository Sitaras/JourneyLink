import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from './Icon';
import { Ride, RideStatus } from '@journey-link/shared';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card';
import { Badge } from './ui/Badge';
import { Text } from './ui/Text';
import { Button } from './ui/Button';
import { colors } from '../theme/colors';

interface RideCardProps {
  ride: any; // Using any to support both Ride and UserRide for now
}

type RideCardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RideCard = ({ ride }: RideCardProps) => {
  const navigation = useNavigation<RideCardNavigationProp>();
  const isCompleted = ride.status === RideStatus.COMPLETED;
  const isCancelled = ride.status === RideStatus.CANCELLED;

  const getStatusVariant = () => {
    if (isCompleted) return 'secondary'; // Greenish logic handled in Badge? No, Badge has fixed variants.
    if (isCancelled) return 'destructive';
    return 'default';
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('RideDetails', { id: ride._id })}>
        <CardHeader style={styles.header}>
          <View style={styles.routeContainer}>
            <View style={styles.iconBg}>
              <Icon name="location" size={16} color={colors.primary} />
            </View>
            <View style={styles.routeText}>
              <Text variant="h4">{ride.origin.city}</Text>
              <Icon name="arrow-forward" size={16} color={colors.mutedForeground} />
              <Text variant="h4">{ride.destination.city}</Text>
            </View>
          </View>

          <Badge variant={getStatusVariant()}>
            {ride.status?.toUpperCase() || 'ACTIVE'}
          </Badge>
        </CardHeader>

        <CardContent style={styles.content}>
          <View style={styles.infoRow}>
            <Icon name="calendar-outline" size={16} color={colors.mutedForeground} />
            <Text variant="p">
              {new Date(ride.departureTime).toLocaleString()}
            </Text>
          </View>

          <View style={styles.driverRow}>
            {ride.driverProfile && (
              <View style={styles.driverInfo}>
                <Icon name="person-circle-outline" size={16} color={colors.mutedForeground} />
                <Text variant="small">{ride.driverProfile.firstName}</Text>
                {ride.driverProfile.rating && ride.driverProfile.rating.average > 0 && (
                  <View style={styles.rating}>
                    <Icon name="star" size={12} color="#FACC15" />
                    <Text variant="small">{ride.driverProfile.rating.average}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </CardContent>

        <View style={styles.separator} />

        <CardFooter style={styles.footer}>
          <View>
            <Text variant="h3" style={{ color: colors.primary }}>€{ride.pricePerSeat?.toFixed(2)}</Text>
            <Text variant="muted">per seat</Text>
          </View>

          <Button 
            size="sm" 
            variant="outline"
            onPress={() => navigation.navigate('RideDetails', { id: ride._id })}
          >
            View details
          </Button>
        </CardFooter>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconBg: {
    padding: 8,
    backgroundColor: colors.secondary,
    borderRadius: 20,
  },
  routeText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    flex: 1,
  },
  content: {
    gap: 12,
    paddingBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
    marginHorizontal: 24,
  },
  footer: {
    justifyContent: 'space-between',
  },
});
