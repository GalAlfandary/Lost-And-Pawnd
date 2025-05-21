import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Alert } from 'react-native';
import { router, useRouter, useLocalSearchParams } from 'expo-router';
import colors from '../../constants/colors';
import { Button } from 'react-native-paper';

export default function CompareResultsScreen() {
  const { petName, imageUrl, postid, userid } = useLocalSearchParams();
  const [results, setResults] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  console.log('📝 Debug values received in CompareResultsScreen:');
  console.log('  - petName:', petName);
  console.log('  - imageUrl:', imageUrl);
  console.log('  - postid:', postid);
  console.log('  - userid:', userid);

  useEffect(() => {
    const comparePet = async () => {
      try {
        console.log('📤 Sending compare payload:', {
          pet_name: petName,
          pet_picture: imageUrl,
        });
  
        const res = await fetch('http://127.0.0.1:5000/compare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pet_name: petName,
            pet_picture: imageUrl,
            postid: postid,
            userid: userid
          })
        });
  
        if (!res.ok) {
          const text = await res.text(); // fallback if not JSON
          console.error('❌ Server responded with error:', text);
          Alert.alert('Error', 'Server error. Could not compare pets.');
          setLoading(false);
          return;
        }
  
        let data = {};
        try {
          data = await res.json(); // Safe JSON parsing
        } catch (jsonErr) {
          console.error('❌ JSON Parse error:', jsonErr.message);
          Alert.alert('Error', 'Server response was not valid JSON.');
          setLoading(false);
          return;
        }
  
        console.log('✅ Comparison results received:', data);
  
        // Handle either { result: { results: [...] } } or { results: [...] }
        const rawResults = data?.result?.results || data?.results || [];

        rawResults.forEach((result, index) => {
        console.log(`🔍 Result ${index + 1}:`, result);
        });

        if (rawResults.length > 0) {
          setResults(rawResults);
        } else {
          Alert.alert('No Matches Found', 'Server responded, but returned no comparison results.');
        }
      } catch (error) {
        console.error('❌ Error comparing pets:', error.message);
        Alert.alert('Error', 'Could not contact the server.');
      } finally {
        setLoading(false);
      }
    };
  
    if (petName && imageUrl) {
      comparePet();
    }
  }, [petName, imageUrl]);
  
  const renderItem = ({ item }) => (
    <View style={styles.resultBox}>
      <Text style={styles.name}>ID: {item.postid}</Text>
      <Text style={styles.name}>{item.pet2}</Text>
      {item.similarity !== undefined ? (
        <Text style={styles.similarity}>Similarity: {(item.similarity * 100).toFixed(2)}%</Text>
      ) : (
        <Text style={styles.similarity}>Error: {item.error}</Text>
      )}
      <Text style={styles.status}>{item.is_similar ? '✅ Likely Match' : '❌ Not Similar'}</Text>
    </View>
  );
  

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* 🔝 Always visible title */}
      <Text style={styles.header}>Thank You!</Text>

      {/* 📝 Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          We'll notify you if we find any matches for {petName}. Keep an eye on your notifications!
        </Text>
      </View>

      {/* 🔘 Always visible footer */}
      <Button
        mode="contained"
        onPress={() => router.push('/main')}
        style={styles.button}
        labelStyle={{ fontFamily: 'JaldiBold', color: 'white' }}
      >
        Back to Home Page
      </Button>
    </View>
  );
};
  

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 80,
    marginBottom: 80,
  },
  header: {
    fontSize: 36,
    fontFamily: 'JaldiBold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 20,
    fontFamily: 'JaldiRegular',
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 8,
    alignSelf: 'center',
    width: '80%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
  