import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fetchCustomers, deleteCustomer } from "../redux/customerSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import CustomButton from "../components/CustomButton";

const CustomerListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customers);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchCustomers());
    setRefreshing(false);
  };

  const handleDelete = (customer) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa khách hàng "${customer.CustomerName}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => dispatch(deleteCustomer(customer.customerID)),
        },
      ]
    );
  };

  const renderCustomerItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.customerName}</Text>
        <Text style={styles.itemSubtitle}>Mã: {item.customerID}</Text>
        {item.phone && (
          <Text style={styles.itemSubtitle}>SĐT: {item.phone}</Text>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() =>
            navigation.navigate("CustomerForm", {
              customer: item,
              isEdit: true,
            })
          }
        >
          <Icon name="edit" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Icon name="delete" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && customers.length === 0) {
    return <LoadingSpinner message="Đang tải danh sách khách hàng..." />;
  }

  return (
    <View style={styles.container}>
      <ErrorMessage message={error} />

      <View style={styles.header}>
        <CustomButton
          title="Thêm khách hàng"
          onPress={() => navigation.navigate("CustomerForm")}
          style={styles.addButton}
        />
      </View>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.customerID}
        renderItem={renderCustomerItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có khách hàng nào</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  addButton: {
    marginBottom: 0,
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
  },
  editButton: {
    backgroundColor: "#e3f2fd",
  },
  deleteButton: {
    backgroundColor: "#ffebee",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

export default CustomerListScreen;
