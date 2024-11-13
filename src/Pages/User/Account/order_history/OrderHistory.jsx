import React, { useState, useEffect } from 'react'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get access token from cookies or localStorage (assuming it's stored there)
    const accessToken = localStorage.getItem('accesstoken') // You can adjust this to your app's logic

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
          setOrders(data) // Assuming the response contains the order history
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    } else {
      setError('Access token is missing')
      setLoading(false)
    }
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Order History</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <p>Order ID: {order.id}</p>
              <p>Status: {order.status}</p>
              <p>Date: {order.created_at}</p>
              {/* Display other order details as necessary */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found</p>
      )}
    </div>
  )
}
