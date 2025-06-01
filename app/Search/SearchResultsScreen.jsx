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

/* ---------- build the Supabase query -------------------- */
function buildQuery(rawParams) {
  // ── 1. normalise params coming from useLocalSearchParams()
  const normalize = (key, def = '') => {
    const v = rawParams[key];
    return Array.isArray(v) ? v[0] || def : v ?? def;
  };

  const petType       = normalize('petType', 'all');       // 'dog' | 'cat' | 'all'
  const breedValue    = normalize('petBreedValue', 'not_relevant');
  const name          = normalize('name', '');
  const status        = normalize('status', 'both');       // 'lost' | 'pawnd' | 'both'
  const gender        = normalize('gender', 'both');       // 'male' | 'female' | 'both'
  const size          = normalize('size', 'all');          // 'small' | ... | 'all'

  // ── 2. start query
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  // ── 3. apply filters only when they are *really* requested
  if (petType !== 'all') {
    // DB stores "Dog" / "Cat" with capital letter – ilike ignores case
    query = query.ilike('animaltype', petType);
  }

  if (breedValue !== 'not_relevant' && breedValue !== 'unknown') {
    query = query.ilike('breed', breedValue);
  }

  if (name.trim() !== '') {
    query = query.ilike('petname', `%${name.trim()}%`);
  }

  if (status === 'lost') query  = query.eq('lost', true);
  if (status === 'pawnd') query = query.eq('lost', false);
  // status === 'both'  → no filter

  if (gender !== 'both') query = query.ilike('gender', gender); 
  if (size   !== 'all')  query = query.eq('size', size);

  return query; // caller still does: const { data, error } = await query;
}


/* ───────── main component ───────── */
export default function SearchResults() {
  const router  = useRouter();
  const params  = useLocalSearchParams();   // params from the search form
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
   const openPost = (post) =>
       router.push({
         pathname: '../post',           // use the exact file name
         params: {
           petName:     post.petname,
           imageUrl:    post.imageurl,
           lostDate:    post.lostdate,
           description: post.description,
           address:     post.address,
           animalType:  post.animaltype,
           breed:       post.breed,
           size:        post.size,
           lost:        String(post.lost), 
           latitude:    post.latitude,
           longitude:   post.longitude,
           gender:      post.gender,
           userID:      post.userid,
         },
       });
  const renderRightActions = () => null;

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
            const Card = post.lost ? LostCard : PawndCard;  
            return (
              <Swipeable key={post.postid} renderRightActions={renderRightActions}>
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
