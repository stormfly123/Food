import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Vibration } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NotificationPage = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    fetch('http://172.20.10.2/Backendphp/get_notifications.php')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data);
          Vibration.vibrate(500); // Vibrate for 500ms when notifications are received
        } else {
          Alert.alert('Error', 'Failed to fetch notifications');
        }
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
        Alert.alert('Error', 'Failed to fetch notifications. Please try again.');
      });
  };

  const sendOrderStatus = (orderId, status, message) => {
    fetch('http://172.20.10.2/Backendphp/update_order_status.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order_id: orderId, status: status, message: message }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          Alert.alert('Success', data.message);
          fetchNotifications(); // Refresh notifications after status update
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch(error => {
        console.error('Error updating order status:', error);
        Alert.alert('Error', 'Failed to update order status. Please try again.');
      });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.notificationIconContainer}>
        <Icon name="notifications-outline" size={30} color="#ff7f00" />
      </View>
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.approveButton]} onPress={() => sendOrderStatus(item.id, 'Approved', 'Arrives Soon')}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => sendOrderStatus(item.id, 'Rejected', 'Not ready')}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.completeButton]} onPress={() => sendOrderStatus(item.id, 'Completed', 'Delivered')}>
            <Text style={styles.buttonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ff7f00',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  notificationIconContainer: {
    marginRight: 15,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationDescription: {
    color: '#999',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  completeButton: {
    backgroundColor: '#008CBA',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NotificationPage;
