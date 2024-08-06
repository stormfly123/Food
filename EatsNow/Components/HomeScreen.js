import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Image, TouchableOpacity, FlatList, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMeals(meals);
    } else {
      const filtered = meals.filter(meal =>
        meal.meal_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMeals(filtered);
    }
  }, [searchQuery, meals]);

  const fetchMeals = async () => {
    try {
      const response = await fetch('http://172.20.10.2/Backendphp/fetch_menu.php');
      const data = await response.json();
      setMeals(data);
      setFilteredMeals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openOrderModal = (meal) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (selectedMeal) {
      const newItem = {
        id: selectedMeal.meal_id,
        name: selectedMeal.meal_name,
        price: selectedMeal.price,
        image: `http://172.20.10.2/Backendphp/uploads/${selectedMeal.image}`,
        quantity: quantity,
        deliveryFee: deliveryFee,
        vendor_id: selectedMeal.vendor_id, // Include vendor ID
      };

      try {
        const jsonValue = await AsyncStorage.getItem('@cart_items');
        let cartItems = jsonValue != null ? JSON.parse(jsonValue) : [];
        cartItems.push(newItem);
        await AsyncStorage.setItem('@cart_items', JSON.stringify(cartItems));
        closeModal();
        navigation.navigate('CartScreen', { cartItems: cartItems });
      } catch (e) {
        console.error('Error saving cart items:', e);
      }
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredMeals}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.mealContainer} onPress={() => openOrderModal(item)}>
            <Image source={{ uri: `http://172.20.10.2/Backendphp/uploads/${item.image}` }} style={styles.mealImage} />
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{item.meal_name}</Text>
              <Text style={styles.mealDescription}>{item.description}</Text>
              <Text style={styles.mealPrice}>₦{item.price}</Text>
              <TouchableOpacity style={styles.orderButton} onPress={() => openOrderModal(item)}>
                <Text style={styles.orderButtonText}>Order</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.meal_id.toString()}
        numColumns={2}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate('ProfileSettingScreen')}>
                <Icon name="menu" size={30} color="orange" />
              </TouchableOpacity>
              <View style={styles.headerIcons}>
                {/* <TouchableOpacity onPress={() => navigation.navigate('NotificationPage')}>
                  <Icon name="notifications-outline" size={30} color="orange" />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
                  <Icon name="cart-outline" size={30} color="orange" style={styles.headerIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search Food by Name"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Icon name="options-outline" size={30} color="orange" />
            </View>
          </View>
        }
        contentContainerStyle={styles.restaurantContainer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{selectedMeal ? selectedMeal.meal_name : ''}</Text>
            <Image
              source={{ uri: selectedMeal ? `http://172.20.10.2/Backendphp/uploads/${selectedMeal.image}` : '' }}
              style={styles.modalImage}
            />
            <View style={styles.modalContent}>
              <Text style={styles.modalPrice}>Price: ₦{selectedMeal ? selectedMeal.price : ''}</Text>
              <Text style={styles.modalPrice}>Delivery Fee: ₦{deliveryFee}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={decrementQuantity}>
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity onPress={incrementQuantity}>
                  <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
              </View>
              <Button title="Add to Cart" onPress={handleAddToCart} />
            </View>
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginRight: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  restaurantContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  mealContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
    overflow: 'hidden',
    marginRight: 10,
  },
  mealImage: {
    width: 170,
    height: 120,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  mealInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff7f00',
  },
  orderButton: {
    backgroundColor: '#ff7f00',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalPrice: {
    fontSize: 16,
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#ff7f00',
    padding: 10,
    borderRadius: 5,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
