import React from 'react'
import { Link } from 'react-router-dom'
// Card Product
const ProductCard = ({ product_id, image, labelImage, title, price, oldPrice, likes, soldCount }) => {
  console.log('Product ID:', product_id)
  return (
    <Link to={`/detail/${product_id}`}>
      <div className='rounded-lg overflow-hidden border shadow-md bg-white h-full'>
        <div className='relative'>
          {/* Product Image */}
          <img className='w-full object-contain h-full' src={image} alt={title} />

          {/* Label Image */}
          <div className='absolute bottom-0 left-0 flex h-[26px] w-full'>
            <img
              className='h-full w-full object-contain'
              src={labelImage}
              alt='label'
              loading='lazy'
              width='500'
              height='500'
            />
          </div>
        </div>

        {/* Product Title */}
        <div className='p-2 pb-1 font-medium'>
          <h3 className='line-clamp-2 h-10 text-sm font-semibold'>{title}</h3>
        </div>

        {/* Product Price and Details */}
        <div className='p-2'>
          <span className='mt-[2px] block h-6 text-base font-bold text-blue'>{price}</span>

          {/* Likes and Sold Count */}
          <div className='mb-2 flex items-center py-1 text-sm'>
            <span className='p-icon inline-flex h-4 max-h-full w-4 max-w-full items-center align-[-0.125em] text-neutral-700'>
              <svg xmlns='http://www.w3.org/2000/svg' width='25' height='24' fill='none' viewBox='0 0 25 24'>
                <path
                  fill='currentColor'
                  d='M17.22 2a6.2 6.2 0 0 0-4.72 2.16A6.2 6.2 0 0 0 7.78 2a6.26 6.26 0 0 0-4.55 10.58l8.55 8.9a1 1 0 0 0 1.44 0l8.55-8.9h.01A6.26 6.26 0 0 0 17.22 2Z'
                ></path>
              </svg>
            </span>
            <span className='text-[14px] leading-[20px] mx-1 font-medium'>{likes}</span>
            <span className='text-neutral-600'>|</span>
            <span className='text-[14px] leading-[20px] mx-1 font-medium'>Đã bán {soldCount}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
