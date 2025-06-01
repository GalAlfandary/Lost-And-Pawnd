import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { supabase } from '../../supabase';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const completeLogin = async () => {
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        Alert.alert('Login Failed', error.message);
        return;
      }
  
      //Alert.alert('Login Successful', 'Welcome back!');
      await AsyncStorage.setItem('user', JSON.stringify(data.user)); // Store user data in AsyncStorage
      router.push('/main'); // Navigate to the main page
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
        <Text style={styles.pageTitle}>Log In</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.instructions}>In order to continue, please log in</Text>
        <Text style={styles.inputTitle}>Email address</Text>
        <TextInput
          label="Enter your Email address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCorrect={false}
          autoComplete='email'
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
          onPress={completeLogin}
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
          Log In
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

export default Login;
