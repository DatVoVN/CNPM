// Hiên thị danh mục
import React, { useContext } from 'react'
import { Popover } from 'antd'
import Avatar1 from '../../../../Component/Avatar/Avatar'
import { useNavigate, createSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'
import CartAPI from '../../../../Api/user/cart.js'
import { useQuery } from '@tanstack/react-query'
import { Badge } from 'antd'
import { Button } from 'antd'
import { AuthContext } from '../../../../context/app.context'
import categoryAPI from '../../../../Api/user/category.js'
export default function Search(class1 = 'text-blue') {
  const { isAuthenticated, logout, isProfile } = useContext(AuthContext)
  const [openCategory, setopenCategory] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const handleClickCategory = (categoryName) => {
    navigate({
      pathname: '/category',
      search: `?${createSearchParams({
        category_name: `${categoryName}`
      })}`
    })
  }
  const { data: ListCategory } = useQuery({
    queryKey: ['getCategory'],
    queryFn: categoryAPI.getCategery,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000 // Dữ liệu được giữ trong cache tối đa 10 phút
  })

  //console.log(ListCategory?.data?.data)

  var handleClick = () => {
    setopenCategory(!openCategory)
  }
  const handleCategorySelect = (category) => {
    setSelectedCategory(category) // Cập nhật danh mục được chọn
  }
  const navigate = useNavigate()
  const handleDrop = () => {}
  const { data } = useQuery({
    queryKey: ['getCart'],
    queryFn: CartAPI.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10
  })

  var handleNavigate = () => {
    navigate('/cart')
  }
  var handleLogout = () => {
    logout()
    navigate('/login')
  }
  console.log(data?.data?.data?.length)
  const profile = (
    <div className='w-full  rounded-md '>
      <div className=''>
        <ul className='space-y-3 text-black'>
          <Link
            to='/account/profile'
            className='hover:bg-gray-100 0 p-2 rounded-md transition duration-300 cursor-pointer flex items-center '
          >
            <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' width={25} height={25}>
              <path
                fillrule='evenodd'
                cliprule='evenodd'
                d='M12 7.09923C10.5053 7.09923 9.29339 8.31114 9.29339 9.80584V11.5001C9.29339 12.9948 10.5053 14.2067 12 14.2067C13.4947 14.2067 14.7066 12.9948 14.7066 11.5001V9.80584C14.7066 8.31114 13.4947 7.09923 12 7.09923ZM7.92976 9.80584C7.92976 7.55803 9.75219 5.7356 12 5.7356C14.2478 5.7356 16.0703 7.55803 16.0703 9.80584V11.5001C16.0703 13.7479 14.2478 15.5703 12 15.5703C9.75219 15.5703 7.92976 13.7479 7.92976 11.5001V9.80584Z'
                fill='currentColor'
              />
              <path
                fillrule='evenodd'
                cliprule='evenodd'
                d='M6.31036 18.8101C7.36688 17.5511 8.95451 16.7478 10.7293 16.7478H13.2707C15.0372 16.7478 16.6369 17.5756 17.6885 18.8127L16.6496 19.6959C15.8375 18.7406 14.6079 18.1114 13.2707 18.1114H10.7293C9.37494 18.1114 8.16373 18.7228 7.35492 19.6866L6.31036 18.8101Z'
                fill='currentColor'
              />
              <path
                fillrule='evenodd'
                cliprule='evenodd'
                d='M12 2.86364C7.23027 2.86364 3.36364 6.73027 3.36364 11.5C3.36364 16.2697 7.23027 20.1364 12 20.1364C16.7697 20.1364 20.6364 16.2697 20.6364 11.5C20.6364 6.73027 16.7697 2.86364 12 2.86364ZM2 11.5C2 5.97715 6.47715 1.5 12 1.5C17.5228 1.5 22 5.97715 22 11.5C22 17.0228 17.5228 21.5 12 21.5C6.47715 21.5 2 17.0228 2 11.5Z'
                fill='currentColor'
              />
            </svg>

            <span className='ml-2 text-base font-medium'>Thông tin cá nhân</span>
          </Link>
          <Link
            to='/account/order-history'
            className='hover:bg-gray-100 p-2 rounded-md transition duration-300 cursor-pointer flex items-center '
          >
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 37 36' width={25} height={25}>
              <path
                fill='currentColor'
                fillrule='evenodd'
                d='M10.46 22.622c.49.284.688.975.443 1.543L8.092 30.7h20.316l-2.812-6.534c-.244-.568-.046-1.26.443-1.543.49-.284 1.084-.054 1.328.514l3.528 8.2c.154.356.137.78-.043 1.118-.18.34-.499.546-.842.546H6.49c-.343 0-.662-.206-.842-.546a1.314 1.314 0 01-.043-1.119l3.528-8.199c.244-.568.839-.798 1.328-.514z'
                cliprule='evenodd'
              />
              <path
                fill='currentColor'
                fillrule='evenodd'
                d='M18.25 5.14c-3.733 0-7.657 2.89-7.657 7.83 0 1.116.454 2.523 1.243 4.084.778 1.538 1.828 3.12 2.896 4.558a57.136 57.136 0 003.518 4.266 57.136 57.136 0 003.518-4.266c1.068-1.438 2.118-3.02 2.896-4.558.79-1.56 1.243-2.968 1.243-4.085 0-4.939-3.924-7.829-7.657-7.829zm0 22.29l-.743.753-.003-.002-.005-.006-.02-.021-.077-.08-.285-.303a59.33 59.33 0 01-4.053-4.865c-1.107-1.49-2.233-3.18-3.087-4.869C9.134 16.372 8.5 14.598 8.5 12.97 8.5 6.645 13.57 3 18.25 3S28 6.644 28 12.97c0 1.628-.634 3.402-1.477 5.067-.854 1.688-1.98 3.378-3.088 4.87a59.33 59.33 0 01-4.337 5.167l-.076.08-.02.021-.006.006-.002.002-.744-.753zm0 0l.744.753a1.038 1.038 0 01-.744.317c-.279 0-.547-.114-.743-.317l.743-.753z'
                cliprule='evenodd'
              />
              <path
                fill='currentColor'
                fillrule='evenodd'
                d='M18.25 11.222a1.528 1.528 0 100 3.056 1.528 1.528 0 000-3.056zM14.5 12.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z'
                cliprule='evenodd'
              />
            </svg>

            <span className='ml-2 text-base font-medium'> Lịch sử đơn hàng</span>
          </Link>
          <Link
            to=''
            className='hover:bg-gray-100 p-2 rounded-md transition duration-300 cursor-pointer flex items-center'
          >
            <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' width={25} height={25}>
              <path
                fillrule='evenodd'
                cliprule='evenodd'
                d='M2 5.54541C2 5.1312 2.33579 4.79541 2.75 4.79541H21.25C21.6642 4.79541 22 5.1312 22 5.54541V9.74996C22 10.1642 21.6642 10.5 21.25 10.5C20.2347 10.5 19.4773 11.2574 19.4773 12.2727C19.4773 13.288 20.2347 14.0454 21.25 14.0454C21.6642 14.0454 22 14.3812 22 14.7954V19C22 19.4142 21.6642 19.75 21.25 19.75H2.75C2.33579 19.75 2 19.4142 2 19V14.7954C2 14.3812 2.33579 14.0454 2.75 14.0454C3.76533 14.0454 4.52273 13.288 4.52273 12.2727C4.52273 11.2574 3.76533 10.5 2.75 10.5C2.33579 10.5 2 10.1642 2 9.74996V5.54541ZM3.5 6.29541V9.08182C4.9672 9.40982 6.02273 10.6881 6.02273 12.2727C6.02273 13.8573 4.9672 15.1355 3.5 15.4635V18.25H20.5V15.4635C19.0328 15.1355 17.9773 13.8573 17.9773 12.2727C17.9773 10.6881 19.0328 9.40982 20.5 9.08182V6.29541H3.5Z'
                fill='currentColor'
              />
              <path
                fillrule='evenodd'
                cliprule='evenodd'
                d='M15.053 9.21967C15.3459 9.51256 15.3459 9.98744 15.053 10.2803L10.0076 15.3258C9.71467 15.6187 9.2398 15.6187 8.9469 15.3258C8.65401 15.0329 8.65401 14.558 8.9469 14.2651L13.9924 9.21967C14.2853 8.92678 14.7601 8.92678 15.053 9.21967Z'
                fill='currentColor'
              />
              <path
                d='M9.89772 10.5908C10.5943 10.5908 11.1591 10.0261 11.1591 9.32948C11.1591 8.63285 10.5943 8.06812 9.89772 8.06812C9.20108 8.06812 8.63635 8.63285 8.63635 9.32948C8.63635 10.0261 9.20108 10.5908 9.89772 10.5908Z'
                fill='currentColor'
              />
              <path
                d='M14.1023 16.4771C14.7989 16.4771 15.3637 15.9123 15.3637 15.2157C15.3637 14.5191 14.7989 13.9543 14.1023 13.9543C13.4057 13.9543 12.8409 14.5191 12.8409 15.2157C12.8409 15.9123 13.4057 16.4771 14.1023 16.4771Z'
                fill='currentColor'
              />
            </svg>

            <span className='ml-2 text-base font-medium'> Mã giảm giá</span>
          </Link>
          <Link
            to='/account/address'
            className='hover:bg-gray-100 p-2 rounded-md transition duration-300 cursor-pointer flex items-center'
          >
            <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' width={25} height={25}>
              <path fillrule='evenodd' cliprule='evenodd' d='M7 11H17V12.5H7V11Z' fill='currentColor' />
              <path fillrule='evenodd' cliprule='evenodd' d='M7 15H17V16.5H7V15Z' fill='currentColor' />
              <path
                fillrule='evenodd'
                cliprule='evenodd'
                d='M3 4H6.03464V5.37182H4.37182V20.6282H19.6282V5.37182H17.9654V4H21V22H3V4Z'
                fill='currentColor'
              />
              <path
                fillrule='evenodd'
                cliprule='evenodd'
                d='M7 2H17V8H13.0086V7.35294C13.0086 6.84364 12.5574 6.43137 12 6.43137C11.4426 6.43137 10.9914 6.84364 10.9914 7.35294V8H7V2ZM8.41631 3.29412V6.70588H9.68007C9.98292 5.79769 10.9068 5.13725 12 5.13725C13.0932 5.13725 14.0171 5.79769 14.3199 6.70588H15.5837V3.29412H8.41631Z'
                fill='currentColor'
              />
            </svg>

            <span className='ml-2 text-base font-medium'> Địa chỉ đơn hàng </span>
          </Link>
          <li
            className='hover:bg-gray-100 p-2 rounded-md transition duration-300 cursor-pointer ml-2 text-base font-medium'
            onClick={handleLogout}
          >
            Đăng xuất
          </li>
        </ul>
      </div>
    </div>
  )

  const ShopingCart = (
    <div className=''>
      <div className='w-full  '>
        <p className='text-xl font-thin '>Sản phẩm mới thêm </p>
        {data?.data?.data ? (
          data.data.data.map((element) => {
            return (
              <div className='flex justify-between w-full py-2 mt-3 hover:bg-gray-300' key={element.cart_id}>
                <div div className='flex gap-x-1  '>
                  <div className='h-20 w-20  '>
                    <img
                      src={
                        Array.isArray(element.product_images) && element.product_images.length > 0
                          ? element.product_images[0] // Nếu có ảnh, lấy ảnh đầu tiên
                          : 'path/to/default/image.jpg' // Nếu không có ảnh, dùng ảnh mặc định
                      }
                      alt=''
                      className='object-cover h-full w-full'
                    />
                  </div>

                  <p className='truncate overflow-hidden whitespace-nowrap w-[250px] text-base font-normal'>
                    {element.product_name}
                  </p>
                </div>
                <div className='text-red-500 pr-2'>9{element.cart_price}</div>
              </div>
            )
          })
        ) : (
          <div>No items in cart.</div>
        )}
      </div>
      <div className='flex justify-between items-center my-2'>
        <span>{data?.data?.data?.length} Thêm hàng vào giỏ </span>
        <button className='bg-[#1A51A2] px-3 py-2  rounded-lg text-white ' onClick={handleNavigate}>
          Xem giỏ hàng 1
        </button>
      </div>
    </div>
  )

  const content = (
    <>
      {!isAuthenticated ? (
        <div className='w-full'>
          <div>
            <p className='text-lg font-semibold'>Thông báo mới</p>
            <div className='flex flex-col justify-center items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                opacity='0.6'
                className='size-10'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5'
                />
              </svg>

              <p className='text-lg pt-2 font-semibold'>Bạn chưa đăng nhập</p>
              <p className='my-1'>Hãy đăng nhập để xem thông báo của mình</p>
              <button
                className='opacity-90 bg-blue-500 px-3 py-2 text-white rounded-lg mt-4 hover:opacity-100'
                onClick={() => navigate('/login')} // Thêm hàm sự kiện vào đây
                aria-label='Login Button'
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col'>
          <div className='flex justify-between'>
            <div className=''>Thông báo mới </div>
            <div className=''>Đọc tất cả</div>
          </div>
          <div className='flex flex-col items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='size-24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5'
              />
            </svg>

            <div className=''>Chưa có thông báo mới</div>
          </div>
        </div>
      )}
    </>
  )
  return (
    <>
      <div className='z-20 mx-auto w-full  md:pb-3 md:pt-4 bg-[#1a51a2]'>
        <div className='flex items-center md:mb-4 px-24 '>
          <div className='flex w-full flex-col-reverse items-start md:flex-row gap-5'>
            {' '}
            <div className=' hidden md:flex shrink-0 '>
              <img
                class='w-[70px] h-[70px] cursor-pointer rounded-full bg-white object-cover'
                src='/assets/images/Logo.jpg'
                alt='Pharmacity Logo'
              />
            </div>
            <div className='z-[11] grid w-full grid-cols-1 md:z-[10]'>
              <div className='w-full'>
                <div className='mx-auto w-full'>
                  <div className=' text-white flex bg-white rounded-md items-center justify-center'>
                    <button className='ml-2'>
                      <span className='p-icon inline-flex align-[-0.125em] justify-center max-h-full max-w-full w-6 h-10 text-black'>
                        <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M15.5 15.4366C15.7936 15.143 16.2697 15.143 16.5634 15.4366L21.7798 20.7163C22.0734 21.01 22.0734 21.4861 21.7798 21.7797C21.4861 22.0734 21.01 22.0734 20.7164 21.7797L15.5 16.5C15.2064 16.2064 15.2064 15.7303 15.5 15.4366Z'
                            fill='currentColor'
                          ></path>
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M10.5 3.57732C6.67671 3.57732 3.57732 6.67671 3.57732 10.5C3.57732 14.3233 6.67671 17.4227 10.5 17.4227C14.3233 17.4227 17.4227 14.3233 17.4227 10.5C17.4227 6.67671 14.3233 3.57732 10.5 3.57732ZM2 10.5C2 5.80558 5.80558 2 10.5 2C15.1944 2 19 5.80558 19 10.5C19 15.1944 15.1944 19 10.5 19C5.80558 19 2 15.1944 2 10.5Z'
                            fill='currentColor'
                          ></path>
                        </svg>
                      </span>
                    </button>
                    <input
                      className='w-full border-neutral-500  focus:ring-neutral-500 focus:border-neutral-700 outline-none p-3.5 search-input flex h-10 items-center justify-start rounded-sm border-0  py-1 pl-10 text-start text-sm font-medium text-neutral-800  truncate '
                      placeholder='Tên thuốc, triệu chứng, vitamin và thực phẩm chức năng'
                      onFocus={handleDrop}
                    />
                  </div>
                </div>
              </div>
              <div className='flex mt-[4px] space-x-3 text-white test-xs '>
                <div className='h-5'>
                  <a href=''>
                    <span title='khẩu trang' class='text-[14px] leading-[20px]'>
                      khẩu trang
                    </span>
                  </a>
                </div>
                <div className='h-5'>
                  <a href=''>
                    <span title='khẩu trang' class='text-[14px] leading-[20px]'>
                      hạ sốt
                    </span>
                  </a>
                </div>
                <div className='h-5'>
                  <a href=''>
                    <span title='khẩu trang' class='text-[14px] leading-[20px]'>
                      giải rượu
                    </span>
                  </a>
                </div>

                <div className='h-5'>
                  <a href=''>
                    <span title='khẩu trang' class='text-[14px] leading-[20px]'>
                      nhỏ mắt
                    </span>
                  </a>
                </div>

                <div className='h-5'>
                  <a href=''>
                    <span title='khẩu trang' class='text-[14px] leading-[20px]'>
                      collagen
                    </span>
                  </a>
                </div>
                <div className='h-5'>
                  <a href=''>
                    <span title='khẩu trang' class='text-[14px] leading-[20px]'>
                      chăm sóc mẹ bầu
                    </span>
                  </a>
                </div>

                <div className='lg:h-5 lg:block hidden'>
                  <a href=''>
                    <span title='khẩu trang' class='text-[14px] leading-[20px]'>
                      kem chống nắng
                    </span>
                  </a>
                </div>

                <div className=' lg:h-5 lg:block hidden'>
                  <a href=''>
                    <span title='khẩu trang' class='text-[14px] leading-[20px]'>
                      Mua 1 tặng 1
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className='flex relative'>
              <Popover content={content} placement='bottomRight' overlayStyle={{ width: '300px' }}>
                <button className='h-10 px-3 text-white h-10'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-7 text-white text-blue h-full'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5'
                    />
                  </svg>
                </button>
              </Popover>
              <Popover content={ShopingCart} placement='bottomRight' className='' overlayStyle={{ width: '450px' }}>
                <Badge count={data?.data?.data?.length > 0 ? data.data.data.length : ''} offset={[-15, 7]}>
                  <div className='h-10 px-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokewidth='1.5'
                      stroke='currentColor'
                      className='size-7 h-10 text-white '
                    >
                      <path
                        strokelinecap='round'
                        strokelinejoin='round'
                        d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                      />
                    </svg>
                  </div>
                </Badge>
              </Popover>
              <div className='border-color-white absolute bottom-[6px] right-0 top-[6px] hidden border-l-[1px] md:inline-block'></div>
            </div>
            {isAuthenticated ? (
              <div className='flex items-center'>
                <Popover content={profile} placement='bottomRight' overlayStyle={{ width: '230px' }}>
                  <div className='flex items-center cursor-pointer'>
                    <Avatar1 user_avatar={isProfile?.user_avatar} />
                    <div className='w-full h-10 flex items-center justify-center ml-1'>{isProfile?.user_fullname}</div>
                  </div>
                </Popover>
              </div>
            ) : (
              <Button type='' className='text-black font-semibold'>
                <span onClick={() => navigate('/login')}>Đăng nhập</span>
                <span>/</span>
                <span onClick={() => navigate('/register')}>Đăng kí</span>
              </Button>
            )}
          </div>
        </div>

        <div className='px-24 flex gap-2'>
          <div className='flex '>
            <button
              onClick={handleClick}
              className='flex font-semibold bg-white test-sm py-2 px-2 rounded-sm justify-between w-[200px] hover:text-blue'
            >
              <div className='flex justify-center items-center gap-2'>
                <span>
                  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='bg-white w-5 h-5'>
                    <path
                      d='M21.2188 11.2222H2.78125C2.34977 11.2222 2 11.5704 2 11.9999C2 12.4295 2.34977 12.7777 2.78125 12.7777H21.2188C21.6502 12.7777 22 12.4295 22 11.9999C22 11.5704 21.6502 11.2222 21.2188 11.2222Z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M21.2188 5H2.78125C2.34977 5 2 5.34821 2 5.77777C2 6.20733 2.34977 6.55554 2.78125 6.55554H21.2188C21.6502 6.55554 22 6.20733 22 5.77777C22 5.34821 21.6502 5 21.2188 5Z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M21.2188 17.4446H2.78125C2.34977 17.4446 2 17.7928 2 18.2223C2 18.6519 2.34977 19.0001 2.78125 19.0001H21.2188C21.6502 19.0001 22 18.6519 22 18.2223C22 17.7928 21.6502 17.4446 21.2188 17.4446Z'
                      fill='currentColor'
                    ></path>
                  </svg>
                </span>
                <span>Danh mục</span>
              </div>
              <span
                className={`inline-flex justify-center max-h-full max-w-full h-full w-[calc(14rem/16)] transition duration-200 ${!openCategory ? '' : 'rotate-180'}`}
              >
                <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M12.7138 16.7077L21.7048 7.71374C22.0984 7.31909 22.0984 6.6797 21.7048 6.28406C21.3111 5.88941 20.6717 5.88941 20.2781 6.28406L12.0005 14.5646L3.72293 6.28505C3.32928 5.89041 2.68989 5.89041 2.29524 6.28505C1.90159 6.6797 1.90159 7.32009 2.29524 7.71474L11.2861 16.7087C11.6757 17.0973 12.3251 17.0973 12.7138 16.7077Z'
                    fill='currentColor'
                  ></path>
                </svg>
              </span>
            </button>

            <div className=''></div>
          </div>
        </div>
      </div>
      {openCategory && (
        <div
          className='grid grid-cols-6 px-24 gap-x-3 z-10 absolute bg-white'
          onMouseLeave={() => setopenCategory(false)}
        >
          <div className='col-span-2 bg-yellow-500 pt-3 border border-r-2'>
            <div className='flex flex-col rounded-lg'>
              {ListCategory?.data?.data &&
                ListCategory.data.data.map((element, index) => (
                  <div
                    key={index}
                    onClick={() => handleCategorySelect(element)}
                    className={`flex p-3 gap-2 text-black mb-3 mr-2 items-center rounded-lg font-medium hover:bg-[#EBFAFB] ${selectedCategory?.category_id === element.category_id ? 'bg-[#EBFAFB]' : ''}`}
                  >
                    <div className='w-[40px] h-[40px]'>
                      <img src={element.category_thumbnail} alt='nopic' className='w-full h-full object-cover' />
                    </div>
                    <span className='capitalize text-[15px]'>{element.category_name}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className='col-span-4 bg-yellow-500 rounded-lg pt-3'>
            <div className='grid grid-cols-8 gap-4 cursor-pointer'>
              {selectedCategory?.children?.length > 0 ? (
                selectedCategory.children.map((elChildren, childIndex) => (
                  <div key={childIndex} className='flex flex-col items-center gap-y-2 w-[120px] h-[160px] p-2'>
                    <div onClick={() => handleClickCategory(elChildren.category_name)} className='w-[100px] h-[100px]'>
                      <img
                        src={elChildren.category_thumbnail}
                        alt='anh'
                        className='w-full h-full object-cover rounded-md border'
                      />
                    </div>
                    <p className='text-center text-sm font-medium text-gray-700'>{elChildren.category_name}</p>
                  </div>
                ))
              ) : (
                <div className='flex justify-center items-center w-full h-full'>
                  <p className='text-center text-sm font-medium text-gray-700'>Không có danh mục con</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
