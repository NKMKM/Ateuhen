import React from 'react'

const GrayPartHome = () => {
  return (
    <div className='w-full h-[480px] bg-gray-600 mb-20 p-7 flex items-center'>
        <div className='w-[50%] h-[90%]  z-10 flex flex-col justify-around p-5 '>
            <h1 className='font-bold text-6xl'>Join the Competitive Gaming Revolution</h1>
            <p className='text-2xl font-thin'>Sign up now and compete against players of all skill levels for exciting prizes! </p>
            <div className='w-[230px] flex flex-row justify-between'>
                <button className='bg-[#666666] w-[80px] h-[50px] border-2 border-white rounded-xl scale-hover'>Join</button>
                <button className='w-[130px] h-[50px] border-2 border-white rounded-xl scale-hover'>Learn more</button>
            </div>
        </div>
    </div>
  )
}

export default GrayPartHome