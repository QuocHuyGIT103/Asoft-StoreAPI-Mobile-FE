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
import { fetchInvoices, deleteInvoice } from "../redux/invoiceSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import CustomButton from "../components/CustomButton";

const InvoiceListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { invoices, loading, error } = useSelector((state) => state.invoices);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchInvoices());
    setRefreshing(false);
  };

  const handleDelete = (invoice) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa hóa đơn "${invoice.invoiceID}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => dispatch(deleteInvoice(invoice.invoiceID)),
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const calculateTotal = (details) => {
    if (!details || !Array.isArray(details)) return 0;
    return details.reduce(
      (total, detail) => total + (detail.totalPrice || 0),
      0
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderInvoiceItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>HĐ: {item.invoiceID}</Text>
        <Text style={styles.itemSubtitle}>Khách hàng: {item.customerID}</Text>
        <Text style={styles.itemSubtitle}>
          Ngày: {formatDate(item.invoiceDate)}
        </Text>
        <Text style={styles.itemTotal}>
          Tổng tiền: {formatPrice(calculateTotal(item.details))}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() =>
            navigation.navigate("InvoiceForm", { invoice: item, isEdit: true })
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

  if (loading && invoices.length === 0) {
    return <LoadingSpinner message="Đang tải danh sách hóa đơn..." />;
  }

  return (
    <View style={styles.container}>
      <ErrorMessage message={error} />

      <View style={styles.header}>
        <CustomButton
          title="Tạo hóa đơn"
          onPress={() => navigation.navigate("InvoiceForm")}
          style={styles.addButton}
        />
      </View>

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.invoiceID}
        renderItem={renderInvoiceItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có hóa đơn nào</Text>
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
  itemTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
    marginTop: 4,
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

export default InvoiceListScreen;
