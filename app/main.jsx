import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView,Image } from "react-native";
import { Text, Button, Card, Title, Switch,IconButton } from "react-native-paper";
import { supabase } from "../supabase";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import colors from "../constants/colors";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import LostCard from "../components/lostCard";
import PawndCard from "../components/pawndCard";


const MainPage = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      //Alert.alert("Error", "Could not fetch posts");
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

  const handleCardPress = (post) => {
    router.push({
      pathname: '/post',
      params: {
        id: post.id,
        petName: post.petname,
        imageUrl: post.imageurl,
        lostDate: post.lostdate || "Unknown Date",
        description: post.description || "No description provided.",
        address: post.address || "No address provided.",
        animalType: post.animalType || "Unknown",
        breed: post.breed || "Unknown",
        size: post.size || "Unknown",
        lost: post.lost,
      },
    });
  };
  

  const handleCreatePost = () => {
    router.push("/create-post"); // Route to the create post screen
  };

  if (isEnabled) { // Render PawndPage
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <IconButton
            icon="menu"
            onPress={() => navigation.openDrawer()} 
            size={24}
            style={styles.menuButton}
            iconColor={colors.primary}
          />
          <Text style={styles.pageTitle}>Pawnd Pets 🛟</Text>
          <Switch
            style={styles.switch}
            thumbColor={isEnabled ? colors.onBoardingBackground : colors.lostChip}
            trackColor={{ true: colors.primary }}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          style={styles.primaryButton}
          onPress={() => router.push("/lost-pets")}
          labelStyle={{
            fontFamily: 'JaldiBold',
            fontSize: 18,
                      
          }}
          contentStyle={{
            height: 45, // Set a fixed height
            justifyContent: 'center', // Center content vertically
          }}
        >
          + New Post
        </Button>
        <Button
          mode="contained"
          style={styles.searchButton}
          onPress={() => router.push("/lost-pets")}
          labelStyle={{
            fontFamily: 'JaldiBold',
            fontSize: 18,       
          }}
          contentStyle={{
            height: 45, // Set a fixed height
            justifyContent: 'center', // Center content vertically
          }}
          textColor={colors.primary}
        >
          🔍 Search
        </Button>

      </View>

      <ScrollView style={styles.scrollContainer}>
  {posts.map((post) =>
    (isEnabled ? !post.lost : post.lost) && (
      <PawndCard
        key={post.id}
        petName={post.petname}
        imageUrl={post.imageurl}
        lostDate={post.lostdate || "Unknown Date"}
        onPress={() => handleCardPress(post)} // Pass the full post data
      />
    )
  )}
</ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
      <IconButton
          icon="menu"
          onPress={() => router.push('../')}
          size={24}
          style={styles.menuButton}
          iconColor={colors.primary}
        />
        <Text style={styles.pageTitle}>Lost Pets 🐾</Text>
        <Switch
        style={styles.switch}
        thumbColor={isEnabled ? colors.onBoardingBackground : colors.lostChip} 
        trackColor={{ true: colors.primary }} 
        onValueChange={toggleSwitch}
        value={isEnabled}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          style={styles.primaryButton}
          onPress={() => router.push("/lost-pets")}
          labelStyle={{
            fontFamily: 'JaldiBold',
            fontSize: 18,
                      
          }}
          contentStyle={{
            height: 45, // Set a fixed height
            justifyContent: 'center', // Center content vertically
          }}
        >
          + New Post
        </Button>
        <Button
          mode="contained"
          style={styles.searchButton}
          onPress={() => router.push("/lost-pets")}
          labelStyle={{
            fontFamily: 'JaldiBold',
            fontSize: 18,       
          }}
          contentStyle={{
            height: 45, // Set a fixed height
            justifyContent: 'center', // Center content vertically
          }}
          textColor={colors.primary}
        >
          🔍 Search
        </Button>

      </View>

      <ScrollView style={styles.scrollContainer}>
  {posts.map((post) =>
    (isEnabled ? !post.lost : post.lost) && (
      <LostCard
        key={post.id}
        petName={post.petname}
        imageUrl={post.imageurl}
        lostDate={post.lostdate || "Unknown Date"}
        onPress={() => handleCardPress(post)} // Pass the full post data
      />
    )
  )}
</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 50,
  },
  buttonsContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'left',
    paddingHorizontal: 16,
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
  primaryButton: {
    paddingVertical: 2,
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginRight: 5,
    alignItems: 'center',
    
  },
  searchButton: {
    paddingVertical: 2,
    backgroundColor: "#ffffff",
    borderRadius: 100,
    marginRight: 5,
    justifyContent: 'center',
  },
  menuButton: {
    position: 'absolute',
    left: 20,
    backgroundColor: "#ffffff",
    borderRadius: 50,
  },
  scrollContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  card: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  loadingText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#777",
  },
  switchContainer: {
    position: "absolute",
    bottom: 80, // Adjust the position above the "Create a Post" button
    alignSelf: "center", // Center horizontally
  },
  createButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#6200ee",
  },
  switch: {
    position: "absolute",
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 50,
  },
});

export default MainPage;
