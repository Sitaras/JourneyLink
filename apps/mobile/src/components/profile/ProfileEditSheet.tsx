import React, { forwardRef, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheet } from '../ui/BottomSheet';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormInput';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, UpdateProfilePayload, ProfileResponse } from '@journey-link/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/user';
import DatePicker from 'react-native-date-picker';
import { colors } from '../../theme/colors';

interface ProfileEditSheetProps {
  profile: ProfileResponse;
  onSuccess: () => void;
}

export const ProfileEditSheet = forwardRef<BottomSheetModal, ProfileEditSheetProps>(
  ({ profile, onSuccess }, ref) => {
    const queryClient = useQueryClient();
    const [date, setDate] = useState(new Date(profile.dateOfBirth || new Date()));
    const [openDate, setOpenDate] = useState(false);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<UpdateProfilePayload>({
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        dateOfBirth: new Date(profile.dateOfBirth).toISOString(),
        bio: profile.bio || '',
      },
    });

    // Update form values when profile changes
    useEffect(() => {
        setValue('firstName', profile.firstName);
        setValue('lastName', profile.lastName);
        setValue('email', profile.email);
        setValue('phoneNumber', profile.phoneNumber);
        setValue('dateOfBirth', new Date(profile.dateOfBirth).toISOString());
        setValue('bio', profile.bio || '');
        setDate(new Date(profile.dateOfBirth));
    }, [profile, setValue]);


    const updateProfileMutation = useMutation({
      mutationFn: (data: UpdateProfilePayload) => userService.updateUserProfile(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        onSuccess();
        // @ts-ignore
        ref?.current?.dismiss();
      },
    });

    const onSubmit = (data: UpdateProfilePayload) => {
      updateProfileMutation.mutate(data);
    };

    return (
      <BottomSheet ref={ref} snapPoints={['85%']}>
        <View style={styles.header}>
            <Text variant="h3">Edit Profile</Text>
        </View>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.row}>
            <View style={styles.half}>
              <FormInput
                control={control}
                name="firstName"
                label="First Name"
                error={errors.firstName?.message}
              />
            </View>
            <View style={styles.half}>
              <FormInput
                control={control}
                name="lastName"
                label="Last Name"
                error={errors.lastName?.message}
              />
            </View>
          </View>

          <FormInput
            control={control}
            name="email"
            label="Email"
            keyboardType="email-address"
            error={errors.email?.message}
          />

          <FormInput
            control={control}
            name="phoneNumber"
            label="Phone Number"
            keyboardType="phone-pad"
            error={errors.phoneNumber?.message}
          />

          <View style={styles.dateContainer}>
            <Text variant="small" style={styles.label}>Date of Birth</Text>
            <Button variant="outline" onPress={() => setOpenDate(true)} style={styles.dateButton}>
              {date.toLocaleDateString()}
            </Button>
            <DatePicker
              modal
              open={openDate}
              date={date}
              mode="date"
              onConfirm={(selectedDate) => {
                setOpenDate(false);
                setDate(selectedDate);
                setValue('dateOfBirth', selectedDate.toISOString());
              }}
              onCancel={() => {
                setOpenDate(false);
              }}
            />
             {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth.message}</Text>}
          </View>

          <FormInput
            control={control}
            name="bio"
            label="Bio"
            multiline
            numberOfLines={4}
            error={errors.bio?.message}
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          <Button 
            onPress={handleSubmit(onSubmit)} 
            loading={updateProfileMutation.isPending}
            style={styles.submitButton}
          >
            Save Changes
          </Button>
        </ScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  header: {
      alignItems: 'center',
      marginBottom: 20,
  },
  container: {
    gap: 16,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  dateContainer: {
    gap: 8,
  },
  label: {
    marginBottom: 4,
  },
  dateButton: {
    justifyContent: 'flex-start',
  },
  submitButton: {
    marginTop: 10,
  },
  errorText: {
    fontSize: 12,
    color: colors.destructive,
  },
});
