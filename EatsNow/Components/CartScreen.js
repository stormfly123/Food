import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ route, navigation }) => {
  const { cartItems = [] } = route.params || [];
  const [savedCartItems, setSavedCartItems] = useState([]);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@cart_items');
        if (jsonValue !== null) {
          setSavedCartItems(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error('Error loading cart items:', e);
      }
    };
    loadCartItems();
  }, []);

  useEffect(() => {
    const saveCartItems = async () => {
      try {
        const jsonValue = JSON.stringify(savedCartItems);
        await AsyncStorage.setItem('@cart_items', jsonValue);
      } catch (e) {
        console.error('Error saving cart items:', e);
      }
    };
    saveCartItems();
  }, [savedCartItems]);

  useEffect(() => {
    if (cartItems.length > 0) {
      setSavedCartItems(prevItems => [...prevItems, ...cartItems]);
    }
  }, [cartItems]);

  useEffect(() => {
    const customer_id = 1; // Replace with the actual customer ID
    if (savedCartItems.length > 0) {
      saveCartToDatabase(customer_id, savedCartItems);
    }
  }, [savedCartItems]);

  const saveCartToDatabase = async (customer_id, newCartItems) => {
    try {
      const response = await fetch('http://170.20.10.2/Backend/save_cart.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customer_id,
          cart_items: newCartItems,
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log('Cart saved successfully:', responseData.message);
      } else {
        console.error('Failed to save cart:', responseData.error);
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const calculateTotal = () => {
    return savedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateDeliveryFee = () => {
    return savedCartItems.reduce((total, item) => total + (item.deliveryFee || 0), 0);
  };

  const handleRemoveItem = (item) => {
    const updatedCartItems = savedCartItems.filter(cartItem => cartItem.meal_id !== item.meal_id);
    setSavedCartItems(updatedCartItems);
  };

  const handleCheckout = () => {
    const totalAmount = calculateTotal() + calculateDeliveryFee();
    const vendorId = savedCartItems.length > 0 ? savedCartItems[0].vendor_id : null; // Assuming all items are from the same vendor

    if (vendorId === null) {
      Alert.alert('Error', 'Unable to determine vendor ID.');
      return;
    }

    navigation.navigate('CheckoutScreen', {
      cartItems: savedCartItems,
      deliveryFee: calculateDeliveryFee(),
      totalAmount: totalAmount,
      vendorId: vendorId,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>
      <FlatList
        data={savedCartItems}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: `http://172.20.10.2/Backendphp/uploads/${item.image}` }} style={styles.cartItemImage} />
            <View style={styles.cartItemDetails}>
              <Text style={styles.cartItemTitle}>{item.meal_name}</Text>
              <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.cartItemPrice}>₦{item.price * item.quantity}</Text>
              <Text style={styles.deliveryText}>Delivery Fee: ₦{item.deliveryFee}</Text>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item)}>
              <Icon name="trash-outline" size={24} color="#FF0000" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyCart}>
            <Text>Your cart is empty</Text>
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalAmount}>₦{calculateTotal()}</Text>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Delivery Fee:</Text>
        <Text style={styles.totalAmount}>₦{calculateDeliveryFee()}</Text>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Grand Total:</Text>
        <Text style={styles.totalAmount}>₦{calculateTotal() + calculateDeliveryFee()}</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} disabled={savedCartItems.length === 0}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  cartItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemQuantity: {
    marginTop: 5,
  },
  cartItemPrice: {
    marginTop: 5,
    color: '#ff7f00',
  },
  deliveryText: {
    marginTop: 5,
    color: '#ff7f00',
  },
  emptyCart: {
    alignItems: 'center',
    marginTop: 50,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    color: '#ff7f00',
  },
  checkoutButton: {
    backgroundColor: '#ff7f00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default CartScreen;
