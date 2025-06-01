import React, { useEffect, useState } from 'react';
import { IconButton } from 'react-native-paper';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import colors from '../../constants/colors';
import * as Location from 'expo-location';
import AddressAutocomplete from '../../components/AddressAutoComplete';


export default function PetLocationScreen() {
  const params = useLocalSearchParams();
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [region, setRegion] = useState({
    latitude: 38.8977,         // default coordinates
    longitude: -77.0365,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const {
    isEnabled,
    name,
    gender,
    imageUri,
  } = params; // Get the value from the previous screen
  
  

  const handleNext = () => {
    router.push({
      pathname: 'NewPet/PetCharacteristicsScreen',
      params: { isEnabled, name, gender, imageUri, address, latitude, longitude }, 
    });
    
  };

  return (
    // <ScrollView style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <IconButton
          icon="arrow-left"
          onPress={() => router.back()}
          size={24}
          style={styles.backButton}
          iconColor={colors.primary}
        />
        <Text style={styles.pageTitle}>New Pet</Text>
        <Image
          source={require('../../assets/images/petLocation.png')}
          style={styles.image}
        />
      </View>

      <Text style={[styles.label, { fontSize: 32 },{padding:16},{lineHeight: 35}]}>
      Where have you last seen the pet?</Text>
      <View style={styles.contentWrapper}>
      <Text style={styles.label}>Last seen</Text>
      <AddressAutocomplete
  value={address}
  onChangeText={setAddress}
  onSelect={(place) => {
    const { formatted, lat, lon } = place.properties;
    setAddress(formatted);
    setLatitude(lat);
    setLongitude(lon);
    setRegion({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  }}
  onLocationPicked={(place) => {
    const { formatted, lat, lon } = place;
    setAddress(formatted);
    setLatitude(lat);
    setLongitude(lon);
    setRegion({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  }}
/>


            {/* // <TextInput
            //   value={address}
            //   onChangeText={setAddress}
            //   placeholder="Enter last location"
            //   style={styles.input}
            // /> */}
            {/* <TouchableOpacity onPress={handleUseCurrentLocation} style={styles.ghostButton}>
  <Text style={styles.ghostButtonText}>Use my current location</Text>
</TouchableOpacity> */}


            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={region} // 👈 controlled by state
                
              >
                <Marker
                  coordinate={region} // 👈 controlled by state
              image={require('../../assets/images/mapMarker.png')} // Custom marker image
            />
              </MapView>
            </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      </View>

    </SafeAreaView>
    // </ScrollView>
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
    color: colors.primary,
    fontFamily: 'JaldiBold',
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
  input: {
    width: '100%',
    backgroundColor: colors.background,  // light mint/gray background
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontFamily: 'JaldiRegular',
  
  },
  uploadBox: {
    width: '100%',
    height: 100,
    backgroundColor: colors.background,  // same background
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
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
    fontSize: 28,
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
    fontSize: 18,
    marginBottom: 32,
    alignSelf: 'flex-start',
    color: colors.primary,
    fontFamily: 'JaldiBold',
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
  imageMap: {
    width: "100%",
    height: 200,
    borderRadius: 5,
  },
  mapContainer: {
    height: 200,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  ghostButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: -8,
  },
  
  ghostButtonText: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontFamily: 'JaldiRegular',
    fontSize: 18,
    fontcolor: colors.secondary,
  },
  
});
