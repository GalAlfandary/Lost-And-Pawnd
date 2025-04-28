import React, { useState } from 'react';
import { IconButton } from 'react-native-paper';

import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../../constants/colors';

export default function SearchPetScreen() {
  const [petType, setPetType] = useState('dog'); // dog, cat, all

  const [nameEnabled, setNameEnabled] = useState(false);
  const [name, setName] = useState('');

  const [locationEnabled, setLocationEnabled] = useState(false);
  const [location, setLocation] = useState('');

  const [raceOpen, setRaceOpen] = useState(false);
  const [raceValue, setRaceValue] = useState(null);
  const [raceItems, setRaceItems] = useState([
    { label: 'All Races', value: 'all' },
    { label: 'Labrador', value: 'labrador' },
    { label: 'Siamese', value: 'siamese' },
  ]);

  const [status, setStatus] = useState('both');
  const [gender, setGender] = useState('both');
  const [size, setSize] = useState('all');

  const handleSearch = () => {
    console.log({ petType, name, location, raceValue, status, gender, size });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
                <IconButton
                  icon="arrow-left"
                  onPress={() => router.back()}
                  size={24}
                  style={styles.backButton}
                  iconColor={colors.primary}
                />
                <Text style={styles.pageTitle}>Search Pet</Text>
                
              </View>
        <Text style={styles.title}>Looking for a specific pet?{'\n'}Let’s help you find it!</Text>

        {/* Pet Type Selector */}
        <Text style={styles.sectionLabel}>Pet Type</Text>
        <View style={styles.typeRow}>
          {['dog', 'cat', 'all'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeButton, petType === type && styles.typeButtonActive]}
              onPress={() => setPetType(type)}
            >
              <Text style={[styles.typeText, petType === type && styles.typeTextActive]}>
                {type === 'dog' ? '🐶 Dog' : type === 'cat' ? '🐱 Cat' : 'All'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Race Dropdown */}
        <Text style={styles.sectionLabel}>Pet Breed</Text>
        <DropDownPicker
          open={raceOpen}
          value={raceValue}
          items={raceItems}
          setOpen={setRaceOpen}
          setValue={setRaceValue}
          setItems={setRaceItems}
          placeholder="All Races"
          zIndex={3000}
          zIndexInverse={1000}
          style={styles.dropdown}
          dropDownContainerStyle={{ backgroundColor: colors.background }}
        />

        {/* Name Toggle & Input */}
        <Text style={styles.sectionLabel}>Pet Name</Text>
        <View style={styles.switchRow}>
          <Switch value={nameEnabled} onValueChange={setNameEnabled} />
          <Text style={styles.switchLabel}>Don’t search by specific name</Text>
        </View>
        <TextInput
          editable={!nameEnabled}
          placeholder="Pet Name"
          value={name}
          onChangeText={setName}
          style={[styles.input, nameEnabled && styles.disabledInput]}
        />

        {/* Location Toggle & Input */}
        <Text style={styles.sectionLabel}>Pet Location</Text>
        <View style={styles.switchRow}>
          <Switch value={locationEnabled} onValueChange={setLocationEnabled} />
          <Text style={styles.switchLabel}>Find pets near my location</Text>
        </View>
        <TextInput
          editable={!locationEnabled}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          style={[styles.input, locationEnabled && styles.disabledInput]}
        />

        {/* Pet Status */}
        <Text style={styles.sectionLabel}>Pet Status</Text>
        {['lost', 'pawnd', 'both'].map((s) => (
          <TouchableOpacity key={s} onPress={() => setStatus(s)} style={styles.checkboxRow}>
            <Text>{status === s ? '✅' : '⬜️'} {s === 'lost' ? 'Lost Pet' : s === 'pawnd' ? 'Pawnd Pet' : 'Both'}</Text>
          </TouchableOpacity>
        ))}

        {/* Pet Gender */}
        <Text style={styles.sectionLabel}>Pet Gender</Text>
        {['male', 'female', 'both'].map((g) => (
          <TouchableOpacity key={g} onPress={() => setGender(g)} style={styles.checkboxRow}>
            <Text>{gender === g ? '✅' : '⬜️'} {g === 'male' ? '♂ Male' : g === 'female' ? '♀ Female' : 'Both'}</Text>
          </TouchableOpacity>
        ))}

        {/* Pet Size */}
        <Text style={styles.sectionLabel}>Pet Size</Text>
        {['small', 'medium', 'large', 'all'].map((s) => (
          <TouchableOpacity key={s} onPress={() => setSize(s)} style={styles.checkboxRow}>
            <Text>{size === s ? '✅' : '⬜️'} {s === 'all' ? 'All Sizes' : s.charAt(0).toUpperCase() + s.slice(1)}</Text>
          </TouchableOpacity>
        ))}

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchText}>Search Pet</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 16, paddingBottom: 48 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'JaldiBold',
    color: colors.primary,
    lineHeight: 40,

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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.background, // Semi-transparent white
    borderRadius: 50,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'JaldiBold',
    color: colors.primary,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeText: {
    color: colors.primary,
    fontFamily: 'JaldiBold',
  },
  typeTextActive: {
    color: '#fff',
  },
  dropdown: {
    backgroundColor: colors.background,
    borderColor: colors.background,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontFamily: 'JaldiRegular',
  },
  disabledInput: {
    opacity: 0.5,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchLabel: {
    marginLeft: 8,
    fontFamily: 'JaldiRegular',
  },
  checkboxRow: {
    marginBottom: 8,
  },
  searchButton: {
    marginTop: 32,
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
  },
  searchText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'JaldiBold',
  },
});
