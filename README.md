# Store Mobile App

Ứng dụng mobile quản lý cửa hàng được xây dựng bằng React Native với Expo, kết nối với backend ASP.NET Core Web API.

## Tính năng

- **Quản lý khách hàng**: Thêm, sửa, xóa, xem danh sách khách hàng
- **Quản lý sản phẩm**: Thêm, sửa, xóa, xem danh sách sản phẩm  
- **Quản lý hóa đơn**: Tạo, sửa, xóa hóa đơn với chi tiết sản phẩm

## Công nghệ sử dụng

- **React Native** với Expo
- **Redux Toolkit** cho quản lý state
- **React Navigation** cho điều hướng
- **Axios** cho API calls
- **React Native Vector Icons** cho icons

## Cài đặt và chạy

### Yêu cầu
- Node.js >= 16
- Expo CLI hoặc Expo Go app trên điện thoại

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Cấu hình API URL
Mở file `src/services/api.js` và thay đổi `BASE_URL` thành địa chỉ API backend của bạn:

```javascript
const BASE_URL = 'https://your-api-url.com/api'; // Thay bằng URL thực tế
```

### Bước 3: Chạy ứng dụng
```bash
# Chạy trên web
npm run web

# Chạy trên Android (cần Android Studio hoặc emulator)
npm run android

# Chạy trên iOS (chỉ trên macOS)
npm run ios

# Hoặc scan QR code với Expo Go
npx expo start
```

## Cấu trúc project

```
src/
├── components/          # Các component tái sử dụng
│   ├── CustomButton.js
│   ├── ErrorMessage.js
│   └── LoadingSpinner.js
├── navigation/          # Cấu hình navigation
│   └── AppNavigator.js
├── redux/              # Redux store và slices
│   ├── store.js
│   ├── customerSlice.js
│   ├── productSlice.js
│   └── invoiceSlice.js
├── screens/            # Các màn hình
│   ├── CustomerListScreen.js
│   ├── CustomerFormScreen.js
│   ├── ProductListScreen.js
│   ├── ProductFormScreen.js
│   ├── InvoiceListScreen.js
│   └── InvoiceFormScreen.js
└── services/           # API services
    ├── api.js
    └── index.js
```

## API Endpoints

Ứng dụng kết nối với các API endpoints sau:

- `GET /api/Customer` - Lấy danh sách khách hàng
- `POST /api/Customer` - Thêm khách hàng mới
- `PUT /api/Customer/{id}` - Cập nhật khách hàng
- `DELETE /api/Customer/{id}` - Xóa khách hàng

- `GET /api/Product` - Lấy danh sách sản phẩm
- `POST /api/Product` - Thêm sản phẩm mới
- `PUT /api/Product/{id}` - Cập nhật sản phẩm
- `DELETE /api/Product/{id}` - Xóa sản phẩm

- `GET /api/Invoice` - Lấy danh sách hóa đơn
- `POST /api/Invoice` - Tạo hóa đơn mới
- `PUT /api/Invoice/{id}` - Cập nhật hóa đơn
- `DELETE /api/Invoice/{id}` - Xóa hóa đơn

## Giao diện ứng dụng

### Bottom Tab Navigation
- **Khách hàng**: Quản lý thông tin khách hàng
- **Sản phẩm**: Quản lý thông tin sản phẩm
- **Hóa đơn**: Quản lý hóa đơn bán hàng

### Tính năng chính
- Danh sách với khả năng pull-to-refresh
- Form thêm/sửa với validation
- Xác nhận trước khi xóa
- Loading states và error handling
- Responsive design cho các kích thước màn hình

## Lưu ý

1. Đảm bảo backend API đang chạy trước khi test ứng dụng
2. Cấu hình CORS trên backend để cho phép requests từ mobile app
3. Thay đổi BASE_URL trong `src/services/api.js` thành địa chỉ thực tế của API

## Troubleshooting

### Lỗi kết nối API
- Kiểm tra BASE_URL trong `src/services/api.js`
- Đảm bảo backend API đang chạy
- Kiểm tra cấu hình network/firewall

### Lỗi build
- Xóa node_modules và package-lock.json, sau đó chạy `npm install` lại
- Kiểm tra phiên bản Node.js và Expo CLI

### Icons không hiển thị
- Restart Metro bundler: `npx expo start -c`
- Kiểm tra import của react-native-vector-icons
