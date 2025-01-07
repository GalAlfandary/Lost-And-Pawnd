import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../constants/colors"; // Adjust the path to your colors file

const LostCard = ({ petName, imageUrl, lostDate, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Image Section */}
      <Image source={require('../assets/images/lostChip.png')} style={styles.chip} />
      <Image source={{ uri: imageUrl }} style={styles.image} />
      
      

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.petName}>{petName}</Text>
        <Text style={styles.date}>Lost in: {lostDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  chip: {
    height: 32,
    width: 65,
    zIndex: 1,
    top: 17,
    left: 5,
  },
  content: {
    padding: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "JaldiBold", // Replace with your font if needed
    color: colors.primary,
    marginBottom: 8,
  },
  date: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 8,
    fontFamily: "JaldiBold",
    backgroundColor:colors.lostChip,
    borderRadius: 5,
    paddingHorizontal: 7,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    fontFamily: "JaldiRegular",
  },
});

export default LostCard;
