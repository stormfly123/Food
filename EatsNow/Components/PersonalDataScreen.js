import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const defaultImageUrl = 'https://cdn-icons-png.freepik.com/256/4653/4653863.png?ga=GA1.1.2075240241.1720007007&semt=ais_hybrid'; // Replace with your default image URL


// Array of predefined images
const predefinedImages = [
  {
    id: 1,
    uri: 'https://i.pinimg.com/236x/63/30/1c/63301ca8ef272e9810a395b766056888.jpg',
  },
  {
    id: 2,
    uri: 'https://i.pinimg.com/236x/3d/ad/9c/3dad9c263d779ca1ecb708a66434a8a3.jpg',
  },
  {
    id: 3,
    uri: 'https://i.pinimg.com/236x/de/ab/10/deab105039fb5c08a48a162d339e2a57.jpg',
  },
  {
    id: 4,
    uri: 'https://i.pinimg.com/564x/9d/ed/71/9ded718a029a1f8e6a2885e9ad10f690.jpg',
  },
  {
    id: 5,
    uri: 'https://i.pinimg.com/564x/4f/e3/28/4fe328211b1890c1c4d032d0e7bc756b.jpg',
  },
];

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://172.20.10.2/Backend/ProfileDisplay.php');
      const userData = response.data;
      setFullName(userData.fullName);
      setPhoneNumber(userData.phoneNumber);
      setEmail(userData.email);
      setProfileImage(userData.profileImage || defaultImageUrl);
    } catch (error) {
      console.error('Profile fetch error:', error);
      Alert.alert('Error', 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        setProfileImage(uri);
      }
    });
  };

  const saveProfile = async () => {
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('email', email);

    if (imageUri) {
      const imageName = imageUri.split('/').pop();
      formData.append('profileImage', {
        uri: imageUri,
        type: 'image/jpeg', // You can determine the type from the file extension
        name: imageName,
      });
    }

    try {
      const response = await axios.put('http://172.20.10.2/Backend/ProfileUpdate.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully');
        fetchUserProfile(); // Fetch updated profile to ensure UI reflects the changes
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6600" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="arrow-back" size={30} color="#000" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight}></View>
      </View>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
            <Icon name="camera-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      <View style={styles.predefinedImagesContainer}>
        <Text style={styles.predefinedImagesTitle}>Alternative Images:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {predefinedImages.map((image) => (
            <TouchableOpacity
              key={image.id}
              style={styles.predefinedImageContainer}
              onPress={() => setProfileImage(image.uri)}
            >
              <Image source={{ uri: image.uri }} style={styles.predefinedImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 30,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ff6600',
    borderRadius: 15,
    padding: 5,
  },
  form: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  disabledInput: {
    backgroundColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#ff6600',
    margin: 20,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  predefinedImagesContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  predefinedImagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  predefinedImageContainer: {
    marginRight: 10,
  },
  predefinedImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});


export default ProfileScreen;
