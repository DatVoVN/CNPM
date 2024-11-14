import React from 'react'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createSearchParams, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import useQueryParams from '../../../hook/useSearchParam'
import productAPI from '../../../Api/user/product'
import { Link } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import categoryAPI from '../../../Api/user/category'
import brandAPI from '../../../Api/user/brand'
import { useLocation } from 'react-router-dom'
import { schemaPrice } from '../../../Component/ValidateScheme/Validate'
import Loading from '../../../Component/Loading/Loading'
import { generateNameId } from '../../../until/index.js'
import ProductCard from '../ProductUser/ProductCard/ProductCard.jsx'
export default function CategoryListProduct() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const brands = queryParams.getAll('brands[]')

  const [visibleBrands, setVisibleBrands] = useState(5)
  const [filteredBrands, setFilteredBrands] = useState([])
  const [NameBrands, setNameBrands] = useState(brands || [])
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schemaPrice)
  })

  const onSubmit = (data) => {
    const searchParams = createSearchParams({
      ...useQueryParameter,
      price_max: data.price_max,
      price_min: data.price_min
    }).toString()
    navigate({
      pathname: `/category`,
      search: `?${searchParams}`
    })
  }
  const navigate = useNavigate()
  const { categorySlug } = useParams()
  const useQueryParameter = useQueryParams()
  useQueryParameter.paginate = 6
  console.log(useQueryParameter)
  const { data: productsData } = useQuery({
    queryKey: ['products', useQueryParameter],
    queryFn: () => {
      return productAPI.getAllProduct(useQueryParameter)
    }
  })
  if (useQueryParameter.category_name == 'Thuốc kê đơn') {
    var idcategory
    idcategory = 4
  } else if (useQueryParameter.category_name == 'Thuốc không kê đơn') {
    idcategory = 3
  }
  const { data: getCategorybyid, isLoading } = useQuery({
    queryKey: ['products', idcategory],
    queryFn: () => {
      return categoryAPI.getCategorybyId(idcategory)
    },
    staleTime: 1000 * 60 * 5,

    enabled: !!idcategory
  })

  const handlePriceDes = () => {
    const searchParams = createSearchParams({
      ...useQueryParameter,
      typesort: 'product_price',
      sortlatest: true
    }).toString()

    navigate({
      pathname: `/category`,
      search: `?${searchParams}`
    })
  }
  const handlePriceAsc = () => {
    const searchParams = createSearchParams({
      ...useQueryParameter,
      typesort: 'product_price',
      sortlatest: false
    }).toString()

    console.log(searchParams)
    navigate({
      pathname: `/category`,
      search: `?${searchParams}`
    })
  }
  const handleClickCategory = (categoryName) => {
    navigate({
      pathname: `/category`,
      search: `?${createSearchParams({
        category_name: `${categoryName}`
      })}`
    })
  }
  const handleRadioChange = (e) => {
    const [price_min, price_max] = e.target.value.split('-')
    const searchParams = createSearchParams({
      ...useQueryParameter,
      price_min: price_min,
      price_max: price_max
    }).toString()
    navigate({
      pathname: `/category`,
      search: `?${searchParams}`
    })
  }

  const isChecked = (min, max) => {
    return useQueryParameter?.price_max == max && useQueryParameter?.price_min == min
  }
  const { data: nameBrand, isSuccess } = useQuery({
    queryKey: ['getNameBrand'],
    queryFn: brandAPI.getNameBrand,
    staleTime: 1000 * 60 * 5 // Dữ liệu được coi là mới trong 5 phút
  })

  const handleChangeBrand = (e) => {
    const selectedBrand = e.target.value
    const fillterBrand = nameBrand?.data?.data.filter((brand) => {
      return brand.brand_name.toLowerCase().startsWith(selectedBrand.toLowerCase())
    })
    setFilteredBrands(fillterBrand)
  }
  useEffect(() => {
    if (isSuccess && nameBrand?.data?.data) {
      setFilteredBrands(nameBrand.data.data)
    }
  }, [isSuccess, nameBrand])

  // xử lí xem them
  const handleShowMore = () => {
    setVisibleBrands((prev) => {
      return prev + 5
    })
  }
  // xử lí check box
  const handleCheckboxChange = (e) => {
    let updateBrands
    setNameBrands((prev) => {
      if (e.target.checked) {
        // brands lấy trên url
        updateBrands = [...brands, e.target.value]
      } else {
        // Remove brand if unchecked
        updateBrands = brands.filter((brand) => {
          return brand !== e.target.value
        })
      }
      const searchParams = createSearchParams({
        ...useQueryParameter,
        'brands[]': updateBrands
      }).toString()
      navigate({
        pathname: `/category`,
        search: `?${searchParams}`
      })
      return updateBrands
    })
  }
  if (isLoading) return <Loading />
  return (
    <div className=''>
      <div className='px-24'>
        <div class='hidden bg-neutral-100 md:block  mb-4'>
          <div class='container '>
            <div>
              <ul class='flex items-center py-1.5 text-neutral-600'>
                <li class='h-5 text-sm'>
                  <span class='hover:text-neutral-800 mx-1 font-normal text-[12px] leading-5'>
                    <a href='/'>Trang chủ</a>
                  </span>
                  <span class='p-icon inline-flex align-[-0.125em] justify-center max-h-full max-w-full h-3 w-3 text-neutral-800'>
                    <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M17.2137 11.2862L8.21971 2.29524C7.82506 1.90159 7.18567 1.90159 6.79002 2.29524C6.39537 2.68889 6.39537 3.32829 6.79002 3.72194L15.0706 11.9995L6.79102 20.2771C6.39637 20.6707 6.39637 21.3101 6.79102 21.7048C7.18567 22.0984 7.82606 22.0984 8.22071 21.7048L17.2147 12.7139C17.6032 12.3243 17.6032 11.6749 17.2137 11.2862Z'
                        fill='currentColor'
                      ></path>
                    </svg>
                  </span>
                </li>

                <li class='h-5 text-sm'>
                  <span class='hover:text-neutral-800 mx-1 font-normal text-[12px] leading-5 text-neutral-900'>
                    <a href={`/category?category_name=${useQueryParameter?.category_name}`}>
                      {useQueryParameter?.category_name}
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='text-[24px] font-bold leading-[32px] flex-1 max-md:text-base max-md:font-semibold md:flex'>
          {categorySlug}
        </div>
        <div className='grid grid-cols-8'>
          {getCategorybyid?.data?.data.children &&
            getCategorybyid?.data?.data.children.map((element) => {
              return (
                <div className='flex flex-col items-center gap-y-2  w-[120px] h-[160px] p-2  mt-2 '>
                  <div className='w-[100px] h-[100px]' onClick={() => handleClickCategory(element.category_name)}>
                    <img
                      src={element.category_thumbnail}
                      alt='anh'
                      className='w-full h-full object-cover rounded-md border'
                    />
                  </div>
                  <p className='text-center text-sm font-medium text-gray-700'>{element.category_name}</p>
                </div>
              )
            })}
        </div>
      </div>
      <div className='px-24 grid grid-cols-12 gap-2 mt-5'>
        <div className='col-span-2 flex flex-col'>
          <div className='flex text-lg  py-4'>
            <p className=' font-semibold'>Bộ lọc tìm kiếm</p>
          </div>
          <div className='border border-l-1 opacity-65'></div>

          <div className=' '>
            <p className=' font-semibold mt-5'>Khoảng giá</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div class='relative flex-col mt-4'>
                <div class='relative flex mt-4 '>
                  <input
                    min='0'
                    className='w-full border text-neutral-900 rounded-lg focus:ring-neutral-500 focus:border-neutral-700 outline-none p-2.5 h-9 truncate border-neutral-700 text-base font-medium placeholder:text-neutral-700 md:text-sm pr-10'
                    placeholder='Tối thiểu'
                    type='text'
                    {...register('price_min')}
                  />

                  <span class='absolute right-0 flex h-full items-center px-3'>
                    <span class='text-base font-normal text-neutral-700 md:text-sm'>₫</span>
                  </span>
                </div>
                <p className='text-red-600 mt-1 text-sm'>{errors.price_min?.message}</p>
                <div class='relative flex mt-4 '>
                  <input
                    max='100000'
                    className='w-full border text-neutral-900 rounded-lg focus:ring-neutral-500 focus:border-neutral-700 outline-none p-2.5 h-9 truncate border-neutral-700 text-base font-medium placeholder:text-neutral-700 md:text-sm pr-10'
                    placeholder='Tối đa'
                    type='number'
                    {...register('price_max')}
                  />
                  <span class='absolute right-0 flex h-full items-center px-3'>
                    <span class='text-base font-normal text-neutral-700 md:text-sm'>₫</span>
                  </span>
                </div>
                <p className='text-red-600 mt-1 text-sm'>{errors.price_max?.message}</p>
              </div>

              <button
                data-size='sm'
                className='mt-4 relative justify-center outline-none font-semibold text-white bg-blue border-0 hover:bg-blue  text-sm px-4 py-2 h-9 items-center rounded-lg hidden md:block w-full'
                type='submit'
              >
                <span>Áp dụng</span>
              </button>
            </form>

            <div className='mt-5'>
              <input
                type='radio'
                name='price'
                value='1-100000'
                onChange={handleRadioChange}
                checked={isChecked('1', '100000')}
              />
              <label> Dưới 100.000 đ</label>
            </div>

            <div className='mt-5'>
              <input
                type='radio'
                name='price'
                value='100000-300000'
                onChange={handleRadioChange}
                checked={isChecked('100000', '300000')}
              />
              <label> 100.000 đ - 300.000 đ</label>
            </div>

            <div className='mt-5'>
              <input
                type='radio'
                name='price'
                value='300000-500000'
                onChange={handleRadioChange}
                checked={isChecked('300000', '500000')}
              />
              <label> 300.000 đ - 500.000 đ</label>
            </div>

            <div className='mt-5'>
              <input
                type='radio'
                name='price'
                value='500000-1000000'
                onChange={handleRadioChange}
                checked={isChecked('500000', '1000000')}
              />
              <label> Trên 500.000 đ</label>
            </div>
            <div className='mt-5  '>
              <div className='font-semibold'>Thương hiệu(1)</div>
              <div className='mt-4'>
                <input
                  type='text'
                  placeholder='Nhập tên thương hiệu'
                  className='p-2 h-9 rounded-lg outline-none border w-full border-neutral-700 text-neutral-900 text-sm font-medium placeholder:text-neutral-700'
                  onChange={handleChangeBrand}
                />
              </div>
              <div className='mt-4 mb-4 '>
                {filteredBrands.length > 0 ? (
                  filteredBrands.slice(0, visibleBrands).map((brand) => (
                    <div className='flex mt-2'>
                      <input
                        type='checkbox'
                        id={`${brand.brand_id}`}
                        name='brand[]'
                        value={brand.brand_name}
                        onChange={(e) => handleCheckboxChange(e)}
                        checked={NameBrands.includes(brand.brand_name)}
                      />

                      <label htmlFor={`${brand.brand_id}`} className='pl-2  truncate'>
                        {brand.brand_name}
                      </label>
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>

              {visibleBrands < filteredBrands.length && (
                <button className='text-[#0070E0] w-full text-center my-5' onClick={handleShowMore}>
                  Xem thêm
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='col-span-10 '>
          <div className='flex  px-3 pt-2  gap-x-2'>
            <p className='p-3 font-medium'>Sắp xếp theo: </p>
            <button
              className='p-3  border-2 rounded-lg text-[#787878] hover:text-black'
              onClick={() => handlePriceDes()}
            >
              Giảm giá dần{' '}
            </button>
            <button className='p-3  border-2 rounded-lg text-[#787878] hover:text-black' onClick={handlePriceAsc}>
              Giá tăng dần{' '}
            </button>
          </div>
          <div className='grid grid-cols-5 px-3 py-4 gap-3'>
            {productsData?.data?.data?.data &&
              productsData.data.data.data.map((element) => {
                return (
                  <div key={element.product_id} className='border border-1 shadow-lg rounded-lg overflow-hidden'>
                    <ProductCard
                      product_id={element.product_id}
                      image={element.product_images?.[0] || 'fallback-image-url.png'}
                      labelImage='https://prod-cdn.pharmacity.io/e-com/images/ecommerce/20240225082630-0-mua-1-tang-1.png'
                      title={element.product_name}
                      price={`${element.product_price}₫`}
                      oldPrice={element.product_discount !== '0.00' ? `${element.product_discount}₫` : null}
                      likes={element.likes || 0}
                      soldCount={element.product_sold}
                    />
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
