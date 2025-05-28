import React, { useState } from 'react';
import { IconButton } from 'react-native-paper';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import colors from '../../constants/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { useEffect } from 'react';
import { CATS_API_KEY } from '../../constants/secrets';




export default function PetCharacteristicsScreen() {
  const params = useLocalSearchParams();
  const [petTypeOpen, setPetTypeOpen] = useState(false);
const [petTypeValue, setPetTypeValue] = useState(null);
const [petTypeItems, setPetTypeItems] = useState([
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
]);
const [petBreedOpen, setPetBreedOpen] = useState(false);
const [petBreedValue, setPetBreedValue] = useState(null);
const [petBreedItems, setPetBreedItems] = useState([]);
const unknownOption = { label: "Don't know / Unknown", value: 'unknown' };

const [petSizeOpen, setPetSizeOpen] = useState(false);
const [petSizeValue, setPetSizeValue] = useState(null);
const [petSizeItems, setPetSizeItems] = useState([
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
]);

const{
  isEnabled, name, gender, imageUri, address, latitude, longitude 
} =params; // Get the value from the previous screen

useEffect(() => {
  const fetchBreeds = async () => {
    if (petTypeValue === 'dog') {
      const res = await fetch('https://dog.ceo/api/breeds/list/all');
      const data = await res.json();
      const flatBreeds = Object.entries(data.message).flatMap(([breed, subBreeds]) =>
        subBreeds.length > 0
          ? subBreeds.map((sub) => ({ label: `${breed} (${sub})`, value: `${breed}-${sub}` }))
          : [{ label: breed, value: breed }]
      );
      setPetBreedItems([unknownOption, ...flatBreeds]);
    }

    if (petTypeValue === 'cat') {
      const res = await fetch('https://api.thecatapi.com/v1/breeds', {
        headers: {
          'x-api-key': CATS_API_KEY, 
        },
      });

      const data = await res.json();
      const formatted = data.map((breed) => ({
        label: breed.name,
        value: breed.id,
      }));
      setPetBreedItems([unknownOption, ...formatted]);
    }
  };

  if (petTypeValue) {
    fetchBreeds();
  }
}, [petTypeValue]);

  

  const handleNext = () => {
    if (!petTypeValue || !petBreedValue || !petSizeValue) {
      alert('Please select all pet characteristics');
      return;
    }
    router.push({
      pathname: 'NewPet/PetDescriptionScreen',
      params: { isEnabled, name,gender, imageUri, address, latitude, longitude , petTypeValue, petBreedValue, petSizeValue }, // Pass the state as a parameter
        
    });
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <IconButton
          icon="arrow-left"
          onPress={() => router.back()}
          size={24}
          style={styles.backButton}
          iconColor={colors.primary}
        />
        <Text style={styles.pageTitle}>New Pet</Text>
        <Image
          source={require('../../assets/images/petCharacteristics.png')}
          style={styles.image}
        />
      </View>

      <Text style={[styles.label, { fontSize: 32 },{padding:16},{lineHeight: 35}]}>
      What are the Characteristics of your pet?</Text>
      <View style={styles.contentWrapper}>
      <Text style={styles.label}>Pet type</Text>
      <DropDownPicker
    open={petTypeOpen}
    value={petTypeValue}
    items={petTypeItems}
    setOpen={(open) => {
      setPetTypeOpen(open);
      setPetBreedOpen(false);
      setPetSizeOpen(false);
    }}
    setValue={setPetTypeValue}
    setItems={setPetTypeItems}
    placeholder="Select pet type"
    style={{
      backgroundColor: colors.background,
      marginBottom: 16,
      borderColor: colors.background,
    }}
    zIndex={3000}
  zIndexInverse={1000}
    dropDownContainerStyle={{
      // backgroundColor: colors.background,
      borderColor: colors.background,
    }}
  />

<Text style={styles.label}>Pet breed</Text>
      <DropDownPicker
    open={petBreedOpen}
    value={petBreedValue}
    items={petBreedItems}
    setOpen={(open) => {
      setPetBreedOpen(open);
      setPetTypeOpen(false);
      setPetSizeOpen(false);
    }}
    setValue={setPetBreedValue}
    setItems={setPetBreedItems}
    placeholder="Select pet breed"
    style={{
      backgroundColor: colors.background,
      marginBottom: 16,
      borderColor: colors.background,
    }}
    zIndex={2000}
  zIndexInverse={2000}
    dropDownContainerStyle={{
      // backgroundColor: colors.background,
      borderColor: colors.background,
    }}
  />

<Text style={styles.label}>Pet size</Text>
      <DropDownPicker
    open={petSizeOpen}
    value={petSizeValue}
    items={petSizeItems}
    setOpen={(open) => {
      setPetSizeOpen(open);
      setPetTypeOpen(false);
      setPetBreedOpen(false);
    }}
    setValue={setPetSizeValue}
    setItems={setPetSizeItems}
    placeholder="Select pet size"
    style={{
      backgroundColor: colors.background,
      marginBottom: 16,
      borderColor: colors.background,
    }}
    zIndex={1000}
  zIndexInverse={3000}
    dropDownContainerStyle={{
      // backgroundColor: colors.background,
      borderColor: colors.background,
    }}
  />
        
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentWrapper: {
    width: '100%',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
    color: colors.primary,
    fontFamily: 'JaldiBold',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
  },
  backButton: {
    backgroundColor: colors.background, // Semi-transparent white
    borderRadius: 50,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 'auto', // ✅ pushes image to the right
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
  input: {
    width: '100%',
    backgroundColor: colors.background,  // light mint/gray background
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontFamily: 'JaldiRegular',
  
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start',
    color: colors.primary,
    fontFamily: 'JaldiBold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#ced3d1',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 32,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'JaldiBold',
    textAlign: 'center',
  },
});
