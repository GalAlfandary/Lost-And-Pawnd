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

export default function MyMatches() {
  const router = useRouter();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ───────── fetch alerts + posts ───────── */
  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user) {
        console.warn("Unable to fetch user:", userErr?.message);
        setMatches([]);
        setLoading(false);
        return;
      }
      const userId = userData.user.id;

      const { data: alerts, error: alertsErr } = await supabase
        .from("alerts")
        .select("*")
        .or(`user_1.eq.${userId},user_2.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (alertsErr || !alerts?.length) {
        if (alertsErr) console.warn(alertsErr.message);
        setMatches([]);
        setLoading(false);
        return;
      }

      const otherPostIds = alerts.map((a) =>
        a.user_1 === userId ? a.postid_2 : a.postid_1
      );

      const { data: posts, error: postsErr } = await supabase
        .from("posts")
        .select("*")
        .in("postid", otherPostIds);

      if (postsErr) {
        console.warn(postsErr.message);
        setMatches([]);
        setLoading(false);
        return;
      }

      const postMap = Object.fromEntries(posts.map((p) => [p.postid, p]));
      const items = alerts
        .map((alert) => {
          const otherPostId =
            alert.user_1 === userId ? alert.postid_2 : alert.postid_1;
          const post = postMap[otherPostId];
          if (!post) return null;
          const unseen =
            (alert.user_1 === userId && !alert.seen_by_user_1) ||
            (alert.user_2 === userId && !alert.seen_by_user_2);
          return { alert, post, unseen };
        })
        .filter(Boolean);

      setMatches(items);
      setLoading(false);
    })();
  }, []);

  /* ───────── helpers ───────── */
  const openPost = async ({ alert, post, unseen }) => {
    const { id: alertId, user_1, user_2 } = alert;
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user.id;

    if (unseen) {
      const seenField = user_1 === userId ? "seen_by_user_1" : "seen_by_user_2";
      await supabase.from("alerts").update({ [seenField]: true }).eq("id", alertId);
      setMatches((prev) =>
        prev.map((m) =>
          m.alert.id === alertId ? { ...m, unseen: false } : m
        )
      );
    }

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
  };

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
        <Text style={styles.pageTitle}>My Matches 🎉</Text>
      </View>

      {/* list */}
      <ScrollView style={styles.scrollContainer}>
        {matches.length === 0 ? (
          <Text style={styles.emptyText}>No matches yet.</Text>
        ) : (
          matches.map(({ alert, post, unseen }) => {
            const CardView = post.lost ? LostCard : PawndCard;  /* ★ rename */
            return (
              <View key={alert.id} style={{ position: "relative" }}>
                <CardView
                  petName={post.petname}
                  imageUrl={post.imageurl}
                  lostDate={post.lostdate || "Unknown Date"}
                  onPress={() => openPost({ alert, post, unseen })}
                />
                {unseen && <View style={styles.badge} />}
              </View>
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
  badge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "red",
    position: "absolute",
    top: 10,
    right: 20,
  },
});
