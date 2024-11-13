import React, { useEffect, useState } from 'react'
import anh1 from '../../HomeUser/Component/SliderUser/img/sanpham.jpg'
import anh2 from '../../HomeUser/Component/SliderUser/img/sanDeal.png'
import Button1 from '../../../../Component/Button/Button'
import Category from '../../HomeUser/Component/CategoryProduct/Category'
import axios from 'axios'
import ProductCard from '../ProductCard/ProductCard'
export default function ProductList() {
  const [products, setProducts] = useState([])
  const [disease, setDisease] = useState([])
  useEffect(() => {
    const fetchDisease = async () => {
      try {
        const response = await axios.get('https://lucifernsz.com/PBL6-BE/public/api/disease')

        console.log('API Response disease:', response.data.data) // Log the full response to check structure

        // Assuming the response is { data: { products: [...] } } or { data: [...] }
        const data = response.data.products || response.data.data // Adjust based on API structure

        // Check if 'data' is an array before setting state
        if (Array.isArray(data)) {
          setDisease(data)
        } else {
          console.error('Expected an array but received:', data)
        }
      } catch (error) {
        console.error('Error fetching disease:', error)
      }
    }

    fetchDisease()
  }, [])
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://lucifernsz.com/PBL6-BE/public/api/products')

        console.log('API Response:', response.data.data) // Log the full response to check structure
        const data = response.data.products || response.data.data // Adjust based on API structure

        // Check if 'data' is an array before setting state
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          console.error('Expected an array but received:', data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])
  return (
    <div className='bg-white'>
      <div class='bg-neutral-100 h-3'></div>
      <div className='px-24 flex flex-col'>
        <div className='flex justify-between py-4'>
          <h1 className='font-semibold line-clamp-1 text-base md:text-[20px]'>Sản phẩm mới</h1>
          <a
            class='relative flex justify-center border-0 bg-transparent text-sm font-normal text-hyperLink outline-none md:hover:text-white md:text-blue'
            type='button'
            href='/collection/top-san-ban-chay-toan-quoc'
          >
            Xem thêm
          </a>
        </div>

        <div className='mb-5'>
          <div className='grid grid-cols-6 gap-x-4 gap-y-4'>
            {products
              .sort((a, b) => new Date(b.product_created_at) - new Date(a.product_created_at))
              .slice(0, 2 * 6)
              .map((product) => (
                <ProductCard
                  product_id={product.product_id}
                  image={
                    product.product_images?.[0] ||
                    'https://prod-cdn.pharmacity.io/e-com/images/ecommerce/500x500/P02118_2_l.webp'
                  }
                  labelImage='https://prod-cdn.pharmacity.io/e-com/images/ecommerce/20240225082630-0-mua-1-tang-1.png'
                  title={product.product_name}
                  price={`${product.product_price}₫`}
                  oldPrice={
                    product.product_discount && product.product_discount !== '0.00'
                      ? `${product.product_discount}₫`
                      : 'Không giảm giá'
                  }
                  likes={product.likes || 0}
                  soldCount={product.product_sold}
                />
              ))}
          </div>
        </div>
      </div>

      <div class='bg-neutral-100 h-3'></div>
      <div className='bg-[#60e0c0]'>
        <div className='px-24 flex flex-col'>
          <div className='flex justify-between py-4 text-center bg-[#60e0c0]'>
            <h1 className='font-semibold line-clamp-1 text-base md:text-[20px]'>
              <img src={anh2} alt='' />
            </h1>
            <a
              class='relative flex justify-center border-0 bg-transparent text-base font-normal text-hyperLink outline-none md:hover:text-white md:text-blue'
              type='button'
              href='/collection/top-san-ban-chay-toan-quoc'
            >
              Xem thêm
            </a>
          </div>

          <div className='mb-5'>
            <div className='grid grid-cols-6 gap-x-4 gap-y-4'>
              {products
                .filter((product) => product.product_discount > 0)
                .slice(0, 2 * 6)
                .map((product) => (
                  <ProductCard
                    key={product.product_id}
                    image={product.product_images?.[0] || 'fallback-image-url.png'} // Use optional chaining with a fallback
                    labelImage='https://prod-cdn.pharmacity.io/e-com/images/ecommerce/20240225082630-0-mua-1-tang-1.png'
                    title={product.product_name}
                    price={`${product.product_price}₫`}
                    oldPrice={product.product_discount !== '0.00' ? `${product.product_discount}₫` : null}
                    likes={product.likes || 0}
                    soldCount={product.product_sold}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <div class='bg-neutral-100 h-3'></div>

      <div className='px-24 flex flex-col'>
        <div class=' flex items-center justify-between py-4'>
          <h4 class='font-semibold md:font-semibold md:text-[20px] text-base'>Tra cứu bệnh</h4>
          <a
            class='relative flex justify-center border-0 bg-transparent text-sm font-normal text-hyperLink outline-none md:hover:text-primary-600 md:text-base'
            type='button'
            href='/benh'
          >
            Xem thêm
          </a>
        </div>

        <div className='grid grid-cols-3 gap-3 mt-1 mb-3 '>
          <div className='flex  rounded-md shadow-lg relative gap-0 border py-4'>
            <img
              className='rounded-md  bottom-0 left-0 w-[140px] h-[140px] md:w-[140px] md:h-[140px] object-contain'
              src='https://prod-cdn.pharmacity.io/blog/NguoiCaoTuoi.png'
              alt=''
              loading='lazy'
            />

            <div className='flex flex-col'>
              <div class='capitalize text-base font-semibold mb-1 line-clamp-1 ps-[2px] pe-2'>
                <div class=''>Bệnh Người Cao Tuổi</div>
              </div>
              <div className='text-blue'>
                <ul className='leading-5.5 list-disc text-base font-normal'>
                  <li className=''>
                    <a href=''>Tăng huyết áp </a>{' '}
                  </li>
                  <li>Alzheimer </li>
                  <li>Tai biến mạch máu não </li>
                  <li>Bệnh tim mạch </li>
                  <li>Tai biến mạch máu não </li>
                  <li>Bệnh tim mạch </li>
                </ul>
              </div>
            </div>
          </div>

          <div div className='flex  rounded-md shadow-lg relative gap-0 border py-4'>
            <img
              className='rounded-md  bottom-0 left-0 w-[140px] h-[140px] md:w-[140px] md:h-[140px] object-contain'
              src='https://prod-cdn.pharmacity.io/blog/NguoiCaoTuoi.png'
              alt=''
              loading='lazy'
            />

            <div className='flex flex-col'>
              <div class='capitalize text-base font-semibold mb-1 line-clamp-1 ps-[2px] pe-2'>
                <div class=''>Bệnh Người Cao Tuổi</div>
              </div>
              <div className='text-blue'>
                <ul className='leading-5.5 list-disc text-base font-normal'>
                  <li className=''>
                    <a href=''>Tăng huyết áp </a>{' '}
                  </li>
                  <li>Alzheimer </li>
                  <li>Tai biến mạch máu não </li>
                  <li>Bệnh tim mạch </li>
                  <li>Tai biến mạch máu não </li>
                  <li>Bệnh tim mạch </li>
                </ul>
              </div>
            </div>
          </div>

          <div div className='flex  rounded-md shadow-lg relative gap-0 border py-4'>
            <img
              className='rounded-md  bottom-0 left-0 w-[140px] h-[140px] md:w-[140px] md:h-[140px] object-contain'
              src='https://prod-cdn.pharmacity.io/blog/NguoiCaoTuoi.png'
              alt=''
              loading='lazy'
            />

            <div className='flex flex-col'>
              <div class='capitalize text-base font-semibold mb-1 line-clamp-1 ps-[2px] pe-2'>
                <div class=''>Bệnh Người Cao Tuổi</div>
              </div>
              <div className='text-blue'>
                <ul className='leading-5.5 list-disc text-base font-normal'>
                  <li className=''>
                    <a href=''>Tăng huyết áp </a>{' '}
                  </li>
                  <li>Alzheimer </li>
                  <li>Tai biến mạch máu não </li>
                  <li>Bệnh tim mạch </li>
                  <li>Tai biến mạch máu não </li>
                  <li>Bệnh tim mạch </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='bg-neutral-100 h-3' />

      <div className='px-24 flex flex-col'>
        <div class=' flex items-center justify-between pt-4'>
          <h4 class='font-semibold md:font-semibold md:text-[20px] text-base'>Nhóm bệnh theo mùa bệnh</h4>
          <a
            class='relative flex justify-center border-0 bg-transparent text-sm font-normal text-hyperLink outline-none md:hover:text-primary-600 md:text-base'
            type='button'
            href='/benh'
          >
            Xem thêm
          </a>
        </div>
        <div className='grid grid-cols-6 gap-6 py-4'>
          <div class='flex items-center gap-2 rounded-md shadow-lg'>
            <img
              class='rounded-md object-cover md:h-[80px] md:w-[80px] w-[80px] h-[80px]'
              src='https://prod-cdn.pharmacity.io/blog/benh-soi-la-gi.png'
              alt=''
              loading='lazy'
              width='500'
              height='500'
            />
            <div class='flex-1 text-sm font-medium'>
              <div class='font-medium capitalize text-sm line-clamp-3'>
                <a href='/benh/soi.html'>
                  <div class='[&amp;_a:not(.ignore-css_a)]:text-hyperLink break-word line-clamp-2 text-sm font-semibold'>
                    Bệnh sởi
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className=''>2</div>
          <div className=''>2</div>
          <div className=''>2</div>
          <div className=''>2</div>
          <div class='flex items-center gap-2 rounded-md shadow-lg'>
            <img
              class='rounded-md object-cover md:h-[80px] md:w-[80px] w-[80px] h-[80px]'
              src='https://prod-cdn.pharmacity.io/blog/6O8D9s5k-benh-tay-chan-mieng.png'
              alt=''
              loading='lazy'
              width='500'
              height='500'
            />
            <div class='flex-1 text-sm font-medium'>
              <div class='font-medium capitalize text-sm line-clamp-3'>
                <a href='/benh/soi.html'>
                  <div class='[&amp;_a:not(.ignore-css_a)]:text-hyperLink break-word line-clamp-2 text-sm font-semibold'>
                    Chân tay miệng
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class='bg-neutral-100 h-3' />

      <div className='px-24 flex flex-col py-4'>
        <div class=' flex items-center justify-between pt-4'>
          <h4 class='font-semibold md:font-semibold md:text-[20px] text-base'>Gốc Sức khỏe</h4>
          <a
            class='relative flex justify-center border-0 bg-transparent text-sm font-normal text-hyperLink outline-none md:hover:text-primary-600 md:text-base'
            type='button'
            href='/benh'
          >
            Xem thêm
          </a>
        </div>
        <div className='py-4 flex justify-between'>
          <Button1 title='Bài viết nổi bật' type='primary' />
          <Button1 title='Tin tức' />
          <Button1 title='Mẹ và bé' />
          <Button1 title='Dinh dưỡng' />
          <Button1 title='Sống khỏe' />
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <div className=''>
            <div className='overflow-hidden rounded-sm   mb-2 w-full'>
              <img
                className='h-full w-full object-cover'
                src='https://prod-cdn.pharmacity.io/blog/PMC-ho-tro-bao-yagi-5.jpg'
                alt=''
              />
            </div>
            <div className=''>
              <div class='mt-1 bg-[#525252] w-[52px] text-xs font-medium text-white rounded-sm text-center'>
                Tin tức
              </div>
              <p className='font-semibold my-1 text-base'>
                Pharmacity hỗ trợ sức khỏe người dân ở vùng bị ảnh hưởng sau bão lũ
              </p>
              <p className=' line-clamp-2 text-sm '>
                Sáng 17/9, Tổng giám đốc Công ty Cổ phần Dược phẩm Pharmacity đã đến thăm và tặng quà cho người dân tại
                xã Hiền Lương, huyện Hạ Hòa, tỉnh Phú Thọ. Đây là địa phương có nhiều hộ dân vẫn còn bị chia cắt bởi
                nước lũ, trong khi một số nơi khác đã bắt […]
              </p>
            </div>
          </div>

          <div className='flex flex-col justify-between'>
            <div className='flex gap-2 '>
              <div className='overflow-hidden rounded-sm   mb-2 w-full'>
                <img
                  className='h-full w-full object-cover'
                  src='https://prod-cdn.pharmacity.io/blog/PMC-ho-tro-bao-yagi-5.jpg'
                  alt=''
                />
              </div>
              <div className=''>
                <div class='mt-1 bg-[#525252] w-[52px] text-xs font-medium text-white rounded-sm text-center'>
                  Tin tức
                </div>
                <p className='font-semibold my-1 text-base'>
                  Pharmacity hỗ trợ sức khỏe người dân ở vùng bị ảnh hưởng sau bão lũ
                </p>
                <p className=' line-clamp-2 text-sm '>
                  Sáng 17/9, Tổng giám đốc Công ty Cổ phần Dược phẩm Pharmacity đã đến thăm và tặng quà cho người dân
                  tại xã Hiền Lương, huyện Hạ Hòa, tỉnh Phú Thọ. Đây là địa phương có nhiều hộ dân vẫn còn bị chia cắt
                  bởi nước lũ, trong khi một số nơi khác đã bắt […]
                </p>
              </div>
            </div>
            <div className='flex gap-2 '>
              <div className='overflow-hidden rounded-sm   mb-2 w-full'>
                <img
                  className='h-full w-full object-cover'
                  src='https://prod-cdn.pharmacity.io/blog/PMC-ho-tro-bao-yagi-5.jpg'
                  alt=''
                />
              </div>
              <div className=''>
                <div class='mt-1 bg-[#525252] w-[52px] text-xs font-medium text-white rounded-sm text-center'>
                  Tin tức
                </div>
                <p className='font-semibold my-1 text-base'>
                  Pharmacity hỗ trợ sức khỏe người dân ở vùng bị ảnh hưởng sau bão lũ
                </p>
                <p className=' line-clamp-2 text-sm '>
                  Sáng 17/9, Tổng giám đốc Công ty Cổ phần Dược phẩm Pharmacity đã đến thăm và tặng quà cho người dân
                  tại xã Hiền Lương, huyện Hạ Hòa, tỉnh Phú Thọ. Đây là địa phương có nhiều hộ dân vẫn còn bị chia cắt
                  bởi nước lũ, trong khi một số nơi khác đã bắt […]
                </p>
              </div>
            </div>
            <div className='flex gap-2 '>
              <div className='overflow-hidden rounded-sm   mb-2 w-full'>
                <img
                  className='h-full w-full object-cover'
                  src='https://prod-cdn.pharmacity.io/blog/PMC-ho-tro-bao-yagi-5.jpg'
                  alt=''
                />
              </div>
              <div className=''>
                <div class='mt-1 bg-[#525252] w-[52px] text-xs font-medium text-white rounded-sm text-center'>
                  Tin tức
                </div>
                <p className='font-semibold my-1 text-base'>
                  Pharmacity hỗ trợ sức khỏe người dân ở vùng bị ảnh hưởng sau bão lũ
                </p>
                <p className=' line-clamp-2 text-sm '>
                  Sáng 17/9, Tổng giám đốc Công ty Cổ phần Dược phẩm Pharmacity đã đến thăm và tặng quà cho người dân
                  tại xã Hiền Lương, huyện Hạ Hòa, tỉnh Phú Thọ. Đây là địa phương có nhiều hộ dân vẫn còn bị chia cắt
                  bởi nước lũ, trong khi một số nơi khác đã bắt […]
                </p>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-between'>
            <div className='flex gap-2 '>
              <div className='overflow-hidden rounded-sm   mb-2 w-full'>
                <img
                  className='h-full w-full object-cover'
                  src='https://prod-cdn.pharmacity.io/blog/PMC-ho-tro-bao-yagi-5.jpg'
                  alt=''
                />
              </div>
              <div className=''>
                <div class='mt-1 bg-[#525252] w-[52px] text-xs font-medium text-white rounded-sm text-center'>
                  Tin tức
                </div>
                <p className='font-semibold my-1 text-base'>
                  Pharmacity hỗ trợ sức khỏe người dân ở vùng bị ảnh hưởng sau bão lũ
                </p>
                <p className=' line-clamp-2 text-sm '>
                  Sáng 17/9, Tổng giám đốc Công ty Cổ phần Dược phẩm Pharmacity đã đến thăm và tặng quà cho người dân
                  tại xã Hiền Lương, huyện Hạ Hòa, tỉnh Phú Thọ. Đây là địa phương có nhiều hộ dân vẫn còn bị chia cắt
                  bởi nước lũ, trong khi một số nơi khác đã bắt […]
                </p>
              </div>
            </div>
            <div className='flex gap-2 '>
              <div className='overflow-hidden rounded-sm   mb-2 w-full'>
                <img
                  className='h-full w-full object-cover'
                  src='https://prod-cdn.pharmacity.io/blog/PMC-ho-tro-bao-yagi-5.jpg'
                  alt=''
                />
              </div>
              <div className=''>
                <div class='mt-1 bg-[#525252] w-[52px] text-xs font-medium text-white rounded-sm text-center'>
                  Tin tức
                </div>
                <p className='font-semibold my-1 text-base'>
                  Pharmacity hỗ trợ sức khỏe người dân ở vùng bị ảnh hưởng sau bão lũ
                </p>
                <p className=' line-clamp-2 text-sm '>
                  Sáng 17/9, Tổng giám đốc Công ty Cổ phần Dược phẩm Pharmacity đã đến thăm và tặng quà cho người dân
                  tại xã Hiền Lương, huyện Hạ Hòa, tỉnh Phú Thọ. Đây là địa phương có nhiều hộ dân vẫn còn bị chia cắt
                  bởi nước lũ, trong khi một số nơi khác đã bắt […]
                </p>
              </div>
            </div>
            <div className='flex gap-2 '>
              <div className='overflow-hidden rounded-sm   mb-2 w-full'>
                <img
                  className='h-full w-full object-cover'
                  src='https://prod-cdn.pharmacity.io/blog/PMC-ho-tro-bao-yagi-5.jpg'
                  alt=''
                />
              </div>
              <div className=''>
                <div class='mt-1 bg-[#525252] w-[52px] text-xs font-medium text-white rounded-sm text-center'>
                  Tin tức
                </div>
                <p className='font-semibold my-1 text-base'>
                  Pharmacity hỗ trợ sức khỏe người dân ở vùng bị ảnh hưởng sau bão lũ
                </p>
                <p className=' line-clamp-2 text-sm '>
                  Sáng 17/9, Tổng giám đốc Công ty Cổ phần Dược phẩm Pharmacity đã đến thăm và tặng quà cho người dân
                  tại xã Hiền Lương, huyện Hạ Hòa, tỉnh Phú Thọ. Đây là địa phương có nhiều hộ dân vẫn còn bị chia cắt
                  bởi nước lũ, trong khi một số nơi khác đã bắt […]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Category />
      <div class='bg-blue h-3' />
    </div>
  )
}
