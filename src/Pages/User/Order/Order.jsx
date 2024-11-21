import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import CartAPI from '../../../Api/user/cart'
import { AuthContext } from '../../../context/app.context'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import AddressApi from '../../../Api/user/address' // Assuming the Address API is imported
import { useNavigate } from 'react-router-dom'

function Order() {
  const { isAuthenticated } = useContext(AuthContext)
  const { data } = useQuery({
    queryKey: ['getCart'],
    queryFn: CartAPI.getCart,
    enabled: isAuthenticated
  })

  // Fetching address data using useQuery
  const {
    data: addressData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['getAddress'],
    queryFn: AddressApi.getAddress_receive
  })

  const [products, setProducts] = useState([])
  const [checkedProducts, setCheckedProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [deliveryMethods, setDeliveryMethods] = useState([])
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [receiverAddresses, setReceiverAddresses] = useState([]) // New state for addresses
  const [selectedReceiver, setSelectedReceiver] = useState(null) // Selected receiver address
  const token = localStorage.getItem('accesstoken')
  const navigate = useNavigate()
  useEffect(() => {
    // Fetch payment methods from API
    axios
      .get('https://lucifernsz.com/PBL6-BE/public/api/payments')
      .then((response) => {
        setPaymentMethods(response.data.data) // Assuming data is in response.data.data
      })
      .catch((error) => {
        console.error('Error fetching payment methods:', error)
      })
  }, [])
  console.log('day là payment:', paymentMethods)

  useEffect(() => {
    // Fetch delivery methods from the API
    axios
      .get('https://lucifernsz.com/PBL6-BE/public/api/deliveries')
      .then((response) => {
        setDeliveryMethods(response.data.data) // Make sure to access the 'data' array
      })
      .catch((error) => {
        console.error('Error fetching delivery methods:', error)
      })
  }, [])

  useEffect(() => {
    if (addressData?.data?.data) {
      setReceiverAddresses(addressData.data.data) // Set the addresses received from API
    }
  }, [addressData])

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data.data)) {
      setProducts(data.data.data)
    } else {
      setProducts([])
    }
  }, [data])

  const calculateTotal = useCallback(() => {
    const totalAmount = products.reduce(
      (total, product) => total + parseFloat(product.cart_price * product.cart_quantity),
      0
    )
    setTotal(totalAmount)
  }, [products])

  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  const handleCheckboxChange = (cartId) => {
    setCheckedProducts((prevCheckedProducts) =>
      prevCheckedProducts.includes(cartId)
        ? prevCheckedProducts.filter((id) => id !== cartId)
        : [...prevCheckedProducts, cartId]
    )
  }

  const handleDeliverySelection = (delivery) => {
    setSelectedDelivery(delivery)
    console.log('Selected Delivery ID:', delivery.delivery_id)
  }

  const handlePaymentSelection = (payment) => {
    setSelectedPayment(payment)
  }

  const handleReceiverSelection = (receiver) => {
    setSelectedReceiver(receiver)
  }

  const handleCheckout = () => {
    if (!selectedDelivery || !selectedPayment || checkedProducts.length === 0 || !selectedReceiver) {
      toast.error('Please complete all fields and select products for checkout!')
      return
    }

    const checkoutData = {
      receiver_address_id: selectedReceiver.receiver_address_id,
      payment_id: selectedPayment.payment_method_id,
      delivery_id: selectedDelivery.delivery_method_id,
      ids_cart: checkedProducts
    }
    console.log('checkout', checkoutData)
    axios
      .post('https://lucifernsz.com/PBL6-BE/public/api/orders/checkout-cart', checkoutData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        toast.success('Checkout successful!')
        navigate('/')
      })
      .catch((error) => {
        toast.error('Error processing checkout')
        console.error('Error:', error)
      })
  }

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h2 className='text-3xl font-semibold text-center text-gray-700 mb-6'>THANH TOÁN</h2>

      <div className='overflow-x-auto shadow-md rounded-lg bg-white'>
        <table className='min-w-full table-auto border-collapse text-left'>
          <thead className='bg-gray-100 text-gray-600'>
            <tr>
              <th className='px-6 py-3 font-medium'>Select</th>
              <th className='px-6 py-3 font-medium'>Image</th>
              <th className='px-6 py-3 font-medium'>Product Name</th>
              <th className='px-6 py-3 font-medium'>Quantity</th>
              <th className='px-6 py-3 font-medium'>Price</th>
              <th className='px-6 py-3 font-medium'>Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.cart_id} className='border-b hover:bg-gray-50'>
                <td className='px-6 py-4'>
                  <input
                    type='checkbox'
                    checked={checkedProducts.includes(product.cart_id)}
                    onChange={() => handleCheckboxChange(product.cart_id)}
                    className='form-checkbox'
                  />
                </td>
                <td className='px-6 py-4'>
                  <img
                    src={
                      product.product_images && product.product_images.length > 0
                        ? product.product_images[0]
                        : 'path/to/default/image.jpg'
                    }
                    alt='product'
                    className='w-16 h-16 object-cover rounded-md'
                  />
                </td>
                <td className='px-6 py-4 text-sm font-medium text-gray-700'>{product.product_name}</td>
                <td className='px-6 py-4 text-sm'>{product.cart_quantity}</td>
                <td className='px-6 py-4 text-sm text-gray-800'>${parseFloat(product.cart_price).toFixed(2)}</td>
                <td className='px-6 py-4 text-sm text-gray-800'>
                  ${parseFloat(product.cart_price * product.cart_quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display Total */}
      <div className='mt-6 text-right'>
        <span className='text-xl font-semibold text-gray-800'>Total: </span>
        <span className='text-2xl text-green-600'>${total.toFixed(2)}</span>
      </div>

      {/* Delivery Method Section */}
      <div className='mt-6'>
        <h3 className='text-xl font-medium text-gray-800'>Delivery Method</h3>
        <div className='grid grid-cols-2 gap-4 mt-4'>
          {deliveryMethods.map((delivery) => (
            <button
              key={delivery.delivery__method_id}
              className={`p-4 border rounded-lg ${selectedDelivery?.delivery_method_id === delivery.delivery_method_id ? 'bg-gray-200' : ''}`}
              onClick={() => handleDeliverySelection(delivery)}
            >
              {delivery.delivery_method_name}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method Section */}
      <div className='mt-6'>
        <h3 className='text-xl font-medium text-gray-800'>Payment Method</h3>
        <div className='grid grid-cols-2 gap-4 mt-4'>
          {paymentMethods.map((payment) => (
            <button
              key={payment.payment_method_id}
              className={`p-4 border rounded-lg ${selectedPayment?.payment_method_id === payment.payment_method_id ? 'bg-gray-200' : ''}`}
              onClick={() => handlePaymentSelection(payment)}
            >
              {payment.payment_method_name}
            </button>
          ))}
        </div>
      </div>

      {/* Receiver Info Section */}
      <div className='mt-6'>
        <h3 className='text-xl font-medium text-gray-800'>Receiver Information</h3>
        {isLoading ? (
          <p>Loading addresses...</p>
        ) : isError ? (
          <p>Error loading addresses</p>
        ) : (
          <div className='mt-4'>
            <select
              className='w-full px-4 py-2 border rounded-lg'
              value={selectedReceiver ? selectedReceiver.receiver_address_id : ''}
              onChange={(e) => {
                const selectedAddress = receiverAddresses.find(
                  (address) => address.receiver_address_id === parseInt(e.target.value)
                )
                handleReceiverSelection(selectedAddress)
              }}
            >
              <option value=''>Select Receiver Address</option>
              {receiverAddresses.map((address) => (
                <option key={address.receiver_address_id} value={address.receiver_address_id}>
                  {address.receiver_name} - {address.receiver_phone} - {address.receiver_address}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Checkout Button */}
      <div className='mt-6'>
        <button
          style={{ backgroundColor: 'blue' }}
          onClick={handleCheckout}
          className='w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg'
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default Order
