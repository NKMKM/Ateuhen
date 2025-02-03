import React from 'react'
import { IoIosCheckmarkCircle } from "react-icons/io";


const Premium = () => {
  return (
    <>
        <div className='relative flex flex-col items-center'>
            
            <h1 className='absolute top-0 text-center text-[14em] font-bold -z-10'>Pricing</h1>
            

            {/* блок с карточками тарифов */}
            <div className='flex bottom-0 flex-row space-x-7 w-[85%] mx-auto  my-48 z-20 '>

                {/* карточка с тарифом 1 */}
                <div className='bg-white/10 rounded-lg h-[700px] w-1/3 flex flex-col lift-on-hover backdrop-blur-lg '>
                    
                    <div className='p-6'>
                        <p>Free Plan</p>
                        <h1 className='font-bold text-6xl my-4'>Free</h1>

                    </div>
                    {/* полоска */}
                    <div className='bg-white w-full h-[1px] my-'></div>
                    

                    <div className='p-6 my-7'>
                        <ul className='flex flex-col space-y-6'>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good free stuff</li>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good free stuff</li>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good free stuff</li>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good free stuff</li>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good free stuff</li>


                        </ul>

                    </div>

                    <button className='w-[90%] h-[50px] mt-10 border-2 border-white rounded-lg mx-auto scale-hover hover:bg-white hover:text-black hover:font-bold'>Get Started</button>

                </div>

                {/* карточка с тарифом 2 */}
                <div className='bg-white/10 rounded-lg h-[700px] w-1/3 flex flex-col lift-on-hover backdrop-blur-lg'>
                    <div className='p-6'>
                        <p>Standart Plan</p>
                        <h1 className='font-bold text-6xl my-4'>&euro; 9.99/m</h1>

                    </div>
                    {/* полоска */}
                    <div className='bg-white w-full h-[1px] my-'></div>
                    

                    <div className='p-6 my-7'>
                        <ul className='flex flex-col space-y-6'>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good standart stuff</li>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good standart stuff</li>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good standart stuff</li>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good standart stuff</li>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good standart stuff</li>


                        </ul>

                    </div>

                    <button className='w-[90%] h-[50px] mt-10 border-2 border-white rounded-lg mx-auto scale-hover hover:bg-white hover:text-black hover:font-bold'>Get Started</button>

                </div>

                {/* карточка с тарифом 3 */}
                <div className='bg-white/10 rounded-lg h-[700px] w-1/3 flex flex-col lift-on-hover backdrop-blur-lg'>
                    <div className='p-6'>
                        <p>Ahuenii Plan</p>
                        <h1 className='font-bold text-6xl my-4'>&euro; 29.9/m</h1>

                    </div>
                    {/* полоска */}
                    <div className='bg-white w-full h-[1px] my-'></div>
                    

                    <div className='p-6 my-7'>
                        <ul className='flex flex-col space-y-6'>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good rich stuff</li>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good rich stuff</li>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good rich stuff</li>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good rich stuff</li>
                            <li className='flex flex-row items-center text-lg'><div className='inline-block w-[40px] h-[40px] mr-6'><IoIosCheckmarkCircle className='w-full h-full' /></div>Good rich stuff</li>


                        </ul>

                    </div>

                    <button className='w-[90%] h-[50px] mt-10 border-2 border-white rounded-lg mx-auto scale-hover hover:bg-white hover:text-black hover:font-bold'>Get Started</button>

                </div>

            </div>

        </div>

       


    
    </>
  )
}

export default Premium