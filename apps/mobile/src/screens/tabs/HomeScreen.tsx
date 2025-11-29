import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { rideService } from '../../services/ride';
import { Ride } from '@journey-link/shared';
import { RideCard } from '../../components/RideCard';
import { CityAutocomplete } from '../../components/CityAutocomplete';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';
import DatePicker from 'react-native-date-picker';
import { Icon } from '../../components/Icon';

export default function HomeScreen() {
  const [origin, setOrigin] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const searchParams = {
    originLat: origin?.coordinates?.[1]?.toString(),
    originLng: origin?.coordinates?.[0]?.toString(),
    destinationLat: destination?.coordinates?.[1]?.toString(),
    destinationLng: destination?.coordinates?.[0]?.toString(),
    departureDate: date.toISOString(),
  };

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['rides', searchParams],
    queryFn: () => rideService.searchRides(searchParams),
    enabled: shouldFetch && !!origin && !!destination,
  });

  const handleSearch = () => {
    if (origin && destination) {
      setShouldFetch(true);
      refetch();
    }
  };

  const renderRideItem = ({ item }: { item: Ride }) => (
    <RideCard ride={item} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text variant="h2" style={styles.title}>Find a ride</Text>
        
        <View style={{ zIndex: 2 }}>
          <CityAutocomplete
            placeholder="Leaving from..."
            value={origin?.name}
            onSelect={(city) => setOrigin(city)}
            containerStyle={{ marginBottom: 10 }}
          />
        </View>

        <View style={{ zIndex: 1 }}>
          <CityAutocomplete
            placeholder="Going to..."
            value={destination?.name}
            onSelect={(city) => setDestination(city)}
            containerStyle={{ marginBottom: 10 }}
          />
        </View>

        <View style={styles.dateContainer}>
            <TouchableOpacity onPress={() => setOpenDate(true)} style={styles.dateButton}>
                <Icon name="calendar-outline" size={20} color={colors.foreground} />
                <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={openDate}
              date={date}
              mode="date"
              onConfirm={(selectedDate) => {
                setOpenDate(false);
                setDate(selectedDate);
              }}
              onCancel={() => {
                setOpenDate(false);
              }}
            />
        </View>

        <Button onPress={handleSearch} loading={isLoading && shouldFetch}>
          Search
        </Button>
      </View>

      {isLoading && shouldFetch ? (
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={data?.data || []}
          renderItem={renderRideItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            shouldFetch ? (
                <Text style={styles.emptyText}>No rides found</Text>
            ) : (
                <View style={styles.welcomeContainer}>
                    <Icon name="car-sport-outline" size={64} color={colors.mutedForeground} />
                    <Text variant="muted" style={{ textAlign: 'center', marginTop: 10 }}>
                        Enter your trip details to find a ride
                    </Text>
                </View>
            )
          }
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
  title: {
      marginBottom: 16,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
    zIndex: 10,
  },
  dateContainer: {
      marginBottom: 10,
  },
  dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 12,
      backgroundColor: colors.input,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
  },
  list: {
    padding: 20,
    gap: 16,
  },
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: colors.mutedForeground,
  },
  welcomeContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 60,
      opacity: 0.5,
  },
});
