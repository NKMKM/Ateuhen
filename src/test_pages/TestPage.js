import React from 'react'
import Nav from '../info_pages/page_components/Nav'
import { LuBox } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from 'react-router-dom';

const TestPage = () => {
  return (
    <>
        <Nav/>
        {/* мини навбар  */}
        <div className='border-b-2 flex flex-row justify-around'>
            
            
            {/* блок с инфо 1 */}
            <div className=' w-[376px] py-8'>
                <h1 className='font-semibold mb-4 text-glow-hover'>Player Stats</h1>
                {/* список ссылок или хз чо там  */}
                <ul className='flex flex-col space-y-[25px]'>
                    <li className='flex flex-row space-x-3'>
                        <div className='w-[24px] h-[24px] mt-0.5'><LuBox className='w-full h-full'/></div>
                        <div>
                            <h1 className='font-bold text-violet-hover'>Profile Info</h1>
                            <p>View your gaming achievements and level</p>
                        </div>
                    </li>

                    <li className='flex flex-row space-x-3'>
                        <div className='w-[24px] h-[24px] mt-0.5'><LuBox className='w-full h-full'/></div>
                        <div>
                            <h1 className='font-bol text-violet-hoverd'>Match History</h1>
                            <p>Check your past matches and performance</p>
                        </div>
                    </li>

                    <li className='flex flex-row space-x-3'>
                        <div className='w-[24px] h-[24px] mt-0.5'><LuBox className='w-full h-full'/></div>
                        <div>
                            <h1 className='font-bold text-violet-hover'>Game Settings</h1>
                            <p>Adjust your game preferences and controls</p>
                        </div>
                    </li>

                    <li className='flex flex-row space-x-3'>
                        <div className='w-[24px] h-[24px] mt-0.5'><LuBox className='w-full h-full'/></div>
                        <div>
                            <h1 className='font-bold text-violet-hover'>Community Hub</h1>
                            <p>Join discussions and connect with players</p>
                        </div>
                    </li>

                </ul>
            </div>
            
            {/* блок с инфо 2 */}
            <div className='w-[376px] py-8'>
                <h1 className='font-semibold mb-4 text-glow-hover'>Latest Articles</h1>
                {/* список ссылок или хз чо там  */}
                <ul className='flex flex-col space-y-[25px]'>
                    <li className='flex flex-row space-x-3'>
                        <div className='w-[24px] h-[24px] mt-0.5'><LuBox className='w-full h-full'/></div>
                        <div>
                            <h1 className='font-bold text-violet-hover'>Game Updates</h1>
                            <p>Stay informed about the latest game news</p>
                        </div>
                    </li>

                    <li className='flex flex-row space-x-3'>
                        <div className='w-[24px] h-[24px] mt-0.5'><LuBox className='w-full h-full'/></div>
                        <div>
                            <h1 className='font-bold text-violet-hover'>Pro Tips</h1>
                            <p>Learn strategies from top players and experts</p>
                        </div>
                    </li>

                    <li className='flex flex-row space-x-3'>
                        <div className='w-[24px] h-[24px] mt-0.5'><LuBox className='w-full h-full'/></div>
                        <div>
                            <h1 className='font-bold text-violet-hover'>Event Calendar</h1>
                            <p>Don't miss out on upcoming tournaments</p>
                        </div>
                    </li>

                    <li className='flex flex-row space-x-3'>
                        <div className='w-[24px] h-[24px] mt-0.5'><LuBox className='w-full h-full'/></div>
                        <div>
                            <h1 className='font-bold text-violet-hover'>Game Guides</h1>
                            <p>Find helpful guides for your favorite games</p>
                        </div>
                    </li>

                </ul>
            </div>




            {/* блок с инфо 3 */}
            <div className=' w-[560px] h-[400px] p-[32px] flex flex-col space-y-5'>
                <h1 className='font-semibold mb-4 text-glow-hover'>From Our Blog</h1>
                
                {/* блок с постами  */}
                <ul className='flex flex-col space-y-[20px]' >
                    <li>
                        <div className='flex flex-row space-x-6'>
                            {/* картинка */}
                            <div className='bg-gray-400 w-[160px] h-[105px]'></div>
                            {/* текст */}
                            <div className='flex flex-col space-y-2'>
                                <h1 className='font-bold text-violet-hover'>Top Strategies</h1>
                                <p>Explore the best strategies for winning</p>
                                <Link className='underline'>Read more</Link>
                            </div>

                        </div>
                    </li>

                    <li>
                        <div className='flex flex-row space-x-6'>
                            {/* картинка */}
                            <div className='bg-gray-400 w-[160px] h-[105px]'></div>
                            {/* текст */}
                            <div className='flex flex-col space-y-2'>
                                <h1 className='font-bold text-violet-hover'>Game Reviews</h1>
                                <p>See what others are saying about games</p>
                                <Link className='underline'>Read more</Link>
                            </div>

                        </div>
                    </li>
                </ul>

                <button className='flex flex-row items-center font-bold '>Button <MdKeyboardArrowRight className="flex justify-center" /></button>
            </div>

        </div>


    </>
  )
}

export default TestPage


                                         