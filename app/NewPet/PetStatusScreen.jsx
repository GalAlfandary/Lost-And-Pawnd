import React, { useState } from 'react';
import { IconButton } from 'react-native-paper';
import colors from '../../constants/colors';
import PetInfoScreen from './PetInfoScreen';


import {
  View,
  Text,
  Switch,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

export default function PetStatusScreen({ navigation }) {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleNext = () => {
    router.push({
      pathname: 'NewPet/PetInfoScreen',
      params: { isEnabled }, // Pass the state as a parameter
    });
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => router.push('../')} style={{ marginRight: 16 }}>
        <IconButton
          icon="arrow-left"
          onPress={() => router.push('../')}
          size={24}
          style={styles.backButton}
          iconColor={colors.primary}
        />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>New Pet</Text>

        <Image
          source={require('../../assets/images/petStatus.png')}
          style={styles.image}
        />


        </View>
        <View style={styles.contentWrapper}>

      <Text style={styles.title}>The pet is</Text>
      <View style={styles.row}>
      <Switch
            style={styles.switch}
            thumbColor={isEnabled ? colors.onBoardingBackground : colors.lostChip}
            trackColor={{ true: colors.primary }}
            onValueChange={() => setIsEnabled((prev) => !prev)}
            value={isEnabled}
          />
        
        <Text style={[styles.statusText, { color: isEnabled ? colors.onBoardingBackground : colors.lostChip }]}>
          {isEnabled ? 'Pawnd' : 'Lost'}
        </Text>
        <Text style={styles.dot}>.</Text>
      </View>
      <Text style={styles.subText}>{isEnabled ? "I want to find it’s owner.":'Please help me find it.' }</Text>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentWrapper: {
    width: '100%',
    paddingHorizontal: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
  },
  backButton: {
    backgroundColor: colors.background, // Semi-transparent white
    borderRadius: 50,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 'auto', // ✅ pushes image to the right
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
  switch: {
    marginLeft: 16,
    backgroundColor: colors.primary,
    borderRadius: 50,
  },
  status: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: -16,
    alignSelf: 'flex-start',
    color: colors.primary,
    fontFamily: 'JaldiBold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 61,
    fontWeight: 'bold',
    marginLeft: 12,
    color: colors.primary,
    fontFamily: 'JaldiBold',
  },
  dot: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  subText: {
    fontSize: 32,
    marginBottom: 32,
    alignSelf: 'flex-start',
    color: colors.primary,
    fontFamily: 'JaldiBold',
    marginTop: -25,
  },
  button: {
    backgroundColor: '#ced3d1',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 32,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'JaldiBold',
    textAlign: 'center',
  },
});
