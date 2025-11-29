import React, { useState } from 'react';
import { View, useWindowDimensions, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user';
import { UserRide } from '@journey-link/shared';
import { RideCard } from '../../components/RideCard';
import { Text } from '../../components/ui/Text';
import { colors } from '../../theme/colors';

const RidesList = ({ type }: { type: 'upcoming' | 'history' }) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-rides'],
    queryFn: async () => {
      const res = await userService.getUserRides({}); 
      return res;
    },
  });

  const rides = data?.data || [];
  const now = new Date();
  
  const filteredRides = rides.filter((ride: UserRide) => {
    const rideDate = new Date(ride.departureTime);
    if (type === 'upcoming') {
      return rideDate >= now && ride.status !== 'cancelled';
    } else {
      return rideDate < now || ride.status === 'cancelled';
    }
  });

  if (isLoading) {
    return <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />;
  }

  return (
    <FlatList
      data={filteredRides}
      renderItem={({ item }) => <RideCard ride={item} />}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text variant="muted">No {type} rides found</Text>
        </View>
      }
      onRefresh={refetch}
      refreshing={isLoading}
    />
  );
};

export default function MyRidesScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'upcoming', title: 'Upcoming' },
    { key: 'history', title: 'History' },
  ]);

  const renderScene = SceneMap({
    upcoming: () => <RidesList type="upcoming" />,
    history: () => <RidesList type="history" />,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2">My Rides</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...(props as any)}
            indicatorStyle={{ backgroundColor: colors.primary }}
            style={{ backgroundColor: colors.background, elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: colors.border }}
            renderLabel={({ route, focused, color }: any) => (
              <Text style={{ color, margin: 8, fontWeight: '600' }}>
                {route.title}
              </Text>
            )}
            activeColor={colors.primary}
            inactiveColor={colors.mutedForeground}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
  },
});
