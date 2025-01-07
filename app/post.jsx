import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView,Share, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../supabase"; // Ensure you have this set up
import colors from "../constants/colors";
import { Button,IconButton } from "react-native-paper";
import Characteristics from "../components/characteristics";
import Petsize from "../components/petSize";

const Post = () => {
  
const [loading, setLoading] = useState(false);
const router = useRouter();

const handleContact = async () => {
  setLoading(true);
  // Add your contact logic here
  setLoading(false);
}

const handleShare = async () => {
  setLoading(true);

  try {
    const result = await Share.share({
      message: `Lost Pet Alert!\n\nPet Name: Freddy\nDescription: Lorem Ipsum is simply dummy text of the printing and typesetting industry.\nLast Seen: Adirim 3 - Tel Aviv 6918413\n\nPlease help us find Freddy!`,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log("Shared with activity type:", result.activityType);
      } else {
        console.log("Shared successfully");
      }
    } else if (result.action === Share.dismissedAction) {
      console.log("Share dismissed");
    }
  } catch (error) {
    console.error("Error sharing:", error.message);
    Alert.alert("Error", "Unable to share the post at this time.");
  } finally {
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
  <Image source={require('../assets/images/pugPlaceholder.png')} style={styles.image} />
  <Image source={require('../assets/images/fade.png')} style={styles.fade} />
</View>

      <View style={styles.container}>
        
        <Text style={styles.petName}>Freddy</Text>
        <Text style={styles.date}>Lost in:  7:34 PM 13/3 </Text>
        <Button
          mode="contained"
          onPress={handleContact}
          loading={loading}
          style={styles.primaryButton}
          textColor={colors.background}
          labelStyle={{
            fontFamily: 'JaldiBold',
            fontSize: 16,
                      
          }}
          contentStyle={{
            height: 45, 
            justifyContent: 'center', 
          }}
        > 💬 Contact Owner</Button>
        <Text style={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy. </Text>
        <Text style={styles.Characteristics}>Characteristics </Text>
        <View style={styles.CharacteristicsContainer}>
        <Characteristics animalType="Dog" breed="Pug" />
        <Petsize animalSize="Small" />
        </View>
        
        <Text style={styles.Characteristics}>Last Seen </Text>
        <Text style={styles.address}>Adirim 3 - Tel aviv 6918413 </Text>
        {/* TODO: replace with actual map api */}
        <Image source={require('../assets/images/map.png')} style={styles.imageMap} />
        

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
  
  address: {
    fontSize: 32,
    color: colors.primary,
    fontFamily: "JaldiBold",
  },
  CharacteristicsContainer: {
    flexDirection: "row",
    justifyContent: "left",
    
  },
  Characteristics: {
    fontSize: 18,
    color: colors.secondaryText,
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
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent white
    borderRadius: 50,
  },
  topButtonsContainer: {
    position: "absolute", // Position the buttons container on top of the image
    top: 50, // Adjust the vertical position of the buttons
    left: 16, // Adjust horizontal position
    right: 16, // Ensure the container spans the width of the image
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 20, // Ensure the buttons appear above the fade and main image
  },
  imageMap: {
    width: "100%",
    height: 200,
    borderRadius: 5,
  },
});



export default Post;
