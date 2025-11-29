import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { rideService } from '../../services/ride';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '../../components/ui/FormInput';
import { CityAutocomplete } from '../../components/CityAutocomplete';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { colors } from '../../theme/colors';
import DatePicker from 'react-native-date-picker';

type CreateRideScreenNavigationProp = NativeStackNavigationProp<MainTabParamList, 'CreateRide'>;

import { createRideSchema, CreateRideFormValues } from '../../schemas/ride';

export default function CreateRideScreen() {
  const navigation = useNavigation<CreateRideScreenNavigationProp>();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<CreateRideFormValues>({
    resolver: zodResolver(createRideSchema),
    defaultValues: {
      originCity: '',
      destinationCity: '',
      pricePerSeat: '',
      availableSeats: '',
      vehicleMake: '',
      vehicleModel: '',
    },
  });

  const createRideMutation = useMutation({
    mutationFn: (data: any) => rideService.createRide(data),
    onSuccess: () => {
      Alert.alert('Success', 'Ride published successfully!');
      navigation.navigate('MyRides');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to publish ride');
    },
  });

  const onSubmit = (data: CreateRideFormValues) => {
    const payload = {
      origin: { city: data.originCity, address: data.originCity, coordinates: [0, 0] },
      destination: { city: data.destinationCity, address: data.destinationCity, coordinates: [0, 0] },
      departureTime: date.toISOString(),
      pricePerSeat: Number(data.pricePerSeat),
      availableSeats: Number(data.availableSeats),
      vehicleInfo: { make: data.vehicleMake, model: data.vehicleModel, color: 'Unknown', licensePlate: 'Unknown' },
      preferences: { smokingAllowed: false, petsAllowed: false },
      additionalInfo: '',
    };
    createRideMutation.mutate(payload);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="h2" style={styles.header}>Publish a Ride</Text>

      <Card style={styles.section}>
        <CardContent style={styles.cardContent}>
          <View style={{ zIndex: 2 }}>
            <Controller
              control={control}
              name="originCity"
              render={({ field: { onChange, value } }) => (
                <CityAutocomplete
                  placeholder="Origin City"
                  value={value}
                  onSelect={onChange}
                  containerStyle={{ marginBottom: 10 }}
                />
              )}
            />
            {errors.originCity && <Text style={styles.errorText}>{errors.originCity.message}</Text>}
          </View>
          
          <View style={{ zIndex: 1 }}>
            <Controller
              control={control}
              name="destinationCity"
              render={({ field: { onChange, value } }) => (
                <CityAutocomplete
                  placeholder="Destination City"
                  value={value}
                  onSelect={onChange}
                  containerStyle={{ marginBottom: 10 }}
                />
              )}
            />
            {errors.destinationCity && <Text style={styles.errorText}>{errors.destinationCity.message}</Text>}
          </View>

          <View style={styles.dateContainer}>
            <Text variant="small" style={styles.label}>Departure Time</Text>
            <Button variant="outline" onPress={() => setOpen(true)} style={styles.dateButton}>
              {date.toLocaleString()}
            </Button>
            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={(date) => {
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
        </CardContent>
      </Card>

      <Card style={styles.section}>
        <CardContent style={styles.cardContent}>
          <FormInput
            control={control}
            name="pricePerSeat"
            label="Price per Seat ($)"
            placeholder="20"
            keyboardType="numeric"
            error={errors.pricePerSeat?.message}
          />

          <FormInput
            control={control}
            name="availableSeats"
            label="Available Seats"
            placeholder="3"
            keyboardType="numeric"
            error={errors.availableSeats?.message}
          />
        </CardContent>
      </Card>

      <Card style={styles.section}>
        <CardContent style={styles.cardContent}>
          <Text variant="h4" style={styles.sectionTitle}>Vehicle Info</Text>
          <FormInput
            control={control}
            name="vehicleMake"
            placeholder="Make (e.g. Toyota)"
            error={errors.vehicleMake?.message}
          />
          <FormInput
            control={control}
            name="vehicleModel"
            placeholder="Model (e.g. Camry)"
            error={errors.vehicleModel?.message}
          />
        </CardContent>
      </Card>

      <Button 
        onPress={handleSubmit(onSubmit)}
        loading={createRideMutation.isPending}
        style={styles.submitButton}
      >
        Publish Ride
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  cardContent: {
    gap: 16,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 8,
  },
  dateContainer: {
    marginTop: 8,
  },
  dateButton: {
    justifyContent: 'flex-start',
  },
  submitButton: {
    marginBottom: 40,
    height: 50,
  },
  errorText: {
    fontSize: 12,
    color: colors.destructive,
    marginTop: 4,
  },
});
