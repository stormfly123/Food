// src/InsightScreen.js
import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const insights = [];

const InsightScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.sales}>{item.sales}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {insights.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="bar-chart-outline" size={100} color="orange" />
          <Text style={styles.emptyText}>You will see the number of food you sold here</Text>
        </View>
      ) : (
        <FlatList
          data={insights}
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
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sales: {
    fontSize: 14,
    color: '#777',
  },
});

export default InsightScreen;
