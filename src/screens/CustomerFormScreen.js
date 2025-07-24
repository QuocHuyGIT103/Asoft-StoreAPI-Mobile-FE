import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, updateCustomer } from "../redux/customerSlice";
import CustomButton from "../components/CustomButton";
import ErrorMessage from "../components/ErrorMessage";

const CustomerFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.customers);
  const [loading, setLoading] = useState(false);

  const isEdit = route.params?.isEdit || false;
  const existingCustomer = route.params?.customer;

  const [formData, setFormData] = useState({
    customerID: "",
    customerName: "",
    phone: "",
  });

  useEffect(() => {
    if (isEdit && existingCustomer) {
      setFormData({
        customerID: existingCustomer.customerID || "",
        customerName: existingCustomer.customerName || "",
        phone: existingCustomer.phone || "",
      });
    }
  }, [isEdit, existingCustomer]);

  const handleSave = async () => {
    if (!formData.customerID.trim() || !formData.customerName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    setLoading(true);
    try {
      const customerData = {
        ...formData,
        customerID: formData.customerID.trim().toUpperCase(),
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim() || null,
      };

      if (isEdit) {
        await dispatch(
          updateCustomer({
            id: existingCustomer.customerID,
            customer: customerData,
          })
        ).unwrap();
        Alert.alert("Thành công", "Cập nhật khách hàng thành công!");
      } else {
        await dispatch(addCustomer(customerData)).unwrap();
        Alert.alert("Thành công", "Thêm khách hàng thành công!");
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
            Mã khách hàng <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, isEdit && styles.disabledInput]}
            value={formData.customerID}
            onChangeText={(text) =>
              setFormData({ ...formData, customerID: text })
            }
            placeholder="Nhập mã khách hàng"
            editable={!isEdit}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Tên khách hàng <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.customerName}
            onChangeText={(text) =>
              setFormData({ ...formData, customerName: text })
            }
            placeholder="Nhập tên khách hàng"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Hủy"
            onPress={() => navigation.goBack()}
            variant="secondary"
            style={styles.cancelButton}
          />
          <CustomButton
            title={isEdit ? "Cập nhật" : "Thêm mới"}
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          />
        </View>
      </View>
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
});

export default CustomerFormScreen;
