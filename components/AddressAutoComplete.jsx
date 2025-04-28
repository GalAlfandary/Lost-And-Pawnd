import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import * as Location from 'expo-location';
import colors from '../constants/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { GEOAPIFY_API_KEY } from '../constants/secrets';



export default function AddressAutocomplete({ value, onChangeText, onSelect, onLocationPicked }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectionMade, setSelectionMade] = useState(false);


  useEffect(() => {
    if (!value || value.length < 3 || selectionMade) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            value
          )}&limit=5&apiKey=${GEOAPIFY_API_KEY}`
        );
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [value, selectionMade]);

  const handleSelect = (item) => {
    const { formatted, lat, lon } = item.properties;
    onChangeText(formatted);
    setSelectionMade(true);
    setSuggestions([]);
    onSelect(item);
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });

      let readableAddress = 'Current Location';
      if (geocode.length > 0) {
        const { street, name, city, region } = geocode[0];
        readableAddress = `${name || street}, ${city || region}`;
      }

      // Update input & notify parent
      onChangeText(readableAddress);
      setSelectionMade(true);
      setSuggestions([]);

      onLocationPicked({
        formatted: readableAddress,
        lat: latitude,
        lon: longitude,
      });
    } catch (error) {
      console.error(error);
      alert('Error fetching location. Please try again.');
    }
  };

  return (
    <View style={{ zIndex: 10 }}>
      <TextInput
        placeholder="Enter last location"
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          setSelectionMade(false);
        }}
        style={styles.input}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.properties.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelect(item)}
            >
              <Text>{item.properties.formatted}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
        />
      )}
      <TouchableOpacity onPress={handleUseCurrentLocation}style={styles.ghostButton}>
        <Text style={styles.ghostButtonText}>Use my current location</Text>
      </TouchableOpacity>

      
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    fontFamily: 'JaldiRegular',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    elevation: 2,
  },

  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  ghostButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: -8,
  },
  
  ghostButtonText: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontFamily: 'JaldiRegular',
    fontSize: 18,
    fontcolor: colors.secondary,
  },
});
