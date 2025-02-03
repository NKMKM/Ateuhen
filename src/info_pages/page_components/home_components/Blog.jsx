import React from 'react'
import { GoDotFill } from "react-icons/go";

const Blog = () => {
  return (
    <div>

        {/* блок с текстом */}
        <div className='flex flex-col justify-between items-center w-[770px] mx-auto h-[150px]'>
            <p className='font-bold text-s cursor-pointer text-glow-hover'>Blog</p>
            <h1 className='font-bold text-5xl'>Latest Gaming Insights</h1>
            <p>Stay updated with the latest in gaming.</p>
        </div>

        {/* блок с карточками */}
        <div className='h-[600px] w-[1320px] flex flex-row space-x-10 mx-auto my-20 '>
            {/* карточка */}
            <div className='w-1/3 scale-hover rounded-md custom-shadow'>
                
                <div className='bg-orange-300 w-full h-1/2 rounded-t-md'><img></img></div>
                {/* вторая половина карточки */}
                <div className='flex flex-col space-y-4 p-4'>
                <p className='font-bold'>News</p>
                <h1 className='text-3xl font-bold'>Top Strategies for Winning in Valorant</h1>
                <p>Discover essential tips to elevate your gameplay and dominate the competition.</p>

                {/* блок с отражением пользователя и данных о посте */}
                <div className='flex flex-row w-[368px]'>
                    <div className='bg-violet-400 w-[50px] h-[50px] rounded-full mr-6'><img></img></div>

                    <div className=''>
                    <a className='cursor-pointer hover:underline'>Gaechka</a>
                    <div className='flex items-center space-x-3'>
                        <p>11 Jan 2022</p>
                        <div className='w-[10px] h-[10px]'><GoDotFill className='w-full h-full'/></div>
                        <p>5 min ago</p>
                    </div>
                    </div>
                </div>

                </div>

            </div>

            {/* карточка  2*/}
            <div className='w-1/3 scale-hover rounded-md custom-shadow'>
                
                <div className='bg-orange-300 w-full h-1/2 rounded-t-md'><img></img></div>
                {/* вторая половина карточки */}
                <div className='flex flex-col space-y-4 p-4'>
                <p className='font-bold'>Tips</p>
                <h1 className='text-3xl font-bold'>Essential Gear for Competitive Gamers</h1>
                <p>Learn about the must-have equipment for serious gamers.</p>

                {/* блок с отражением пользователя и данных о посте */}
                <div className='flex flex-row w-[368px]'>
                    <div className='bg-violet-400 w-[50px] h-[50px] rounded-full mr-6'><img></img></div>

                    <div className=''>
                    <a className='cursor-pointer hover:underline'>nokim</a>
                    <div className='flex items-center space-x-3'>
                        <p>11 Jan 2022</p>
                        <div className='w-[10px] h-[10px]'><GoDotFill className='w-full h-full'/></div>
                        <p>5 min ago</p>
                    </div>
                    </div>
                </div>

                </div>

            </div>

            {/* карточка  3*/}
            <div className='w-1/3 scale-hover rounded-md custom-shadow'>
                
                <div className='bg-orange-300 w-full h-1/2 rounded-t-md'><img></img></div>
                {/* вторая половина карточки */}
                <div className='flex flex-col space-y-4 p-4'>
                <p className='font-bold'>Community</p>
                <h1 className='text-3xl font-bold'>Upcoming Tournaments You Can't Miss</h1>
                <p>Join exciting tournaments and showcase your skills against the best players.</p>

                {/* блок с отражением пользователя и данных о посте */}
                <div className='flex flex-row w-[368px]'>
                    <div className='bg-violet-400 w-[50px] h-[50px] rounded-full mr-6'><img></img></div>

                    <div className=''>
                    <a className='cursor-pointer hover:underline'>Marmok</a>
                    <div className='flex items-center space-x-3'>
                        <p>11 Jan 2022</p>
                        <div className='w-[10px] h-[10px]'><GoDotFill className='w-full h-full'/></div>
                        <p>5 min ago</p>
                    </div>
                    </div>
                </div>

                </div>

            </div>
            

        </div>
        {/* кнопка */}
        <div className='mx-auto w-[110px] my-10'>
            <button className='h-[50px] w-[105px] border-2  scale-hover rounded-md'>View All</button>
        </div>


    </div>
  )
}

export default Blog