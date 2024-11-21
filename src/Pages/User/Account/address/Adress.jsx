import React, { useState } from 'react'
import ModalComponent from '../../../../Component/Modal/Modal'
import { Modal } from 'antd'
import AddressForm from './component/createAddress/CreateAddress'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import AddressApi from '../../../../Api/user/address'
import UpdateAddress from './component/updateAddressRecieve/UpdateAddress'
export default function Adress() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['getAddress'],
    queryFn: AddressApi.getAddress_receive
  })

  console.log('Day la adress', data?.data?.data)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const svgElement = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='currentColor'
      className='size-6'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
      />
    </svg>
  )

  return (
    <div className='px-3 py-3 '>
      <div className=' flex items-center justify-between  border-b border-b-gray-300 pb-4'>
        <div className='text-xl text-[#333]  '>Số địa chỉ nhận hàng</div>
        <button
          onClick={showModal}
          className='text-[#1A51A2] rounded-lg px-3 py-2 border border-[#1A51A2]  flex items-center hover:opacity-75 hover:bg-gray-100'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            class='size-6'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
            />
          </svg>
          Thêm địa chỉ
        </button>
      </div>

      {data?.data?.data.map((element) => {
        {
          return (
            <>
              <div className='flex flex-col md:flex-row mt-3'>
                <div className='w-[80%]'>
                  <div className='my-2'>
                    <span className='font-bold'>{element.receiver_name}</span>
                    <span className='mx-2'>|</span>
                    <span>0865446276</span>
                  </div>
                  <div className='my-2'>{element.receiver_address}</div>
                  <span class='mt-2 rounded-sm px-1 py-[4px] text-xs font-medium text-[#CE4712] bg-[#FFE0C7]'>
                    Nhà riêng
                  </span>
                </div>
                <div className='w-[20%]  '>
                  <div className='flex flex-grow justify-end gap-x-5 items-center'>
                    <UpdateAddress queryClient={queryClient} receiver_address_id={element.receiver_address_id} />
                    <ModalComponent
                      svgElement={svgElement}
                      receiver_address_id={element.receiver_address_id}
                      queryClient={queryClient}
                    />
                  </div>
                </div>
              </div>
              <Modal title='Địa chỉ mới' open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <>
                  <AddressForm closeModal={() => setIsModalOpen(false)} queryClient={queryClient} />
                </>
              </Modal>
            </>
          )
        }
      })}
    </div>
  )
}
