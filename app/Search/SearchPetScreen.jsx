import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'expo-router';
import { CATS_API_KEY } from '../../constants/secrets';

import AddressAutocomplete from '../../components/AddressAutoComplete';
export default function SearchPetScreen() {
  const router = useRouter();

  /* ------------------------------------------------------------------ */
  /*  STATE                                                             */
  /* ------------------------------------------------------------------ */
  const [petType, setPetType] = useState('dog');

  const [petBreedOpen,   setPetBreedOpen]   = useState(false);
  const [petBreedValue,  setPetBreedValue]  = useState(null);
  const [petBreedItems,  setPetBreedItems]  = useState([]);
  const NOT_RELEVANT  = { label: 'Not relevant', value: 'not_relevant' };
  const unknownOption = { label: "Don't know / Unknown", value: 'unknown' };

  const [nameEnabled,     setNameEnabled]     = useState(false);
  const [name,            setName]            = useState('');

  /* ----------  location / autocomplete ----------------------------- */
  const [locationEnabled, setLocationEnabled] = useState(false); // “near me” toggle
  const [address,         setAddress]         = useState('');    // ⭐ renamed
  const [latitude,        setLatitude]        = useState(null);  // ⭐
  const [longitude,       setLongitude]       = useState(null);  // ⭐
  const [region,          setRegion]          = useState(null);  // ⭐

  const [status, setStatus] = useState('both');
  const [gender, setGender] = useState('both');
  const [size,   setSize]   = useState('all');

  /* ------------------------------------------------------------------ */
  /*  FETCH / RESET BREEDS WHEN PET TYPE CHANGES                        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchBreeds = async () => {
      if (petType === 'all') {
        setPetBreedItems([NOT_RELEVANT]);
        setPetBreedValue('not_relevant');
        return;
      }

      if (petType === 'dog') {
        const res  = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await res.json();
        const flat = Object.entries(data.message).flatMap(([breed, subs]) =>
          subs.length
            ? subs.map((s) => ({ label: `${breed} (${s})`, value: `${breed}-${s}` }))
            : [{ label: breed, value: breed }],
        );
        setPetBreedItems([unknownOption, ...flat]);
      }

      if (petType === 'cat') {
        const res  = await fetch('https://api.thecatapi.com/v1/breeds', {
          headers: { 'x-api-key': CATS_API_KEY },
        });
        const data = await res.json();
        const cat  = data.map((b) => ({ label: b.name, value: b.id }));
        setPetBreedItems([unknownOption, ...cat]);
      }
    };

    fetchBreeds();
  }, [petType]);

  /* ------------------------------------------------------------------ */
  /*  SEARCH HANDLER                                                    */
  /* ------------------------------------------------------------------ */
  const handleSearch = () => {
    console.log({
      petType,
      petBreedValue,
      name,
      address,               
      latitude, longitude,  
      region,                
      status,
      gender,
      size,
    });
    router.push({
      pathname: 'Search/SearchResultsScreen',
      params: {
        petType,
        petBreed: petBreedValue,
        name,
        address,               
        latitude,
        longitude,
        region,
        status, 
        }
      });

  };

  /* ------------------------------------------------------------------ */
  /*  UI                                                                */
  /* ------------------------------------------------------------------ */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* header */}
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

        <Text style={styles.title}>
          Looking for a specific pet?{'\n'}Let’s help you find it!
        </Text>

        {/* PET TYPE */}
        <Text style={styles.sectionLabel}>Pet Type</Text>
        <View style={styles.typeRow}>
          {['dog', 'cat', 'all'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                petType === type && styles.typeButtonActive,
              ]}
              onPress={() => setPetType(type)}
            >
              <Text
                style={[
                  styles.typeText,
                  petType === type && styles.typeTextActive,
                ]}
              >
                {type === 'dog'
                  ? '🐶 Dog'
                  : type === 'cat'
                  ? '🐱 Cat'
                  : 'All'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BREED */}
        <Text style={styles.sectionLabel}>Pet Breed</Text>
        <DropDownPicker
          open={petBreedOpen}
          value={petBreedValue}
          items={petBreedItems}
          setOpen={setPetBreedOpen}
          setValue={setPetBreedValue}
          setItems={setPetBreedItems}
          placeholder="Select pet breed"
          listMode="SCROLLVIEW"
          disabled={petType === 'all'}
          style={[
            styles.dropdown,
            petType === 'all' && { opacity: 0.6 },
          ]}
          dropDownContainerStyle={{ borderColor: colors.background }}
        />
{/* NAME ------------------------------------------------------- */}
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



        {/* LOCATION ----------------------------------------------------- */}
        {/* <Text style={styles.sectionLabel}>Pet Location</Text> */}
        {/* <View style={styles.switchRow}>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
          />
          <Text style={styles.switchLabel}>Find pets near my location</Text>
        </View> */}

{/*         
        {!locationEnabled && (
          <AddressAutocomplete
            value={address}
            onChangeText={setAddress}
            onSelect={(place) => {
              const { formatted, lat, lon } = place.properties;
              setAddress(formatted);
              setLatitude(lat);
              setLongitude(lon);
              setRegion({
                latitude:  parseFloat(lat),
                longitude: parseFloat(lon),
                latitudeDelta:  0.005,
                longitudeDelta: 0.005,
              });
            }}
            onLocationPicked={(place) => {
              const { formatted, lat, lon } = place;
              setAddress(formatted);
              setLatitude(lat);
              setLongitude(lon);
              setRegion({
                latitude:  parseFloat(lat),
                longitude: parseFloat(lon),
                latitudeDelta:  0.005,
                longitudeDelta: 0.005,
              });
            }}
          />
        )} */}

        {/* STATUS */}
        <Text style={styles.sectionLabel}>Pet Status</Text>
        {['lost', 'pawnd', 'both'].map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setStatus(s)}
            style={styles.checkboxRow}
          >
            <Text>
              {status === s ? '✅' : '⬜️'}{' '}
              {s === 'lost' ? 'Lost Pet' : s === 'pawnd' ? 'Pawnd Pet' : 'Both'}
            </Text>
          </TouchableOpacity>
        ))}

        {/* GENDER */}
        <Text style={styles.sectionLabel}>Pet Gender</Text>
        {['male', 'female', 'both'].map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setGender(g)}
            style={styles.checkboxRow}
          >
            <Text>
              {gender === g ? '✅' : '⬜️'}{' '}
              {g === 'male' ? '♂ Male' : g === 'female' ? '♀ Female' : 'Both'}
            </Text>
          </TouchableOpacity>
        ))}

        {/* SIZE */}
        <Text style={styles.sectionLabel}>Pet Size</Text>
        {['small', 'medium', 'large', 'all'].map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setSize(s)}
            style={styles.checkboxRow}
          >
            <Text>
              {size === s ? '✅' : '⬜️'}{' '}
              {s === 'all'
                ? 'All Sizes'
                : s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}

        {/* SEARCH BUTTON */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchText}>Search Pet</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* STYLES (unchanged except input removed) */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 16, paddingBottom: 48 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'JaldiBold',
    color: colors.primary,
    lineHeight: 40,
    paddingTop: 16,
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
    backgroundColor: colors.background,
    borderRadius: 50,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'JaldiBold',
    color: colors.primary,
  },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeButton: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  typeButtonActive: { backgroundColor: colors.primary },
  typeText: { color: colors.primary, fontFamily: 'JaldiBold' },
  typeTextActive: { color: '#fff' },
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
  disabledInput: { opacity: 0.5 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  switchLabel: { marginLeft: 8, fontFamily: 'JaldiRegular' },
  checkboxRow: { marginBottom: 8 },
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
