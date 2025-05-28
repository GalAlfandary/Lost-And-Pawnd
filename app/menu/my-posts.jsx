import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Text, IconButton } from "react-native-paper";
import { supabase } from "../../supabase";
import { useRouter } from "expo-router";
import colors from "../../constants/colors";
import LostCard from "../../components/lostCard";
import PawndCard from "../../components/pawndCard";
import { Swipeable } from "react-native-gesture-handler";
import { Alert } from "react-native";

export default function MyPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const renderRightActions = (progress, dragX, onDelete) => (
    <View                       /* width matches LostCard / PawndCard padding */
      style={{
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 24,
        flex: 1,
        backgroundColor: "tomato",
      }}
    >
      <IconButton              /* from react-native-paper */
        icon="trash-can-outline"
        iconColor="#fff"
        size={28}
        onPress={onDelete}
      />
    </View>
  );
  
  /* call this to actually delete from DB + local list */
  const deletePost = async (postid) => {
    const { error } = await supabase.from("posts").delete().eq("postid", postid);
    if (error) {
      Alert.alert("Error", "Could not delete post. Please try again.");
      return false;
    }
    // success: filter it out of UI
    setPosts((prev) => prev.filter((p) => p.postid !== postid));
    return true;
  };

  /* ───────── fetch current user’s posts ───────── */
  useEffect(() => {
    (async () => {
      setLoading(true);

      // 1️⃣ current user
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user) {
        console.warn("Unable to fetch user:", userErr?.message);
        setPosts([]);
        setLoading(false);
        return;
      }

      // 2️⃣ fetch all posts for that user
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("userid", userData.user.id)
        .order("created_at", { ascending: false });

      setPosts(error ? [] : data || []);
      if (error) console.warn("Error fetching user posts:", error.message);
      setLoading(false);
    })();
  }, []);

  /* ───────── helpers ───────── */
  const openPost = (post) =>
    router.push({
      pathname: "/post",
      params: {
        id: post.postid,
        petName: post.petname,
        imageUrl: post.imageurl,
        lostDate: post.lostdate || "Unknown Date",
        description: post.description || "No description provided.",
        animalType: post.animaltype || "Unknown",
        breed: post.breed || "Unknown",
        size: post.size || "Unknown",
        lost: post.lost,
        latitude: post.latitude,
        longitude: post.longitude,
        gender: post.gender || "Unknown",
        userID: post.userid,
      },
    });

  /* ───────── UI ───────── */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.titleContainer}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text style={styles.pageTitle}>My Posts 🐾</Text>
      </View>

      {/* list */}
      <ScrollView style={styles.scrollContainer}>
      {posts.length === 0 ? (
  <Text style={styles.emptyText}>You haven’t posted any pets yet.</Text>
) : (
  posts.map((post) => {
    const CardView = post.lost ? LostCard : PawndCard;

    const confirmDelete = () =>
      Alert.alert(
        "Delete Post",
        "Are you sure you want to delete this post? This can’t be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deletePost(post.postid),
          },
        ]
      );

    return (
      <Swipeable
        key={post.postid}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, confirmDelete)
        }
        friction={1.5} /* optional: slows the swipe a bit */
      >
        <CardView
          petName={post.petname}
          imageUrl={post.imageurl}
          lostDate={post.lostdate || "Unknown Date"}
          onPress={() => openPost(post)}
        />
      </Swipeable>
    );
  })
)}

      </ScrollView>
    </View>
  );
}

/* ───────── styles ───────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginTop: 50,
  },
  pageTitle: {
    fontSize: 16,
    color: colors.primary,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: "JaldiRegular",
  },
  backButton: {
    position: "absolute",
    left: 20,
    backgroundColor: "#ffffff",
    borderRadius: 50,
  },
  scrollContainer: {
    marginVertical: 16,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
  },
});
