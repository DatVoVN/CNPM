import React, { useState, useEffect } from 'react'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const accessToken = localStorage.getItem('accesstoken')

    if (accessToken) {
      fetch('https://lucifernsz.com/PBL6-BE/public/api/orders/history', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.data) {
            // Sort orders by order_id in descending order
            const sortedOrders = data.data.sort((a, b) => b.order_id - a.order_id)
            setOrders(sortedOrders)
          } else {
            setError('No orders found.')
          }
          setLoading(false)
        })
        .catch((err) => {
          setError('Error fetching order history: ' + err.message)
          setLoading(false)
        })
    } else {
      setError('Access token is missing')
      setLoading(false)
    }
  }, [])

  if (loading) return <div className='text-center text-lg'>Loading...</div>
  if (error) return <div className='text-center text-lg text-red-600'>Error: {error}</div>

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h1 className='text-3xl font-semibold mb-6 text-center'>Order History</h1>
      {orders.length > 0 ? (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md'>
            <thead>
              <tr>
                <th className='px-4 py-2 border-b border-gray-200'>Order ID</th>
                <th className='px-4 py-2 border-b border-gray-200'>Total Amount (VND)</th>
                <th className='px-4 py-2 border-b border-gray-200'>Created At</th>
                <th className='px-4 py-2 border-b border-gray-200'>Payment Method</th>
                <th className='px-4 py-2 border-b border-gray-200'>Payment Status</th>
                <th className='px-4 py-2 border-b border-gray-200'>Receiver</th>
                <th className='px-4 py-2 border-b border-gray-200'>Address</th>
                <th className='px-4 py-2 border-b border-gray-200'>Phone</th>
                <th className='px-4 py-2 border-b border-gray-200'>Note</th>
                <th className='px-4 py-2 border-b border-gray-200'>Tracking Number</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id} className='even:bg-gray-50'>
                  <td className='px-4 py-2 border-b border-gray-200'>{order.order_id}</td>
                  <td className='px-4 py-2 border-b border-gray-200'>{order.order_total_amount}</td>
                  <td className='px-4 py-2 border-b border-gray-200'>
                    {new Date(order.order_created_at).toLocaleString()}
                  </td>
                  <td className='px-4 py-2 border-b border-gray-200'>{order.payment_method}</td>
                  <td className='px-4 py-2 border-b border-gray-200'>{order.payment_status}</td>
                  <td className='px-4 py-2 border-b border-gray-200'>{order.receiver_name}</td>
                  <td className='px-4 py-2 border-b border-gray-200'>{order.receiver_address}</td>
                  <td className='px-4 py-2 border-b border-gray-200'>{order.receiver_phone}</td>
                  <td className='px-4 py-2 border-b border-gray-200'>{order.order_note || 'N/A'}</td>
                  <td className='px-4 py-2 border-b border-gray-200'>{order.delivery_tracking_number || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className='text-center text-lg text-gray-600'>No orders found</p>
      )}
    </div>
  )
}
