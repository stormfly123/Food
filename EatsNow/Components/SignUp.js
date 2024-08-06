import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export default function SignUp({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const isFocused = useIsFocused();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The passwords do not match');
      setConfirmPassword(''); // Clear the confirm password field
      return;
    }

    try {
      const response = await axios.post('https://vercel.com/faiths-projects-5e5c42e7/backend-user-eats-now/2DsHxJn8PCmQtLVHtWkafo52hbDR', {
        fullName,
        email,
        password,
        phoneNumber,
      });

      console.log('Sign up response:', response.data);

      if (response.data.message) {
        Alert.alert('Sign up successful', 'You can sign in', [
          { text: 'OK', onPress: () => navigation.navigate('SignIn') }, // Navigate to SignIn screen
        ]);
      } else if (response.data.error) {
        console.error('Sign up error:', response.data.error);
        Alert.alert('Sign up failed', response.data.error);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Sign up failed', 'Please try again');
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignIn'); // Define navigation logic to SignIn screen
  };

  useEffect(() => {
    if (!isFocused) {
      // Clear all fields when the component is not focused
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPhoneNumber('');
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={setFullName}
        value={fullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.signInContainer}>
        <TouchableOpacity onPress={navigateToSignIn}>
          <Text style={[styles.signInText, styles.signInLink]}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#ff6600',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    color: '#333',
  },
  signInLink: {
    textDecorationLine: 'underline',
  },
});
