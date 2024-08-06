import React, { useRef } from 'react';
import { Paystack, PayStackRef } from 'react-native-paystack-webview';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

import localImage from '../assets/pay.png'; // Adjust the path as needed

const PaymentScreen = () => {
  const paystackWebViewRef = useRef(PayStackRef);
  const navigation = useNavigation();
  const route = useRoute();
  const { name, address, phone, totalAmount, cartItems, vendorId } = route.params;

  // Log route parameters to verify vendorId is present
  console.log('Route Params:', route.params);

  // Function to handle successful payment
  const handleSuccess = (response) => {
    console.log('Payment successful:', response);

    // Prepare order data
    const orderData = {
      vendor_id: vendorId,
      customer_name: name,
      customer_address: address,
      customer_phone: phone,
      order_details: JSON.stringify(cartItems), // Convert cart items to JSON string
      total_amount: totalAmount.toFixed(2) // Ensure totalAmount is formatted to 2 decimal places
    };

    // Log order data to verify before sending to server
    console.log('Order Data:', orderData);

    // Send order data to server using Axios
    axios.post('http://172.20.10.2/Backendphp/payment_confirmation.php', orderData)
      .then(response => {
        console.log('Response from server:', response.data);
        // Show an alert message
        Alert.alert(
          'Order Received',
          'Your order has been received. You will receive a call shortly.',
          [
            { text: 'OK', onPress: () => navigation.navigate('Home', { order: response.data }) }
          ]
        );
      })
      .catch(error => {
        console.error('Error placing order:', error);
        Alert.alert('Error', 'Failed to place order. Please try again.');
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-outline" size={30} color="#000" />
      </TouchableOpacity>
      <Image source={localImage} style={styles.image} />

      <Paystack
        paystackKey="pk_test_08ebe645c50d73bf06981e97696896d3224637ec"
        billingEmail="paystackwebview@something.com"
        amount={`${totalAmount.toFixed(2)}`} // Ensure the amount is a string and formatted to 2 decimal places
        onCancel={(e) => {
          console.log('Payment cancelled:', e);
        }}
        onSuccess={handleSuccess}
        ref={paystackWebViewRef}
        style={styles.webview}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => paystackWebViewRef.current.startTransaction()}
      >
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  backIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  webview: {
    width: '100%',
    height: 400,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'orange',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
