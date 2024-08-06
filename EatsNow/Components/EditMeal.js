import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { MealContext } from './MealContext';
import * as ImagePicker from 'expo-image-picker';

const EditMeal = ({ route, navigation }) => {
  const { meal } = route.params;
  const { editMeal } = useContext(MealContext);

  const [mealName, setMealName] = useState(meal.mealName);
  const [description, setDescription] = useState(meal.description);
  const [price, setPrice] = useState(meal.price.toString());
  const [image, setImage] = useState(null); // State to hold the selected image URI

  // Function to handle image picking
  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleEditMeal = () => {
    const updatedMeal = {
      ...meal,
      mealName,
      description,
      price: parseFloat(price),
      image: image, // Assigning the selected image URI to meal object
    };
    editMeal(updatedMeal);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Meal name</Text>
      <TextInput
        style={styles.input}
        value={mealName}
        onChangeText={setMealName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Upload meal image</Text>
      <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.uploadText}>Upload Image</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.uploadHint}>Allowed formats .jpg & .png. less than 1mb</Text>

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleEditMeal}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    color: '#007AFF',
  },
  uploadHint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditMeal;
