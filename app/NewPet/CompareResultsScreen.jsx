import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import colors from '../../constants/colors';
import { Button } from 'react-native-paper';

export default function CompareResultsScreen() {
  const { petName, imageUrl } = useLocalSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

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
          }),
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
        <Text style={{ marginTop: 10 }}>Comparing pets...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item, index) => `${item.pet2}-${index}`}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <View style={{ marginTop: 50 }}>
          <Text style={styles.header}>Comparison Results</Text>
        </View>
      }
        ListFooterComponent={
        <Button
          mode="contained"
          onPress={() => router.push('/main')}
          style={{
            marginTop: 20,
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: 6,
            alignSelf: 'center',
          }}
          labelStyle={{
            fontSize: 16,
            fontFamily: 'JaldiBold',
            color: 'white',
          }}
        >
          Back to home page
        </Button>
      }
    />
  );
  
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontFamily: 'JaldiBold',
    color: colors.primary,
    marginBottom: 12,
  },
  resultBox: {
    backgroundColor: colors.background,
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: 'JaldiBold',
    color: colors.primary,
  },
  similarity: {
    fontSize: 16,
    marginTop: 4,
  },
  status: {
    marginTop: 4,
    fontSize: 16,
    fontFamily: 'JaldiRegular',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
