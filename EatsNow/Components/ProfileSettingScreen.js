import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const defaultImageUrl = 'https://cdn-icons-png.freepik.com/256/4653/4653863.png?ga=GA1.1.2075240241.1720007007&semt=ais_hybrid';

const ProfileSettings = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(defaultImageUrl);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://172.20.10.2/Backend/ProfileDisplay.php');
      const userData = response.data;
      setFullName(userData.fullName);
      setEmail(userData.email);
      setProfileImage(userData.profileImage || defaultImageUrl);
    } catch (error) {
      console.error('Profile fetch error:', error);
      Alert.alert('Error', 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAccount(),
        },
      ],
      { cancelable: true }
    );
  };

  const deleteAccount = async () => {
    try {
      const response = await axios.post('http://172.20.10.2/Backend/ProfileDisplay.php');
      console.log('Delete user response:', response.data);
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Delete user error:', error);
      Alert.alert('Error', 'Failed to delete account');
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-back" size={25} color="#000" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.profileHeader}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        <Text style={styles.profileName}>{fullName}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
      </View>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('PersonalDataScreen')}>
        <Icon name="person-outline" size={25} color="#000" style={styles.optionIcon} />
        <Text style={styles.optionText}>Personal Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={confirmDeleteAccount}>
        <Icon name="trash-outline" size={25} color="#000" style={styles.optionIcon} />
        <Text style={styles.optionText}> Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={() => navigation.navigate('SignIn')}>
        <Icon name="log-out-outline" size={25} color="#fff" style={styles.optionIcon} />
        <Text style={[styles.optionText, { color: '#fff' }]}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 5,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: 'orange',
    borderRadius: 5,
  },
});

export default ProfileSettings;
