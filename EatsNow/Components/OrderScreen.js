// src/OrderScreen.js
import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const orders = [];

const OrderScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.customerName}>{item.customerName}</Text>
      <Text style={styles.items}>{item.items.join(', ')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="fast-food-outline" size={100} color="orange" />
          <Text style={styles.emptyText}>When people make an order you will see it here</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  items: {
    fontSize: 14,
    color: '#777',
  },
});

export default OrderScreen;
