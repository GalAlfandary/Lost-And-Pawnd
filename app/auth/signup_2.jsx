import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { supabase } from '../../supabase';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup2 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const completeSignup = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }
  
    setLoading(true);
    try {
      // Retrieve data from AsyncStorage
      const storedSignupData = await AsyncStorage.getItem('signupData');
      const signupData = JSON.parse(storedSignupData);
  
      if (!signupData) {
        Alert.alert('Error', 'Failed to retrieve previous signup details.');
        return;
      }
  
      const { name, phoneNumber } = signupData;
  
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        Alert.alert('Signup Failed', error.message);
        return;
      }
  
      // Update the user's phone number
      const { error: updateError } = await supabase.auth.updateUser({
        phone: phoneNumber, // This will set the phone field in Supabase Auth
      });
  
      if (updateError) {
        Alert.alert('Error', 'Failed to update phone number. Please try again.');
        return;
      }
  
      // Save additional user details in the "profiles" table
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, name, phoneNumber, email }]);
  
      if (insertError) {
        Alert.alert('Error', 'Failed to save additional details. Please try again.');
        return;
      }
  
      Alert.alert('Signup Successful!', 'Your account has been created.');
      router.push('/main'); // Redirect to the main page
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <IconButton
          icon="arrow-left"
          onPress={() => router.push('../')}
          size={24}
          style={styles.backButton}
          iconColor={colors.secondary}
        />
        <Text style={styles.pageTitle}>Sign Up</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <Text style={styles.title}>You're almost there! 🐾</Text>
        <Text style={styles.instructions}>Please complete your registration</Text>
        <Text style={styles.inputTitle}>Email address</Text>
        <TextInput
          label="Enter your Email address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        <Text style={styles.inputTitle}>Password</Text>
        <TextInput
          label="Enter your Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <Button
          mode="contained"
          onPress={completeSignup}
          loading={loading}
          style={styles.primaryButton}
          textColor={colors.background}
          labelStyle={{
            fontFamily: 'JaldiBold',
            fontSize: 16,
                      
          }}
          contentStyle={{
            height: 45, // Set a fixed height
            justifyContent: 'center', // Center content vertically
            alignItems: 'center', // Center content horizontally
          }}
        >
          Complete
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.onBoardingBackground,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 50,
  },
  pageTitle: {
    fontSize: 16,
    color: colors.primary,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'JaldiRegular',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    backgroundColor: colors.primary,
    borderRadius: 50,
  },
  title: {
    fontSize: 30,
    textAlign: 'left',
    marginBottom: 15,
    color: colors.primary,
    fontFamily: 'JaldiBold',
    lineHeight: 40,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 15,
    color: colors.primary,
    fontFamily: 'JaldiRegular',
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: colors.background,
    fontFamily: 'JaldiRegular',
    borderRadius: 8, // Add border radius for rounded input
  },
  inputTitle: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: 'JaldiBold',
    marginBottom: 5,
  },
  primaryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 100,
    width: '100%',
  },
});

export default Signup2;
