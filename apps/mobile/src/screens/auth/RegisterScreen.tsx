import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '../../components/ui/FormInput';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  verifyPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.verifyPassword, {
  message: "Passwords don't match",
  path: ['verifyPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      password: '',
      verifyPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await register.mutate(data);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.subtitle}>Enter your details below to create your account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <FormInput
                  control={control}
                  name="firstName"
                  placeholder="First name"
                  error={errors.firstName?.message}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormInput
                  control={control}
                  name="lastName"
                  placeholder="Last name"
                  error={errors.lastName?.message}
                />
              </View>
            </View>

            <FormInput
              control={control}
              name="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email?.message}
            />

            <FormInput
              control={control}
              name="phoneNumber"
              placeholder="Phone Number"
              keyboardType="phone-pad"
              error={errors.phoneNumber?.message}
            />

            <FormInput
              control={control}
              name="dateOfBirth"
              placeholder="Date of Birth (YYYY-MM-DD)"
              error={errors.dateOfBirth?.message}
            />

            <FormInput
              control={control}
              name="password"
              placeholder="Password"
              secureTextEntry
              error={errors.password?.message}
            />

            <FormInput
              control={control}
              name="verifyPassword"
              placeholder="Verify Password"
              secureTextEntry
              error={errors.verifyPassword?.message}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fafafa" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.linkText}>Already have an account? Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  content: {
    padding: 24,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#09090b',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#09090b',
    backgroundColor: '#ffffff',
  },
  button: {
    height: 44,
    backgroundColor: '#18181b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: '500',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#71717a',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
