import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import CartAPI from '../../../../Api/user/cart'
// Chi tiet san pham
const ProductDetail = () => {
  const { productID } = useParams() // Get productId from the URL
  const [productData, setProductData] = useState(null)
  const [quantity, setQuantity] = useState(1) // State to track quantity

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const url = `https://lucifernsz.com/PBL6-BE/public/api/products/${productID}`
        console.log('Fetching product data from URL:', url) // Log URL for debugging
        const response = await fetch(url)
        const data = await response.json()
        console.log('Fetched Product Data:', data) // Log response data
        setProductData(data.data) // Assuming data is inside 'data' object
      } catch (error) {
        console.error('Error fetching product data:', error)
        toast.error('Error fetching product details.')
      }
    }

    fetchProductDetails()
  }, [productID])

  // Function to handle adding product to the cart
  const addToCart = async () => {
    if (!productData) return

    const productToAdd = {
      product_id: String(productData.product_id),
      cart_quantity: quantity
    }

    console.log('Data being sent to server:', productToAdd)

    try {
      await CartAPI.addproduct_inCart(productToAdd)
      toast.success('Product added to cart successfully!')
    } catch (error) {
      console.error('Error adding product to cart:', error)

      // Log the detailed server response if available
      if (error.response) {
        console.log('Server response status:', error.response.status)
        console.log('Server response data:', error.response.data)
      }
    }
  }

  // Check if product is out of stock
  const isOutOfStock = productData && productData.product_quantity === 0

  return (
    <div className='px-6 md:px-24 mt-10 mb-10'>
      {/* Display product details if data is available */}
      {productData && (
        <div className='bg-white grid grid-cols-12 gap-6'>
          {/* Left side: Product images */}
          <div className='col-span-12 md:col-span-6'>
            <div className='sticky top-0'>
              {/* Display only the first image if product images are available */}
              {productData.product_images && productData.product_images.length > 0 ? (
                <img
                  className='w-full h-auto object-cover rounded-md'
                  src={productData.product_images[0]}
                  alt={productData.product_name}
                />
              ) : (
                <div>No images available</div>
              )}
              <div className='hidden bg-blue-500 text-white px-2 py-0.5 text-xs text-center md:block'>
                Sản phẩm 100% chính hãng, mẫu mã có thể thay đổi theo lô hàng
              </div>
              <div className='mt-2 flex gap-2'>
                {/* Thumbnail images */}
                {productData.product_images &&
                  productData.product_images
                    .slice(1, 3)
                    .map((img, idx) => (
                      <img
                        key={idx}
                        className='w-[80px] h-[80px] object-cover rounded-md'
                        src={img}
                        alt={productData.product_name}
                        loading='lazy'
                      />
                    ))}
              </div>
            </div>
          </div>

          {/* Right side: Product details and add to cart */}
          <div className='col-span-12 md:col-span-6 pl-6'>
            <h1 className='text-lg font-semibold text-neutral-900 md:text-xl md:font-bold'>
              {productData.product_name}
            </h1>

            <div className='flex items-center justify-between mb-3 md:mb-4 mt-2'>
              <div className='flex items-center space-x-1'>
                <span className='h-1 w-1 rounded-full bg-neutral-600'></span>
                <a className='text-sm text-[#1A51A2]' href='/thuong-hieu/urgo'>
                  Thương hiệu: {productData.brand_name}
                </a>
              </div>
            </div>

            {/* Price and discount */}
            <div className='flex items-center justify-between mb-1 mt-1'>
              <h3 className='text-2xl font-bold text-[#1A51A2]'>{productData.product_price}₫/Hộp</h3>
              <div className='flex items-center'>
                <p className='relative text-lg font-semibold text-neutral-600'>
                  {productData.product_discount}
                  <span className='absolute inset-x-0 top-1/2 h-[1px] bg-neutral-600'></span>
                </p>
                <span className='bg-pink-500 text-xs font-medium text-white px-2 py-1 rounded-sm'>-10%</span>
              </div>
            </div>

            <p className='text-sm text-neutral-500 mb-2 mt-1'>
              Giá đã bao gồm thuế. Phí vận chuyển và các chi phí khác (nếu có) sẽ được thể hiện khi đặt hàng.
            </p>

            {/* Quantity selector */}
            {isOutOfStock ? (
              <p className='text-red-500 font-semibold mt-4 '>Đã hết hàng</p>
            ) : (
              <div className='flex items-center mt-4'>
                <label htmlFor='quantity' className='mr-2 font-semibold'>
                  Số lượng:
                </label>
                <input
                  id='quantity'
                  type='number'
                  value={quantity}
                  min='1'
                  max={productData.product_quantity} // Max quantity should not exceed available stock
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className='border rounded-md p-2 w-20'
                />
              </div>
            )}
            <button
              className={`mt-6 font-bold py-2 px-4 rounded-lg hover:bg-blue-700 ${isOutOfStock ? 'bg-grey-300 text-grey-600' : 'bg-blue-300 text-red-600'}`}
              style={{ backgroundColor: isOutOfStock ? 'grey' : 'wheat' }}
              onClick={addToCart}
              disabled={isOutOfStock} // Disable the button if the product is out of stock
            >
              Thêm vào giỏ hàng
            </button>

            {/* Product details */}
            <div className='col-span-12 mt-8'>
              <h2 className='text-xl font-bold text-neutral-900 mb-4'>Chi tiết sản phẩm</h2>
              <div className='space-y-2'>
                <p className='text-lg text-neutral-700'>
                  <strong>Mô tả:</strong> {productData.product_description}
                </p>
                <p className='text-lg text-neutral-700'>
                  <strong>Hướng dẫn sử dụng:</strong> {productData.product_uses}
                </p>
                <p className='text-lg text-neutral-700'>
                  <strong>Danh mục:</strong> {productData.category_name}
                </p>
                <p className='text-lg text-neutral-700'>
                  <strong>Xuất xứ:</strong> {productData.place_of_manufacture}
                </p>
                <p className='text-lg text-neutral-700'>
                  <strong>Chỉ định:</strong> {productData.specification}
                </p>
                <p className='text-lg text-neutral-700'>
                  <strong>Số lượng còn lại:</strong> {productData.product_quantity}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
