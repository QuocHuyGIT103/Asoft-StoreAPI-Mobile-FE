import apiClient from './api';

export const customerService = {
  // Lấy danh sách khách hàng
  getCustomers: () => apiClient.get('/Customer'),
  
  // Thêm khách hàng mới
  addCustomer: (customer) => apiClient.post('/Customer', customer),
  
  // Cập nhật khách hàng
  updateCustomer: (id, customer) => apiClient.put(`/Customer/${id}`, customer),
  
  // Xóa khách hàng
  deleteCustomer: (id) => apiClient.delete(`/Customer/${id}`),
};

export const productService = {
  // Lấy danh sách sản phẩm
  getProducts: () => apiClient.get('/Product'),
  
  // Thêm sản phẩm mới
  addProduct: (product) => apiClient.post('/Product', product),
  
  // Cập nhật sản phẩm
  updateProduct: (id, product) => apiClient.put(`/Product/${id}`, product),
  
  // Xóa sản phẩm
  deleteProduct: (id) => apiClient.delete(`/Product/${id}`),
};

export const invoiceService = {
  // Lấy danh sách hóa đơn
  getInvoices: () => apiClient.get('/Invoice'),
  
  // Thêm hóa đơn mới
  addInvoice: (invoice) => apiClient.post('/Invoice', invoice),
  
  // Cập nhật hóa đơn
  updateInvoice: (id, invoice) => apiClient.put(`/Invoice/${id}`, invoice),
  
  // Xóa hóa đơn
  deleteInvoice: (id) => apiClient.delete(`/Invoice/${id}`),
};
