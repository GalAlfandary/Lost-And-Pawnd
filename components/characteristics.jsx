import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import colors from "../constants/colors"; // Adjust the path to your colors file

const Characteristics = ({ animalType, breed }) => {
  return (
    <View style={styles.chip}>
      {/* Icon */}
      <Image
        source={require("../assets/images/paw.png")} // Replace with your icon image path
        style={styles.icon}
      />
      {/* Content */}
      <Text style={styles.text}>
        {animalType} | {breed}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff", // White background
    borderRadius: 5, // Rounded chip shape
    borderWidth: 1, // Border around the chip
    borderColor: colors.secondary, // Light gray border
    padding:5,
    maxWidth: "50%", // Prevent chip from taking up too much space
    flexShrink: 1, // Allow chip to resize dynamically
    marginRight: 5,
  },
  icon: {
    width: 20, // Icon width
    height: 20, // Icon height
    marginRight: 8, // Space between icon and text
  },
  text: {
    fontSize: 14, // Smaller text size to match chip style
    fontFamily: "JaldiRegular", // Custom font
    color: colors.secondaryText, // Text color
    flexShrink: 1, // Ensure text resizes dynamically
  },
});

export default Characteristics;

