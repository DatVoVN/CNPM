import http from '../../until/until'
const productAPI = {
  getProductById: (id) => http.get(`products/${id}`),
  getNameProduct: () => http.get('products/name'),
  getAllProduct: (params) => http.get('products', { params: params })
}
export default productAPI

// vascript
// Sao chép mã
// const response = await productAPI.getSearchAllProduct({
//   search: 'Exo',
//   page: 2,
//   paginate: 5,
//   brand_names: ['Pharimexco', 'Hasan- Demarpharm'],
//   product_price: 'below_100k',
//   category_name: 'Thuốc cảm lạnh'
// });

// Giải thích:
// new URLSearchParams(): Tạo ra một đối tượng để dễ dàng xử lý các query parameters.
// params.append(): Thêm từng query parameter vào URL nếu giá trị của nó có tồn tại.
// brand_names[]: Đây là một mảng, nên bạn sử dụng vòng lặp để thêm từng giá trị của mảng vào query string.
// params.toString(): Chuyển đổi đối tượng URLSearchParams thành chuỗi query parameters.
