import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { addInvoice, updateInvoice } from "../redux/invoiceSlice";
import { fetchCustomers } from "../redux/customerSlice";
import { fetchProducts } from "../redux/productSlice";
import CustomButton from "../components/CustomButton";
import ErrorMessage from "../components/ErrorMessage";

const InvoiceFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.invoices);
  const { customers } = useSelector((state) => state.customers);
  const { products } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(false);

  const isEdit = route.params?.isEdit || false;
  const existingInvoice = route.params?.invoice;

  const [formData, setFormData] = useState({
    invoiceID: "",
    customerID: "",
    invoiceDate: new Date().toISOString(),
    details: [],
  });

  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentDetail, setCurrentDetail] = useState({
    productID: "",
    quantity: 1,
  });

  const [quantityText, setQuantityText] = useState("1");

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && existingInvoice) {
      setFormData({
        invoiceID: existingInvoice.invoiceID || "",
        customerID: existingInvoice.customerID || "",
        invoiceDate: existingInvoice.invoiceDate || new Date().toISOString(),
        details: existingInvoice.details || [],
      });
      const customer = customers.find(
        (c) => c.customerID === existingInvoice.customerID
      );
      setSelectedCustomer(customer);
    }
  }, [isEdit, existingInvoice, customers]);

  // Đồng bộ quantityText khi mở modal thêm sản phẩm
  useEffect(() => {
    if (productModalVisible) {
      setQuantityText(currentDetail.quantity.toString());
    }
  }, [productModalVisible, currentDetail.quantity]);

  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setFormData({ ...formData, customerID: customer.customerID });
    setCustomerModalVisible(false);
  };

  const addProductDetail = () => {
    if (!currentDetail.productID || currentDetail.quantity <= 0) {
      Alert.alert("Lỗi", "Vui lòng chọn sản phẩm và nhập số lượng hợp lệ");
      return;
    }

    const existingIndex = formData.details.findIndex(
      (detail) => detail.productID === currentDetail.productID
    );

    if (existingIndex >= 0) {
      Alert.alert("Lỗi", "Sản phẩm đã được thêm vào hóa đơn");
      return;
    }

    const product = products.find(
      (p) => p.productID === currentDetail.productID
    );
    const newDetail = {
      invoiceDetailID: 0, // Will be set by backend
      invoiceID: formData.invoiceID,
      productID: currentDetail.productID,
      quantity: parseInt(currentDetail.quantity),
      totalPrice: product.price * parseInt(currentDetail.quantity),
    };

    setFormData({
      ...formData,
      details: [...formData.details, newDetail],
    });

    setCurrentDetail({ productID: "", quantity: 1 });
    setQuantityText("1");
    setProductModalVisible(false);
  };

  const removeProductDetail = (index) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: newDetails });
  };

  const calculateTotal = () => {
    return formData.details.reduce(
      (total, detail) => total + detail.totalPrice,
      0
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSave = async () => {
    if (
      !formData.invoiceID.trim() ||
      !formData.customerID ||
      formData.details.length === 0
    ) {
      Alert.alert(
        "Lỗi",
        "Vui lòng nhập đầy đủ thông tin và thêm ít nhất một sản phẩm"
      );
      return;
    }

    setLoading(true);
    try {
      const invoiceData = {
        invoiceID: formData.invoiceID.trim().toUpperCase(),
        customerID: formData.customerID,
        invoiceDate: formData.invoiceDate,
        details: formData.details.map((detail) => ({
          invoiceDetailID: detail.invoiceDetailID || 0,
          invoiceID: formData.invoiceID.trim().toUpperCase(),
          productID: detail.productID,
          quantity: detail.quantity,
          totalPrice: detail.totalPrice,
        })),
      };

      if (isEdit) {
        await dispatch(
          updateInvoice({
            id: existingInvoice.invoiceID,
            invoice: invoiceData,
          })
        ).unwrap();
        Alert.alert("Thành công", "Cập nhật hóa đơn thành công!");
      } else {
        await dispatch(addInvoice(invoiceData)).unwrap();
        Alert.alert("Thành công", "Tạo hóa đơn thành công!");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", error || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <ErrorMessage message={error} />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Mã hóa đơn <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, isEdit && styles.disabledInput]}
            value={formData.invoiceID}
            onChangeText={(text) =>
              setFormData({ ...formData, invoiceID: text })
            }
            placeholder="Nhập mã hóa đơn"
            editable={!isEdit}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Khách hàng <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setCustomerModalVisible(true)}
          >
            <Text
              style={
                selectedCustomer
                  ? styles.selectorText
                  : styles.selectorPlaceholder
              }
            >
              {selectedCustomer
                ? selectedCustomer.customerName
                : "Chọn khách hàng"}
            </Text>
            <Icon name="arrow-drop-down" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Chi tiết sản phẩm</Text>
          <CustomButton
            title="Thêm sản phẩm"
            onPress={() => setProductModalVisible(true)}
            variant="secondary"
            style={styles.addProductButton}
          />

          {formData.details.map((detail, index) => {
            const product = products.find(
              (p) => p.productID === detail.productID
            );
            return (
              <View
                key={`${detail.productID}-${index}`}
                style={styles.detailItem}
              >
                <View style={styles.detailInfo}>
                  <Text style={styles.detailProductName}>
                    {product ? product.productName : "N/A"}
                  </Text>
                  <Text style={styles.detailText}>
                    Số lượng: {detail.quantity} | Thành tiền:{" "}
                    {formatPrice(detail.totalPrice)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeProductDetail(index)}
                >
                  <Icon name="close" size={20} color="#f44336" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {formData.details.length > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Tổng tiền: {formatPrice(calculateTotal())}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Hủy"
            onPress={() => navigation.goBack()}
            variant="secondary"
            style={styles.cancelButton}
          />
          <CustomButton
            title={isEdit ? "Cập nhật" : "Tạo hóa đơn"}
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          />
        </View>
      </View>

      {/* Customer Selection Modal */}
      <Modal
        visible={customerModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn khách hàng</Text>
            <FlatList
              data={customers}
              keyExtractor={(item) => item.customerID}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => selectCustomer(item)}
                >
                  <Text style={styles.modalItemText}>{item.customerName}</Text>
                  <Text style={styles.modalItemSubtext}>
                    Mã: {item.customerID}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <CustomButton
              title="Hủy"
              onPress={() => setCustomerModalVisible(false)}
              variant="secondary"
            />
          </View>
        </View>
      </Modal>

      {/* Product Selection Modal */}
      <Modal
        visible={productModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm sản phẩm</Text>

            <Text style={styles.label}>Chọn sản phẩm:</Text>
            <FlatList
              data={products}
              keyExtractor={(item) => item.productID}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    currentDetail.productID === item.productID &&
                      styles.selectedItem,
                  ]}
                  onPress={() =>
                    setCurrentDetail({
                      ...currentDetail,
                      productID: item.productID,
                    })
                  }
                >
                  <Text style={styles.modalItemText}>{item.productName}</Text>
                  <Text style={styles.modalItemSubtext}>
                    Mã: {item.productID} | Giá: {formatPrice(item.price)}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.productList}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số lượng:</Text>
              <TextInput
                style={styles.input}
                value={quantityText}
                onChangeText={(text) => {
                  // Chỉ cho phép nhập số
                  const numericText = text.replace(/[^0-9]/g, "");
                  setQuantityText(numericText);

                  // Cập nhật quantity trong currentDetail
                  const quantity =
                    numericText === "" ? 1 : parseInt(numericText);
                  setCurrentDetail({
                    ...currentDetail,
                    quantity: quantity,
                  });
                }}
                keyboardType="numeric"
                placeholder="Nhập số lượng"
                selectTextOnFocus={true}
                maxLength={5}
              />
            </View>

            <View style={styles.modalButtons}>
              <CustomButton
                title="Hủy"
                onPress={() => {
                  setCurrentDetail({ productID: "", quantity: 1 });
                  setQuantityText("1");
                  setProductModalVisible(false);
                }}
                variant="secondary"
                style={styles.modalButton}
              />
              <CustomButton
                title="Thêm"
                onPress={addProductDetail}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#f44336",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  selector: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 16,
    color: "#333",
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  addProductButton: {
    marginBottom: 10,
  },
  detailItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  detailInfo: {
    flex: 1,
  },
  detailProductName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  removeButton: {
    padding: 4,
  },
  totalContainer: {
    backgroundColor: "#e8f5e8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedItem: {
    backgroundColor: "#e3f2fd",
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modalItemSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  productList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default InvoiceFormScreen;
