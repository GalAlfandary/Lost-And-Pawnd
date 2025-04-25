import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView,Share, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router"; // Import the correct hook
import { supabase } from "/Users/galalfandary/Desktop/Lost&Pawnd/lost-and-pawnd/supabase.js";
import colors from "../constants/colors";
import { Button,IconButton } from "react-native-paper";
import Characteristics from "../components/characteristics";
import Petsize from "../components/petSize";
import MapView, { Marker } from 'react-native-maps';
import * as Linking from 'expo-linking'; // Make sure this is imported


const Post = () => {

const [loading, setLoading] = useState(false);
const router = useRouter();
const params = useLocalSearchParams(); // Retrieve query parameters
const [fetchedAddress, setFetchedAddress] = useState(address || "Loading address...")


  const {
    petName,
    imageUrl,
    lostDate,
    description,
    address,
    animalType,
    breed,
    size,
    lost,
    latitude,
    longitude,
    gender,
    userID
  } = params;

  console.log("in card preview");
  console.log( params);
  // console.log(latitude);
  // console.log(longitude);

const getReadableAddress = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    return data.display_name; // This is the full readable address
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Address not found";
  }
};
useEffect(() => {
  if (latitude && longitude) {
    getReadableAddress(latitude, longitude).then((address) => {
      setFetchedAddress(address); // Update the state to display in UI
      console.log("Address:", address);
    });
  }
}, [latitude, longitude]);



const handleShare = async () => {
  const message = lost === "true" 
    ? `Lost Pet Alert!\n\nPet Name: ${petName}\nDescription: ${description}\nLast Seen: ${fetchedAddress}\n\nPlease help us find ${petName}!`
    : `Pawnd Pet Information:\n\nPet Name: ${petName}\nDetails: ${description}\nLocation: ${fetchedAddress}\n\nMeet your potential new pet today!`;

  try {
    const result = await Share.share({ message });

    if (result.action === Share.sharedAction) {
      console.log("Shared successfully");
    } else if (result.action === Share.dismissedAction) {
      console.log("Share dismissed");
    }
  } catch (error) {
    console.error("Error sharing:", error.message);
    Alert.alert("Error", "Unable to share the post at this time.");
  }
};



const handleContact = async () => {
  if (!userID) {
    Alert.alert("Missing Data", "This post doesn't contain contact information.");
    return;
  }

  setLoading(true);
  try {
    const { data, error } = await supabase
      .from("users")
      .select("phonenumber")
      .eq("userid", userID)
      .single(); // get one record

    if (error || !data) {
      console.error("Fetch error:", error?.message || "No data");
      Alert.alert("Error", "Unable to retrieve contact info.");
      return;
    }

    const phoneNumber = data.phonenumber;

    if (!phoneNumber) {
      Alert.alert("Unavailable", "Phone number is missing.");
      return;
    }
    console.log("Fetched phone number:", phoneNumber);

    Alert.alert(
      "Contact",
      `Phone Number: ${phoneNumber}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Call",
          onPress: async () => {
            const url = `tel:${phoneNumber}`;
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
              await Linking.openURL(url);
            } else {
              Alert.alert("Error", "Unable to open the dialer.");
            }
          }
        }
      ]
    );
  }
  catch (error) {
    console.error("Error fetching contact info:", error.message);
    Alert.alert("Error", "Unable to fetch contact info.");
  }
  finally {
    setLoading(false);
  }
};


  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.topButtonsContainer}>
        <IconButton
          icon="arrow-left"
          onPress={() => router.push('../')}
          size={24}
          style={styles.backButton}
          iconColor={colors.primary}
        />
        <IconButton
          icon="share"
          onPress={handleShare}
          size={24}
          style={styles.backButton}
          iconColor={colors.primary}
        />
        </View>
        <View style={styles.imageContainer}>
  <Image source={{ uri: imageUrl }} style={styles.image} />
  <Image source={require('../assets/images/fade.png')} style={styles.fade} />
</View>

      <View style={styles.container}>

        <View style={styles.nameAndGender}>
        
        <Text style={styles.petName}>{petName}  </Text> 
        {gender === 'female' && (
    <Image source={require('../assets/images/female.png')} style={styles.genderIcon} />
  )}
  {gender === 'male' && (
    <Image source={require('../assets/images/male.png')} style={styles.genderIcon} />
  )}
        </View>
        
        
        <Text style={lost === "true" ? styles.date : styles.pawndDate}>{lost === "true" ? `Lost on: ${lostDate}` : `Pawnd on: ${lostDate}`}</Text>
        <Button
  mode="contained"
  onPress={handleContact}
  loading={loading}
  style={styles.primaryButton}
  textColor={colors.background}
  labelStyle={{
    fontFamily: 'JaldiBold',
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
  }}
  contentStyle={{
    height: 50,
    justifyContent: 'center',
  }}
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image
      source={require('../assets/images/contact.png')}
      style={{
        width: 20,
        height: 20,
        marginRight: 8,
        resizeMode: 'contain',
      }}
    />
    <Text style={{ fontFamily: 'JaldiBold', fontSize: 16, color: '#fff' }}>
      Contact {lost === 'true' ? 'Owner' : 'Rescuer'}
    </Text>
  </View>
</Button>

        <Text style={styles.description}>{description} </Text>
        <Text style={styles.Characteristics}>Characteristics </Text>
        <View style={styles.CharacteristicsContainer}>
        <Characteristics animalType={animalType} breed={breed} />
        <Petsize animalSize={size} />
        </View>
        
        {/* Last Seen section with Map */}
<Text style={styles.Characteristics}>Last Seen</Text>
<Text style={styles.address}>{fetchedAddress}</Text>

<View style={styles.mapContainer}>
  <MapView
    style={styles.map}
    initialRegion={{
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      latitudeDelta: 0.005, // closer zoom
      longitudeDelta: 0.005, // closer zoom
    }}
  >
    <Marker
  coordinate={{ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }}
  title={petName}
  style={styles.mapMarker}
  image={require('../assets/images/mapMarker.png')}
/>

  </MapView>
</View>
        
        

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  primaryButton: {
    marginBottom: 5,
    padding: 5,
    backgroundColor: colors.primary,
    borderRadius: 100,
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative", // Set position relative to stack child elements
    width: "100%",
    height: 290,
  },
  image: {
    width: "100%",
    height: "100%", // Ensure the image fills the container
  },
  fade: {
    position: "absolute", // Position the fade image over the main image
    bottom: 0, // Align to the bottom of the container
    width: "100%",
    height: 66,
    zIndex: 10, // Ensure the fade image appears on top of the main image
  },
  petName: {
    fontSize: 32,
    fontFamily: "JaldiBold",
    color: colors.primary,
  },
  date: {
    fontSize: 18,
    color: colors.primary,
    fontFamily: "JaldiBold",
    alignSelf: "flex-start", // Makes the background fit only the text width
    backgroundColor: colors.lostChip,
    padding:5,
    borderRadius: 5,
    marginBottom: 16,
    paddingVertical: 0,
  },
  pawndDate: {
    fontSize: 18,
    color: colors.primary,
    fontFamily: "JaldiBold",
    alignSelf: "flex-start", // Makes the background fit only the text width
    backgroundColor: colors.onBoardingBackground,
    padding:5,
    borderRadius: 5,
    marginBottom: 16,
    paddingVertical: 0,
  },
  address: {
    fontSize: 20,
    color: colors.primary,
    fontFamily: "JaldiBold",
    lineHeight: 25, 
  },
  CharacteristicsContainer: {
    flexDirection: "row",
    justifyContent: "left",
    
  },
  Characteristics: {
    fontSize: 18,
    color: colors.postSecondary,
    fontFamily: "JaldiRegular",
  },
  description: {
    fontSize: 18,
    marginVertical: 4,
    color: colors.primary,
    fontFamily: "JaldiBold",
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.7)", 
    borderRadius: 50,
  },
  topButtonsContainer: {
    position: "absolute", 
    top: 50, 
    left: 16, 
    right: 16, 
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 20,
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
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  
  genderIcon: {
    width: 25,
    height: 25,
  },
  nameAndGender: {
    flexDirection: "row",
    alignItems: "center",
  },
});



export default Post;
