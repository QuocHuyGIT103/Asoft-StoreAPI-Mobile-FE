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
import { addProduct, updateProduct } from "../redux/productSlice";
import CustomButton from "../components/CustomButton";
import ErrorMessage from "../components/ErrorMessage";

const ProductFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(false);

  const isEdit = route.params?.isEdit || false;
  const existingProduct = route.params?.product;

  const [formData, setFormData] = useState({
    productID: "",
    productName: "",
    price: "",
  });

  useEffect(() => {
    if (isEdit && existingProduct) {
      setFormData({
        productID: existingProduct.productID || "",
        productName: existingProduct.productName || "",
        price: existingProduct.price?.toString() || "",
      });
    }
  }, [isEdit, existingProduct]);

  const handleSave = async () => {
    if (
      !formData.productID.trim() ||
      !formData.productName.trim() ||
      !formData.price.trim()
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Lỗi", "Giá sản phẩm phải là số dương");
      return;
    }

    setLoading(true);
    try {
      const productData = {
        productID: formData.productID.trim().toUpperCase(),
        productName: formData.productName.trim(),
        price: price,
      };

      if (isEdit) {
        await dispatch(
          updateProduct({
            id: existingProduct.productID,
            product: productData,
          })
        ).unwrap();
        Alert.alert("Thành công", "Cập nhật sản phẩm thành công!");
      } else {
        await dispatch(addProduct(productData)).unwrap();
        Alert.alert("Thành công", "Thêm sản phẩm thành công!");
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
            Mã sản phẩm <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, isEdit && styles.disabledInput]}
            value={formData.productID}
            onChangeText={(text) =>
              setFormData({ ...formData, productID: text })
            }
            placeholder="Nhập mã sản phẩm"
            editable={!isEdit}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Tên sản phẩm <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.productName}
            onChangeText={(text) =>
              setFormData({ ...formData, productName: text })
            }
            placeholder="Nhập tên sản phẩm"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Giá <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="Nhập giá sản phẩm"
            keyboardType="numeric"
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

export default ProductFormScreen;
