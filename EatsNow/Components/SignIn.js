import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import axios from 'axios';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      setEmail('');
      setPassword('');
    }, [])
  );

  const handleSignIn = async () => {
    try {
      const response = await axios.post('https://vercel.com/faiths-projects-5e5c42e7/backend-user-eats-now/2DsHxJn8PCmQtLVHtWkafo52hbDR', {
        email,
        password,
      });
  
      console.log('Full response:', response);
      console.log('Response data:', response.data);
  
      if (response.data.success) {
        Alert.alert('Sign in successful', 'You are now signed in', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      } else {
        console.error('Sign in error:', response.data.message);
        Alert.alert('Sign in failed', response.data.message);
        setPassword(''); 
      }
    } catch (error) {
      if (error.response) {
        console.error('Sign in error response:', error.response);
        Alert.alert('Sign in failed', `Error: ${error.response.status}`);
      } else if (error.request) {
        console.error('Sign in error request:', error.request);
        Alert.alert('Sign in failed', 'No response from server. Please try again');
      } else {
        console.error('Sign in error message:', error.message);
        Alert.alert('Sign in failed', 'An error occurred. Please try again');
      }
    }
  };
  
  

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Don't have an account? </Text>
        <TouchableOpacity onPress={navigateToSignUp}>
          <Text style={[styles.signInText, styles.signInLink]}>Sign up</Text>
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
