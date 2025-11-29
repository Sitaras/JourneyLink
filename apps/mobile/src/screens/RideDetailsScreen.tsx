import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { rideService } from '../services/ride';
import { bookingService } from '../services/booking';
import { Icon } from '../components/Icon';
import { RootStackParamList } from '../navigation/types';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { colors } from '../theme/colors';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ConfirmationSheet } from '../components/ui/ConfirmationSheet';
import { InfoSheet } from '../components/ui/InfoSheet';

type RideDetailsRouteProp = RouteProp<RootStackParamList, 'RideDetails'>;

export default function RideDetailsScreen() {
  const route = useRoute<RideDetailsRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;
  
  const confirmSheetRef = useRef<BottomSheetModal>(null);
  const successSheetRef = useRef<BottomSheetModal>(null);
  const errorSheetRef = useRef<BottomSheetModal>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: ride, isLoading } = useQuery({
    queryKey: ['ride', id],
    queryFn: () => rideService.getRideById(id),
    enabled: !!id,
  });

  const bookMutation = useMutation({
    mutationFn: () => bookingService.bookSeat({ rideId: id, seats: 1 }),
    onSuccess: () => {
      successSheetRef.current?.present();
    },
    onError: (error: any) => {
      setErrorMessage(error.message || 'Failed to book ride');
      errorSheetRef.current?.present();
    },
  });

  if (isLoading || !ride) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="h2" style={{ color: colors.primary }}>
            {new Date(ride.departureTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Badge variant="outline">
            {(ride.status || 'ACTIVE').toUpperCase()}
          </Badge>
        </View>

        <Card style={styles.section}>
          <CardContent style={styles.cardContent}>
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <Text variant="h4" style={styles.time}>
                  {new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <View style={styles.dot} />
                <View style={styles.locationContainer}>
                  <Text variant="large">{ride.origin.city}</Text>
                  <Text variant="muted">{ride.origin.address}</Text>
                </View>
              </View>

              <View style={styles.line} />

              <View style={styles.timelineItem}>
                <Text variant="h4" style={styles.time}>--:--</Text>
                <View style={[styles.dot, styles.dotDest]} />
                <View style={styles.locationContainer}>
                  <Text variant="large">{ride.destination.city}</Text>
                  <Text variant="muted">{ride.destination.address}</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card style={styles.section}>
          <CardContent style={styles.priceContent}>
            <View>
              <Text variant="h1" style={{ color: colors.primary }}>${ride.pricePerSeat}</Text>
              <Text variant="muted">per seat</Text>
            </View>
            <View style={styles.seatsBadge}>
              <Icon name="people" size={16} color={colors.primaryForeground} />
              <Text style={{ color: colors.primaryForeground, fontWeight: '600' }}>{ride.availableSeats} left</Text>
            </View>
          </CardContent>
        </Card>

        <Card style={styles.section}>
          <CardContent style={styles.driverContent}>
            <Avatar 
              fallback={`${ride.driverProfile.firstName[0]}${ride.driverProfile.lastName[0]}`}
              size={50}
            />
            <View style={styles.driverInfo}>
              <Text variant="h4">{ride.driverProfile.firstName} {ride.driverProfile.lastName}</Text>
              <View style={styles.rating}>
                <Icon name="star" size={16} color="#FACC15" />
                <Text variant="small">{ride.driverProfile.rating.average} / 5</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card style={styles.section}>
          <CardContent style={styles.cardContent}>
            <Text variant="h4" style={styles.sectionTitle}>Vehicle</Text>
            <Text variant="p">
              {ride.vehicleInfo.color} {ride.vehicleInfo.make} {ride.vehicleInfo.model}
            </Text>
          </CardContent>
        </Card>

        <Button
          style={styles.bookButton}
          onPress={() => confirmSheetRef.current?.present()}
          loading={bookMutation.isPending}
          disabled={ride.availableSeats === 0}
        >
          {ride.availableSeats === 0 ? 'Sold Out' : 'Book Ride'}
        </Button>
      </ScrollView>

      <ConfirmationSheet
        ref={confirmSheetRef}
        title="Book Ride"
        description={`Are you sure you want to book a seat for $${ride.pricePerSeat}?`}
        confirmText="Book Now"
        onConfirm={() => {
            confirmSheetRef.current?.dismiss();
            bookMutation.mutate();
        }}
      />

      <InfoSheet
        ref={successSheetRef}
        title="Booking Successful!"
        description="Your seat has been reserved. You can view your ride in 'My Rides'."
        variant="success"
        buttonText="View My Rides"
        onButtonPress={() => navigation.navigate('MyRides' as never)}
      />

      <InfoSheet
        ref={errorSheetRef}
        title="Booking Failed"
        description={errorMessage}
        variant="error"
        buttonText="Try Again"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  section: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  timeline: {
    position: 'relative',
    paddingLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  time: {
    width: 60,
  },
  locationContainer: {
    flex: 1,
    paddingLeft: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    position: 'absolute',
    left: 60,
    top: 5,
    zIndex: 1,
  },
  dotDest: {
    borderColor: colors.foreground,
  },
  line: {
    position: 'absolute',
    left: 75, // 60 + 12/2 - 1
    top: 15,
    bottom: 40,
    width: 2,
    backgroundColor: colors.border,
  },
  priceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  seatsBadge: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  driverContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  driverInfo: {
    gap: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  bookButton: {
    marginTop: 8,
    marginBottom: 40,
    height: 50,
  },
});
