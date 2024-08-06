// src/screens/MenuScreen.js
import React, { useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MealContext } from './MealContext';

const MenuScreen = ({ navigation }) => {
  const { meals, deleteMeal } = useContext(MealContext);

  const confirmDelete = (mealName) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteMeal(mealName),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const renderMealItem = ({ item }) => (
    <View style={styles.mealItem}>
      <Image source={{ uri: item.image }} style={styles.mealImage} />
      <View style={styles.mealDetails}>
        <Text style={styles.mealName}>{item.mealName}</Text>
        <Text style={styles.mealDescription}>{item.description}</Text>
        <Text style={styles.mealPrice}>₦{item.price}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditMeal', { meal: item })}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => confirmDelete(item.mealName)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {meals.length > 0 ? (
        <FlatList
          data={meals}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMealItem}
        />
      ) : (
        <Text style={styles.noMealsText}>No meals added yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  mealItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 16,
  },
  mealImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  mealDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  mealPrice: {
    fontSize: 16,
    color: '#000',
  },
  noMealsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    height:35,
    width:100,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
    height:35
    ,
    width:100,
  },
  buttonText: {
    color: '#fff',
  },
});

export default MenuScreen;
