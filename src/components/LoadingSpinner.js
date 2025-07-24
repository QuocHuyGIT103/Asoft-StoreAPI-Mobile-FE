import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingSpinner = ({ message = 'Đang tải...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default LoadingSpinner;
