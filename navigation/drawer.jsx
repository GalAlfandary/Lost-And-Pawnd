import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import MainPage from "./Main"; // Adjust the path based on your folder structure
import PawndPage from "./PawndPage"; // Adjust or add any other screen/component

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="MainPage">
        <Drawer.Screen name="MainPage" component={MainPage} />
        <Drawer.Screen name="PawndPage" component={PawndPage} />
        {/* Add more screens here if needed */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
