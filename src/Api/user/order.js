import http from '../../until/until'
const AddressApi = {
  ///api/orders/historyXem lịch sử đơn hàng
  getHistoryOrder: () => http.get('orders/history'),
  //chi tiết giỏ hàng
  getDatailCartOrder: (id) => http.get(`orders/detail/${id}`),
  // Thanh toán từ giỏ hàng
  Checkout_CartOrder: () => http.post('orders/checkout-cart'),
  ///api/orders/cancel/{id}Huỷ đơn hàng.( chỉ huỷ khi status_order=pending, confirmed
  Cancel_CartOrder: (id) => http.post(`orders/cancel/$${id}`),
  //user mua hàng trực tiếp từ sản phẩm chi tiết
  BuyProduct_DetailProduct: (data) => http.post(`orders/buy-now`, data)
}
export default AddressApi
