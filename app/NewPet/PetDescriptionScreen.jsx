import React, { useState,useEffect } from 'react';
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
import { supabase } from '../../supabase';


export default function PetDescriptionScreen() {
  const params = useLocalSearchParams();
  const [description, setDescription] = useState('');

  const {
    isEnabled,
    name,
    gender,
    imageUri,
    address,
    latitude,
    longitude,
    petTypeValue,
    petBreedValue,
    petSizeValue,
  } = params; // Get the value from the previous screen
  
  const [userIdValue, setUserIdValue] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await supabase.auth.getUser();
      setUserIdValue(userId.data.user.id);
      console.log('User ID:', userId.data.user.id);
    };
    fetchUserId();
  }, []);

  const handleNext = async () => {
    const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        petname: name || 'Unknown',
        gender,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        imageurl: imageUri,
        lost: isEnabled === 'false' || isEnabled === false,
        animaltype: petTypeValue,
        breed: petBreedValue,
        size: petSizeValue,
        lostdate: new Date().toISOString(),
        userid: userIdValue,
      }
    ])
    .select()
    .single();
  
    if (error) {
      console.error('❌ Error saving to Supabase:', error.message);
      alert('Error saving post. Try again.');
    } else {
      const insertedPostId = data?.postid;
      console.log('📝 Debug values before navigation:');
      console.log('  - insertedPostId:', insertedPostId);
      console.log('  - userIdValue:', userIdValue);
      console.log('  - name:', name);
      console.log('  - imageUri:', imageUri);

      alert('✅ Post added successfully!');
      router.push({
        pathname: '/NewPet/CompareResultsScreen',
        params: {
          petName: name || 'Unknown',
          imageUrl: imageUri,
          postid: insertedPostId,
          userid: userIdValue
        },
      });
    }
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
          source={require('../../assets/images/petDescription.png')}
          style={styles.image}
        />
      </View>

      <Text style={[styles.label, { fontSize: 32 },{padding:16},{lineHeight: 35}]}>
      Describe shortly the situation in your own words</Text>
      <View style={styles.contentWrapper}>
      <Text style={styles.label}>Description</Text>
      <TextInput
  value={description}
  onChangeText={setDescription}
  multiline
  numberOfLines={4}
  placeholder="Describe the situation"
  style={styles.input}
  placeholderTextColor={colors.secondary}
  maxLength={120}
/>
<Text style={styles.charCounter}>
  {description.length} / 120
</Text>

        
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Submit</Text>
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
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 32,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  buttonText: {
    color: colors.background, // Text color
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'JaldiBold',
    textAlign: 'center',
  },
  charCounter: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    color: colors.primary,
    fontFamily: 'JaldiRegular',
    fontSize: 12,
  },
  
});
