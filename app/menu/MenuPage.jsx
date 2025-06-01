import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Avatar, Divider, IconButton, List, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../supabase";
import { useRouter } from "expo-router";
import colors from "../../constants/colors";

export default function MenuPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);           // ← local state
  const [loading, setLoading] = useState(true);

  /* ───────────────── fetch once on mount ───────────────── */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();   // v2 call
      if (error) console.warn("getUser error:", error.message);
      setUser(data?.user ?? null);
      setLoading(false);
    })();
  }, []);

  /* ───────────────── helpers ───────────────── */
  const goBack       = ()        => router.back();
  const goTo         = (path)    => router.push(`/${path}`);
  const handleLogout = async ()  => {
    await supabase.auth.signOut();
    router.replace('/');        
  };

  /* ───────────────── UI ───────────────── */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* back arrow */}
      <IconButton icon="arrow-left" size={24} onPress={goBack} />

      {/* profile */}
      <View style={styles.profileRow}>
        <Avatar.Text
          size={48}
          label={
            user?.user_metadata?.initials ||
            user?.email?.charAt(0)?.toUpperCase() ||
            "?"
          }
          style={{ backgroundColor: colors.primary }}
        />
        <View style={{ marginLeft: 12 }}>
          <Text variant="titleMedium">
            {user?.user_metadata?.full_name || user?.email || "Guest"}
          </Text>
          {/* <Text variant="bodySmall" style={{ color: "#777" }}>
            View Profile
          </Text> */}
        </View>
      </View>

      <Divider />

      <List.Section>
        <List.Item
          title="My Matches"
          left={(p) => <List.Icon {...p} icon="heart-outline" />}
          onPress={() => goTo("menu/my-matches")}
        />
        <List.Item
          title="My Posts"
          left={(p) => <List.Icon {...p} icon="file-document-outline" />}
          onPress={() => goTo("menu/my-posts")}
        />
        {/* <List.Item
          title="Settings"
          left={(p) => <List.Icon {...p} icon="cog-outline" />}
          onPress={() => goTo("settings")}
        /> */}
      </List.Section>

      <Divider />

      <List.Item
        title="Logout"
        left={(p) => <List.Icon {...p} icon="logout" />}
        onPress={handleLogout}
      />
    </View>
  );
}

/* ───────────────── styles ───────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  profileRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
