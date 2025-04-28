import React, { useState } from 'react';
import { View, StyleSheet, Text,Image,TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import colors from '../constants/colors';
import { supabase } from '../supabase';
import PetStatusScreen from './NewPet/PetStatusScreen';
import PetInfoScreen from './NewPet/PetInfoScreen';
import PetLocationScreen from './NewPet/PetLocationScreen';
import PetCharacteristicsScreen from './NewPet/PetCharacteristicsScreen';
import PetDescriptionScreen from './NewPet/PetDescriptionScreen';
import SearchPetScreen from './Search/SearchPetScreen';

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import MainPage from './main';


const Home = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    router.push('./auth/login');
  };

  const handleSignUp = () => {
    router.push('./auth/signup');
  };
  WebBrowser.maybeCompleteAuthSession();

  const handleGoogle = async () => {
    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: true,
    });
  
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
      },
    });
  
    setLoading(false);
  
    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      // Wait for auth state change
      // We handle redirect automatically in step 4
    }
  };

useEffect(() => {
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      console.log('✅ User logged in!', session.user);
      router.push('/main'); // ✅ Redirect after login
    }
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);

  return (
    <View style={styles.container}>
     
      <View style={styles.titleContainer}>
         <Image source={require('../assets/images/icon.png')} style={styles.icon} ></Image>
        <Text style={styles.title}>Lost & Pawnd</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleLogin}
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
          }}
        >
          Login
        </Button>
        <Button
          mode="contained"
          onPress={handleGoogle}
          loading={loading}
          style={styles.secondaryButton}
          textColor={colors.primary}
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
          <Image source={require('../assets/images/Google.png')} style={styles.google} />
          Continue with Google
        </Button>
        <TouchableOpacity onPress={handleSignUp} style={styles.ghostButton}>
        <Text style={styles.ghostButtonText}>Or Sign Up Manually</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Distributes content
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  icon: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginTop: 50,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center', // Centers the title vertically
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    color: colors.primary,
    fontFamily: 'JaldiBold',
  },
  buttonContainer: {
    paddingBottom: 30, // Adds spacing at the bottom
    alignItems: 'center', // Centers buttons horizontally
  },
  primaryButton: {
    marginBottom: 5,
    padding: 5,
    backgroundColor: colors.primary,
    borderRadius: 100,
    width: '100%',
  },
  secondaryButton: {
    padding: 5,
    backgroundColor: colors.secondary,
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
  },
  google: {
    width: 20,
    height: 20,
    marginRight: 20,
    marginTop: 5,
  },
  ghostButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  ghostButtonText: {
    color: "#000", // Text color
    fontSize: 16, // Adjust font size
    fontWeight: "bold", // Optional bold
    textDecorationLine: "underline", // Underline text
    fontFamily: "JaldiBold", // Change font family
  },
});

export default Home;

// export default function Home() {
//   return <MainPage/>;
// }
