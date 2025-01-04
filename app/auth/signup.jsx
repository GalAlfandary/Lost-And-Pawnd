import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image, Text } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { supabase } from '../../supabase';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Signup = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const continueSignup = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid phone number.');
      return;
    }
  
    setLoading(true);
    try {
      await AsyncStorage.setItem('signupData', JSON.stringify({ name, phoneNumber }));
      Alert.alert('Success', 'Your details have been saved. Please proceed.');
      router.push('/auth/signup_2');
    } catch (error) {
      Alert.alert('Error', 'Failed to save your details. Please try again.');
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
        <Text style={styles.title}>You are one step away from our community 🐶</Text>
        <Text style={styles.instructions}>Please complete the following steps</Text>
        <Text style={styles.inputTitle}>Full Name</Text>
        <TextInput
          label="Enter your name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          autoCapitalize='words'
        />
        <Text style={styles.inputTitle}>Phone Number</Text>
        <TextInput
          label="Enter your Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          keyboardType='phone-pad'
          
        />

        <Button
          mode="contained"
          onPress={continueSignup}
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
          Continue
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
  },
  inputTitle: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: 'JaldiBold',
  },
  buttonContainer: {
    paddingBottom: 30,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'column',
  },
  primaryButton: {
    
    padding: 5,
    backgroundColor: colors.primary,
    borderRadius: 100,
    width: '100%',
  },
  orContainer: {
    marginVertical: 10, // Add spacing around the "Or" text
    alignItems: 'center',
  },
  orText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: 'JaldiRegular',
  },
  secondaryButton: {
    padding: 5,
    backgroundColor: colors.secondary,
    borderRadius: 100,
    width: '100%',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 200,
  },
});

export default Signup;
