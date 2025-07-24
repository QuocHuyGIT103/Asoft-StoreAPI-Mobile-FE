import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false, 
  loading = false,
  variant = 'primary' 
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#2196F3'} />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primary: {
    backgroundColor: '#2196F3',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  danger: {
    backgroundColor: '#f44336',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#2196F3',
  },
  dangerText: {
    color: '#fff',
  },
  disabledText: {
    color: '#999',
  },
});

export default CustomButton;
