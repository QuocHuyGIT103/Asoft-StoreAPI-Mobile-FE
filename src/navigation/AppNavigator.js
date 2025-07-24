import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import CustomerListScreen from '../screens/CustomerListScreen';
import CustomerFormScreen from '../screens/CustomerFormScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductFormScreen from '../screens/ProductFormScreen';
import InvoiceListScreen from '../screens/InvoiceListScreen';
import InvoiceFormScreen from '../screens/InvoiceFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Customer Stack
const CustomerStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="CustomerList" 
      component={CustomerListScreen} 
      options={{ title: 'Danh sách khách hàng' }}
    />
    <Stack.Screen 
      name="CustomerForm" 
      component={CustomerFormScreen} 
      options={{ title: 'Thông tin khách hàng' }}
    />
  </Stack.Navigator>
);

// Product Stack
const ProductStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ProductList" 
      component={ProductListScreen} 
      options={{ title: 'Danh sách sản phẩm' }}
    />
    <Stack.Screen 
      name="ProductForm" 
      component={ProductFormScreen} 
      options={{ title: 'Thông tin sản phẩm' }}
    />
  </Stack.Navigator>
);

// Invoice Stack
const InvoiceStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="InvoiceList" 
      component={InvoiceListScreen} 
      options={{ title: 'Danh sách hóa đơn' }}
    />
    <Stack.Screen 
      name="InvoiceForm" 
      component={InvoiceFormScreen} 
      options={{ title: 'Thông tin hóa đơn' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Customers') {
              iconName = 'people';
            } else if (route.name === 'Products') {
              iconName = 'inventory';
            } else if (route.name === 'Invoices') {
              iconName = 'receipt';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Customers" 
          component={CustomerStack} 
          options={{ title: 'Khách hàng' }}
        />
        <Tab.Screen 
          name="Products" 
          component={ProductStack} 
          options={{ title: 'Sản phẩm' }}
        />
        <Tab.Screen 
          name="Invoices" 
          component={InvoiceStack} 
          options={{ title: 'Hóa đơn' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
