import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import colors from "../constants/colors"; 

const PetSize = ({ animalSize }) => {
  return (
    <View style={styles.chip}>
      {/* Icon */}
      <Image
        source={require("../assets/images/ruler.png")} 
        style={styles.icon}
      />
      {/* Content */}
      <Text style={styles.text}>
        {animalSize}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff", 
    borderRadius: 5, 
    borderWidth: 1, 
    borderColor: colors.secondary, 
    padding:5,
    maxWidth: "50%", 
    flexShrink: 1, 

  },
  icon: {
    width: 20, 
    height: 20, 
    marginRight: 8, 
  },
  text: {
    fontSize: 14, 
    fontFamily: "JaldiRegular", 
    color: colors.secondaryText, 
    flexShrink: 1,
  },
});

export default PetSize;

