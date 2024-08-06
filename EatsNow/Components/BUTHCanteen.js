import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';

const VendorProfileScreen = ({ route }) => {
  const { vendorId } = route.params;
  const [vendor, setVendor] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const vendorResponse = await axios.get(`http://172.20.10.2/Backendphp/profile.php?vendorid=${vendorId}`);
        setVendor(vendorResponse.data);
        
        const mealsResponse = await axios.get(`http://172.20.10.2/Backendphp/process_add_meal.php?vendor_id=${vendorId}&json=true`);
        setMeals(mealsResponse.data);
      } catch (error) {
        console.error('Error fetching vendor details or meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [vendorId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {vendor && (
        <>
          <Image source={{ uri: vendor.cover_image }} style={styles.coverImage} />
          <Image source={{ uri: vendor.profile_image }} style={styles.profileImage} />
          <Text style={styles.location}>{vendor.location}</Text>
        </>
      )}
      <FlatList
        data={meals}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.mealName}>{item.meal_name}</Text>
            <Text style={styles.mealDescription}>{item.description}</Text>
            <Text style={styles.mealPrice}>${item.price}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noMealsText}>No meals available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: -50,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  location: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  mealItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealDescription: {
    fontSize: 14,
    color: '#555',
  },
  mealPrice: {
    fontSize: 14,
    color: '#000',
  },
  noMealsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VendorProfileScreen;
