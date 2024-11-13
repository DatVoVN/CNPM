import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Modal } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CartAPI from '../../../Api/user/cart'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { AuthContext } from '../../../context/app.context'
export default function Cart() {
  const { isAuthenticated, logout } = useContext(AuthContext)
  // get list cart
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ['getCart'],
    queryFn: CartAPI.getCart,
    enabled: isAuthenticated // Chỉ gọi query khi người dùng đã đăng nhập
  })

  const [products, setProducts] = useState([]) // Khởi tạo state cho sản phẩm

  // Lưu trạng thái của các sản phẩm được chọn
  const [checkedProducts, setCheckedProducts] = useState([])
  useEffect(() => {
    // Kiểm tra xem data có giá trị hợp lệ không
    if (data && data.data && Array.isArray(data.data.data)) {
      setProducts(data.data.data)
    } else {
      setProducts([])
    }
  }, [data])

  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [modalText, setModalText] = useState('Bạn có chắc chắn muốn xóa sản phẩm này?')
  const [total, setTotal] = useState(0)
  const showModal = () => {
    setOpen(true)
  }

  const handleDelete = (id) => {
    console.log(id)
    mutate.mutate(id, {
      onSuccess: () => {
        toast.success('Xóa sản phẩm thành công !')
        queryClient.invalidateQueries({ queryKey: ['getCart'] })
      },
      onError() {
        console.log('Thấtbai ')
        toast.error('Fail !')
      }
    })
  }
  // ham cap nhat so luong
  const handleUpdateQuantity = (element, quantity) => {
    let elementProduct = {
      ...element,
      cart_quantity: quantity
    }
    return elementProduct
  }

  // handle - +
  const mutateUpdate = useMutation({
    mutationFn: CartAPI.updateCart
  })

  const handleSubstract = (element) => {
    const quantity = element.cart_quantity - 1
    console.log(quantity)
    let elementProduct = handleUpdateQuantity(element, quantity)
    mutateUpdate.mutate(elementProduct, {
      onSuccess: () => {
        toast.success('Update sản phẩm thành công !')
        queryClient.invalidateQueries({ queryKey: ['getCart'] })
        const calculateTotal = () => {
          return products
            .filter((product) => checkedProducts.includes(product.cart_id))
            .reduce((total, product) => total + parseFloat(product.cart_price * product.cart_quantity), 0) // Ép kiểu về số
        } // Chỉ tính lại khi  checkedProducts thay đổi
        setTotal(calculateTotal())
      },
      onError() {
        console.log('Thấtbai ')
        toast.error('Fail !')
      }
    })
  }
  const handlePlus = (element) => {
    const quantity = element.cart_quantity + 1
    console.log(quantity)
    let elementProduct = handleUpdateQuantity(element, quantity)
    console.log(elementProduct)
    mutateUpdate.mutate(elementProduct, {
      onSuccess: () => {
        toast.success('Update sản phẩm thành công !')
        queryClient.invalidateQueries({ queryKey: ['getCart'] })
        // Tính tổng tiền của các sản phẩm đã được check
        const calculateTotal = () => {
          return products
            .filter((product) => checkedProducts.includes(product.cart_id))
            .reduce((total, product) => total + parseFloat(product.cart_price * product.cart_quantity), 0) // Ép kiểu về số
        } // Chỉ tính lại khi  checkedProducts thay đổi
        setTotal(calculateTotal())
      },
      onError() {
        console.log('Thấtbai ')
        toast.error('Fail !')
      }
    })
  }
  const handleInputChange = (element, event) => {
    const cart_quantity = parseInt(event.target.value)
    console.log(cart_quantity)

    // Kiểm tra giá trị nhập vào
    if (isNaN(cart_quantity) || cart_quantity < 1) {
      // Nếu không hợp lệ, có thể xóa sản phẩm hoặc cập nhật lại số lượng
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.cart_id === element.cart_id ? { ...product, cart_quantity: '' } : product
        )
      )
    } else {
      // Nếu hợp lệ, cập nhật số lượng cho sản phẩm
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.cart_id === element.cart_id ? { ...product, cart_quantity } : product))
      )
    }
  }
  const handleInputBlur = (element, event) => {
    const cart_quantity = parseInt(event.target.value)
    console.log('Gọi api ' + cart_quantity)
    // Kiểm tra giá trị nhập vào
    let elementProduct = handleUpdateQuantity(element, cart_quantity)
    mutateUpdate.mutate(elementProduct, {
      onSuccess: () => {
        toast.success('Update sản phẩm thành công !')
        queryClient.invalidateQueries({ queryKey: ['getCart'] })
        // Tính tổng tiền của các sản phẩm đã được check
        const calculateTotal = () => {
          return products
            .filter((product) => checkedProducts.includes(product.cart_id))
            .reduce((total, product) => total + parseFloat(product.cart_price * product.cart_quantity), 0) // Ép kiểu về số
        } // Chỉ tính lại khi  checkedProducts thay đổi
        setTotal(calculateTotal())
      },
      onError() {
        console.log('Thấtbai ')
        toast.error('Fail !')
      }
    })
  }
  //// xóa
  const handleOk = (id) => {
    handleDelete(id)

    setOpen(false)
  }
  const handleCancel = () => {
    setOpen(false)
  }
  const mutate = useMutation({
    mutationFn: CartAPI.deleteCart
  })

  // Xử lý khi một checkbox được check hoặc uncheck
  const handleCheck = (productId) => {
    setCheckedProducts((prevChecked) => {
      if (prevChecked.includes(productId)) {
        // Nếu sản phẩm đã được check thì bỏ check
        return prevChecked.filter((id) => id !== productId)
      } else {
        // Nếu chưa được check thì thêm vào danh sách đã check
        return [...prevChecked, productId]
      }
    })
  }

  //// Tính tổng tiền của các sản phẩm đã được check
  const calculateTotal = useCallback(() => {
    const totalAmount = products
      .filter((product) => checkedProducts.includes(product.cart_id))
      .reduce((total, product) => total + parseFloat(product.cart_price * product.cart_quantity), 0)

    setTotal(totalAmount) // Cập nhật tổng tiền
  }, [checkedProducts])

  // Gọi lại tính tổng mỗi khi checkedProducts thay đổi
  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  const calculateTotal1 = useCallback(() => {
    const totalAmount = products
      .filter((product) => checkedProducts.includes(product.cart_id))
      .reduce((total, product) => total + parseFloat(product.cart_price * product.cart_quantity), 0)

    setTotal(totalAmount) // Cập nhật tổng tiền
  }, [products])

  // Gọi lạicheckedProducts tính tổng mỗi khi checkedProducts thay đổi
  useEffect(() => {
    calculateTotal1()
  }, [calculateTotal1])
  // Tính tổng tiền của các sản phẩm đã được check

  const handleCheckAll = (e) => {
    console.log(e.target.checked)
    if (e.target.checked) {
      const arrayCheckAll = products.map((element) => {
        return element.cart_id
      })
      console.log(arrayCheckAll)
      setCheckedProducts(arrayCheckAll)
    } else {
      setCheckedProducts([])
    }
  }
  // xoa nhieu
  const mutateDeleteMany = useMutation({
    mutationFn: CartAPI.deleteManyCart
  })
  const handleDeleteMany = () => {
    console.log(checkedProducts)
    const ids_cart1 = {
      ids_cart: checkedProducts
    }
    console.log(ids_cart1)
    if (checkedProducts.length > 0) {
      mutateDeleteMany.mutate(ids_cart1, {
        onSuccess: () => {
          toast.success('Xóa sản phẩm thành công !')
          queryClient.invalidateQueries({ queryKey: ['getCart'] })
          setCheckedProducts([])
        }
      })
    } else {
      toast.error('Vui lòng chọn sản phẩm cần xóa')
    }
  }
  useEffect(() => {
    const total = products.reduce((total, product) => total + product.cart_price * product.cart_quantity, 0)
    setTotal(total)
  }, [products])
  return (
    <div className='px-24'>
      <div className='grid grid-cols-9 pt-5 gap-x-5 '>
        <div className='col-span-6'>
          <div className='flex justify-between '>
            <div className='text-2xl font-semibold'>
              Giỏ hàng {data?.data?.data?.length ? data.data.data.length : ''}{' '}
            </div>
            <button className='text-[#0070e0] hover:text-black' onClick={handleDeleteMany}>
              Xóa
            </button>
          </div>
          <div className=''>
            <div class='w-full max-w-4xl mx-auto my-4 border rounded-lg shadow'>
              <div class='flex items-center border-b p-4 bg-gray-100'>
                <input
                  type='checkbox'
                  class='mr-4'
                  checked={products.length == checkedProducts.length}
                  onChange={(event) => handleCheckAll(event)}
                />
                <div class='w-1/2 font-semibold '>Sản phẩm</div>
                <div class='w-1/6 font-semibold  text-center'>Đơn giá</div>
                <div class='w-1/6 font-semibold text-center'>Số lượng</div>
                <div class='w-1/6 font-semibold text-center'>Thành tiền</div>
              </div>
              {/*Product List cart */}

              {products.length > 0 ? (
                <>
                  {products.map((element) => {
                    return (
                      <div className='flex items-center p-4' key={element.cart_id}>
                        <input
                          type='checkbox'
                          className='mr-4'
                          checked={checkedProducts.includes(element.cart_id)}
                          onChange={() => handleCheck(element.cart_id)}
                        />
                        <div className='w-1/2 flex items-center justify-between'>
                          <img
                            src={
                              element.product_images && element.product_images.length > 0
                                ? element.product_images[0]
                                : 'path/to/default/image.jpg'
                            }
                            alt='product image'
                            className='w-16 h-16'
                          />
                          <div>
                            <p className='font-semibold'>{element.product_name}</p>
                            <p className='text-gray-500 text-sm'>Chai</p>
                            <p className='text-yellow-600 bg-yellow-100 rounded px-2 inline-block mt-1 text-sm'>
                              Mua 1 Tặng 1 - (01-31/10)
                            </p>
                            <p className='text-yellow-600 bg-yellow-100 rounded px-2 inline-block mt-1 text-sm'>
                              Giao Nhanh 2H bởi Ahamove
                            </p>
                          </div>
                        </div>
                        <div className='w-1/6 text-center pl-6'>{element.cart_price}</div>
                        <div className='w-1/6 flex text-center justify-end pr-3'>
                          <button
                            className='px-2 py-1 text-lg text-gray-500 border rounded-l'
                            onClick={() => handleSubstract(element)}
                          >
                            -
                          </button>

                          <input
                            className='p-2 w-10 outline-none'
                            value={element.cart_quantity}
                            onChange={(event) => handleInputChange(element, event)}
                            onBlur={(event) => handleInputBlur(element, event)}
                          />
                          <button
                            className='px-2 py-1 text-lg text-gray-500 border rounded-r'
                            onClick={() => handlePlus(element)}
                          >
                            +
                          </button>
                        </div>
                        <div className='w-1/6 text-right pr-4'>{element.cart_price * element.cart_quantity} đ</div>
                        <span
                          className='inline-flex align-[-0.125em] justify-center max-h-full max-w-full w-6 h-6'
                          onClick={() => showModal(element.cart_id)}
                        >
                          <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            {/* Your SVG content here */}
                          </svg>
                        </span>
                        <Modal
                          title={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>Xóa sản phẩm</span>}
                          open={open}
                          onOk={() => handleOk(element.cart_id)}
                          onCancel={handleCancel}
                        >
                          <p className='mt-2 text-lg'> {modalText}</p>
                        </Modal>
                      </div>
                    )
                  })}

                  {/* Total Price Calculation */}
                  <div className='flex justify-end font-semibold text-xl mt-4'>
                    <p>Tổng tiền: </p>
                    <p className='ml-4'>
                      {products.reduce((total, product) => total + product.cart_price * product.cart_quantity, 0)} đ
                    </p>
                  </div>
                </>
              ) : (
                <div>No items in cart.</div>
              )}
            </div>
          </div>
        </div>
        <div className='col-span-3  '>
          <div className='flex  flex-col justify-between   '>
            <div className='flex justify-between border border-2 py-3 px-2'>
              <div className='flex items-center'>
                <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-6'>
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M2 5.54541C2 5.1312 2.33579 4.79541 2.75 4.79541H21.25C21.6642 4.79541 22 5.1312 22 5.54541V9.74996C22 10.1642 21.6642 10.5 21.25 10.5C20.2347 10.5 19.4773 11.2574 19.4773 12.2727C19.4773 13.288 20.2347 14.0454 21.25 14.0454C21.6642 14.0454 22 14.3812 22 14.7954V19C22 19.4142 21.6642 19.75 21.25 19.75H2.75C2.33579 19.75 2 19.4142 2 19V14.7954C2 14.3812 2.33579 14.0454 2.75 14.0454C3.76533 14.0454 4.52273 13.288 4.52273 12.2727C4.52273 11.2574 3.76533 10.5 2.75 10.5C2.33579 10.5 2 10.1642 2 9.74996V5.54541ZM3.5 6.29541V9.08182C4.9672 9.40982 6.02273 10.6881 6.02273 12.2727C6.02273 13.8573 4.9672 15.1355 3.5 15.4635V18.25H20.5V15.4635C19.0328 15.1355 17.9773 13.8573 17.9773 12.2727C17.9773 10.6881 19.0328 9.40982 20.5 9.08182V6.29541H3.5Z'
                    fill='currentColor'
                  ></path>
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M15.053 9.21967C15.3459 9.51256 15.3459 9.98744 15.053 10.2803L10.0076 15.3258C9.71467 15.6187 9.2398 15.6187 8.9469 15.3258C8.65401 15.0329 8.65401 14.558 8.9469 14.2651L13.9924 9.21967C14.2853 8.92678 14.7601 8.92678 15.053 9.21967Z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M9.89772 10.5908C10.5943 10.5908 11.1591 10.0261 11.1591 9.32948C11.1591 8.63285 10.5943 8.06812 9.89772 8.06812C9.20108 8.06812 8.63635 8.63285 8.63635 9.32948C8.63635 10.0261 9.20108 10.5908 9.89772 10.5908Z'
                    fill='currentColor'
                  ></path>
                  <path
                    d='M14.1023 16.4771C14.7989 16.4771 15.3637 15.9123 15.3637 15.2157C15.3637 14.5191 14.7989 13.9543 14.1023 13.9543C13.4057 13.9543 12.8409 14.5191 12.8409 15.2157C12.8409 15.9123 13.4057 16.4771 14.1023 16.4771Z'
                    fill='currentColor'
                  ></path>
                </svg>
                <div className='font-semibold ml-1'>Khuyến mãi</div>
              </div>
              <div className='text-blue hover:text-black'>Chọn mã</div>
            </div>

            <div className='border border-2 py-3 px-2 mt-3'>
              <div className='flex justify-between mt-2  py-3 px-2  '>
                <div className=''>Tạm tính </div>

                <div className='font-semibold'>{total}</div>
              </div>
              <div className='flex justify-between py-3 px-2  '>
                <div className=''>Giảm giá ưu đãi </div>

                <div className=''>-</div>
              </div>

              <div className='flex justify-between  py-3 px-2  '>
                <div className=''>Giảm giá sản phẩm </div>

                <div className='font-semibold'>- 0</div>
              </div>
              <div className='border border-1'></div>

              <div className='flex justify-between  py-3 px-2  my-1 '>
                <div className='font-semibold '>Tổng tiền </div>

                <div className='text-[#F22121] font-semibold'>{total}</div>
              </div>
              <div className='flex mt-2 '>
                <button className='text-white font-medium text-2xl bg-[#1A51A2] px-4 py-2  rounded-lg w-full'>
                  Mua hàng{' '}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
