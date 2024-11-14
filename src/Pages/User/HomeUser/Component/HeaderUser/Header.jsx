import React from 'react'
import Nav from '../../../../../Component/Nav/Nav'
import Search from '../../SearchHeader/Search'
import banner from './banner medicine.png'
export default function Header() {
  return (
    <>
      <div className='bg-[#95efff] '>
        <img src={banner} alt='' className=' h-[50px] w-full px-24' />
      </div>
      <Search />
    </>
  )
}
