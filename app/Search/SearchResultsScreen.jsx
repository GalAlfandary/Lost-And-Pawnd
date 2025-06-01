import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../supabase';
import colors from '../../constants/colors';
import LostCard from '../../components/lostCard';
import PawndCard from '../../components/pawndCard';

/* ───────── helpers: build a supabase filter chain ───────── */
function buildQuery({
  petType,
  petBreedValue,
  name,
  // latitude,
  // longitude,
  // locationEnabled,
  status,
  gender,
  size,
}) {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  /* species ------------------------------------------------ */
  if (petType && petType !== 'all') {
    query = query.eq('pettype', petType);
  }

  /* breed -------------------------------------------------- */
  if (
    petBreedValue &&
    petBreedValue !== 'not_relevant' &&
    petBreedValue !== 'unknown'
  ) {
    query = query.eq('breed', petBreedValue);
  }

  /* name (LIKE, case-insensitive) -------------------------- */
  if (name) query = query.ilike('petname', `%${name}%`);

  /* status -> lost / pawnd --------------------------------- */
  if (status !== 'both') query = query.eq('status', status); // string col

  /* gender ------------------------------------------------- */
  if (gender !== 'both') query = query.eq('gender', gender);

  /* size --------------------------------------------------- */
  if (size !== 'all') query = query.eq('size', size);

  /* geosearch (optional) ----------------------------------- */
  if (locationEnabled && latitude && longitude) {
    // you need a PostGIS function on your DB for distance queries.
    // Example: 'posts_nearby(lat, lon, radius_km)'
    query = supabase.rpc('posts_nearby', {
      lat: latitude,
      lon: longitude,
      radius_km: 10, // or expose a slider
    });
  }

  return query;
}

/* ───────── main component ───────── */
export default function SearchResults() {
  const router  = useRouter();
  const params  = useLocalSearchParams();      // ← all values from the search form
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);

  /* fetch once on mount ----------------------------------- */
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await buildQuery(params);
        if (error) throw error;
        setPosts(data);
      } catch (err) {
        console.error(err);
        Alert.alert('Search error', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []); // params are static for this screen

  /* card helpers ------------------------------------------ */
  const openPost = (post) => router.push({ pathname: 'Post', params: { id: post.postid } });
  const confirmDelete = (post) => Alert.alert('Delete not implemented yet');
  const renderRightActions = () => null; // keep swipeable for future actions

  /* ui: loading ------------------------------------------- */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* ui: results ------------------------------------------- */
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
        <Text style={styles.pageTitle}>Search results</Text>
      </View>

      {/* list */}
      <ScrollView style={styles.scrollContainer}>
        {posts.length === 0 ? (
          <Text style={styles.emptyText}>No posts found with this search</Text>
        ) : (
          posts.map((post) => {
            const Card = post.status === 'lost' ? LostCard : PawndCard;
            return (
              <Swipeable
                key={post.postid}
                renderRightActions={(progress, dragX) =>
                  renderRightActions(progress, dragX, confirmDelete)
                }
              >
                <Card
                  petName={post.petname}
                  imageUrl={post.imageurl}
                  lostDate={post.lostdate || 'Unknown Date'}
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

/* ───────── styles (unchanged) ───────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 50,
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
  backButton: {
    position: 'absolute',
    left: 20,
    backgroundColor: '#ffffff',
    borderRadius: 50,
  },
  scrollContainer: {
    marginVertical: 16,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#777',
  },
});
