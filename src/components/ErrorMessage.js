import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorMessage = ({ message, style }) => {
  if (!message) return null;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffebee',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  text: {
    color: '#c62828',
    fontSize: 14,
  },
});

export default ErrorMessage;
