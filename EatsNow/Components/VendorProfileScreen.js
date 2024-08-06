import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native';

const VendorProfileScreen = ({ route }) => {
  const { vendorId } = route.params;
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://172.20.10.2/Backendphp/get_vendor_details.php?vendor_id=${vendorId}`)
      .then(response => response.text())
      .then(text => {
        try {
          const data = JSON.parse(text);
          setVendor(data);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          console.error('Response text:', text);
        } finally {
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching vendor details:', error);
        setLoading(false);
      });
  }, [vendorId]);

  if (loading) {
    return <ActivityIndicator size="large" color="orange" />;
  }

  if (!vendor) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Vendor details not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: `http://172.20.10.2/Backendphp/uploads/${vendor.profile_image}` }} style={styles.profileImage} />
      <Text style={styles.vendorName}>{vendor.vendor_name}</Text>
      <Text style={styles.vendorLocation}>{vendor.location}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  vendorName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  vendorLocation: {
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default VendorProfileScreen;
