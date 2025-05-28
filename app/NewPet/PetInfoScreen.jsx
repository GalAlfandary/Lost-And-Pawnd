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
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import colors from '../../constants/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from '../../supabase';
import { decode } from 'base64-arraybuffer'
import { use } from 'react';


export default function PetInfoScreen() {
  const params = useLocalSearchParams();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Unknown', value: 'unknown' },
  ]);
  

  const isEnabled = params.isEnabled === 'true'; // Convert string to boolean

  
  const pickImage = async () => {
    console.log('pickImage called');
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.status !== 'granted') {
      alert('Permission to access gallery was denied');
      return;
    }
  
    console.log('Permission granted');
    const result = await ImagePicker.launchImageLibraryAsync({
      
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.6,
    });
  
    if (!result.canceled) {
      console.log('Selected image:', result.assets[0].uri);
      setImageUri(result.assets[0].uri);
    } else {
      console.log('User cancelled image picker');
    }
  };

const uploadToSupabase = async (uri, petName) => {

  const fileName = `${petName}-${Date.now()}.jpg`;
  const filePath = `pets/${fileName}`;

  const { data, error } = await supabase
    .storage
    .from('pet-images')
    .upload(filePath, {
      uri,
      name: fileName,
      type: 'image/jpeg',
    }, decode('base64FileData'), {
      contentType: 'image/jpeg',
      upsert: true,
    });
  if (error) {
    console.error('Upload error:', error.message);
    alert('Failed to upload image');
    return null;
  }
  console.log('Upload success:', data);
  
  const { data: publicUrlData, error: urlError } = supabase
  .storage
  .from('pet-images')
  .getPublicUrl(filePath);

if (urlError) {
  console.error('Public URL error:', urlError.message);
  return null;
}

const publicUrl = publicUrlData?.publicUrl;
console.log('Public URL:', publicUrl);
return publicUrl;
};




  

  const handleNext = async () => {
  
    if (!name.trim() && isEnabled === false) {
      alert('Please enter a pet name');
      return;
    }
  
    if (!gender) {
      alert('Please select a gender');
      return;
    }

    if(!imageUri)
    {
      alert('Please upload a photo');
      return;
    }

    let imageUrl = null;
  
    try {
      if (imageUri) {
        imageUrl = await uploadToSupabase(imageUri, name);
        if (!imageUrl) {
          alert('Image upload failed.');
          return;
        }
      }
  
      router.push({
        pathname: 'NewPet/PetLocationScreen',
        params: {
          isEnabled,
          name,
          gender: gender,
          imageUri: imageUrl,
        },
      });
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Something went wrong. Please try again.');
    }
    console.log('Next button pressed');
    console.log('Name:', name);
    console.log('Gender', gender);
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
          source={require('../../assets/images/petInfo.png')}
          style={styles.image}
        />
      </View>

      <Text style={[styles.label, { fontSize: 32 },{padding:16},{lineHeight: 35}]}>
        Please provide us with the basic information
      </Text>
      <View style={styles.contentWrapper}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter pet's name"
        style={styles.input}
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.shadowBox}>
      <DropDownPicker
      open={open}
      value={gender}
      items={items}
      setOpen={setOpen}
      setValue={setGender}
      setItems={setItems}
      style={{
        backgroundColor: colors.background,
        marginBottom: 16,
        borderColor: colors.background,
      }}
      dropDownContainerStyle={{
        // backgroundColor: colors.background,
        borderColor: colors.background,
      }}
    />
</View>
      <Text style={styles.label}>Upload a Photo</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
        ) : (
          <Text style={styles.uploadText}>Tap to upload</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button } onPress={handleNext}>
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
  uploadBox: {
    width: '100%',
    height: 100,
    backgroundColor: colors.background,  // same background
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
  statusText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 12,
    color: colors.primary,
    fontFamily: 'JaldiBold',
  },
  dot: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  subText: {
    fontSize: 18,
    marginBottom: 32,
    alignSelf: 'flex-start',
    color: colors.primary,
    fontFamily: 'JaldiBold',
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
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',

  },
});
