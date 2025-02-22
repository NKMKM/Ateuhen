import React from 'react'
import Nav from './page_components/Nav'
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link } from 'react-router-dom';

const TestPage = () => {
  return (
    <>
        <Nav/>
        
        {/* гланвый контейнер страницы */}
        <div className='flex flex-col space-y-10 py-10'>
            {/* 1ый контейнер с текстом  */}
            <div className='w-full  flex flex-col items-center space-y-10 mx-auto'>
                <p className='font-bold cursor-pointer text-glow-hover'>Meet</p>
                <h1 className='m-0 text-7xl font-bold text-center text-[#8A3CFA]'>Our Team</h1>
                <p className='text-center text-md'>Dedicated professionals committed to your gaming expirience </p>
            </div>

            {/* второй контейнер с иконками создателей */}
            <div className=' flex flex-row space-x-20 justify-center '>
                
                {/* контейнер с создателем 1 */}
                <div className=' w-[400px] h-[500px] flex flex-col items-center text-center p-4 scale-hover'>
                    <div className=' w-[120px] h-[120px] rounded-full bg-fuchsia-300 mb-1'><img></img></div>
                    {/* контейнер с текстом  */}
                    <div className='flex flex-col  h-[70%] space-y-10 justify-center'>
                        <div className='flex flex-col space-y-0.5'>
                            <h1 className='font-bold text-3xl hover:text-[#8A3CFA] transition duration-500'>Artem Matenco</h1>
                            <h3 className='text-glow-hover'>Project creator</h3>
                        </div>

                        <p>Artem have been creator of idea and assembled our team to make this project. Also he was writing backend part of our site </p>
                        
                        <div className=' h-fit flex flex-row space-x-10 justify-center'>
                            <a href="https://www.instagram.com/n0ks1_/" className='scale-150  '><InstagramIcon className='scale-125 '/></a>
                            <a className='scale-150'><TelegramIcon className='scale-125'/></a>
                            <a href='https://github.com/NKMKM' className='scale-150'><GitHubIcon className='scale-125'/></a>
                        </div>

                    </div>
                </div>

                 
                {/* контейнер с создателем 2 */}
                <div className=' w-[400px] h-[500px] flex flex-col items-center text-center p-4 scale-hover'>
                    <div className=' w-[120px] h-[120px] rounded-full bg-fuchsia-300 mb-1'><img></img></div>
                    {/* контейнер с текстом  */}
                    <div className='flex flex-col  h-[70%] space-y-10 justify-center'>
                        <div className='flex flex-col space-y-0.5'>
                            <h1 className='font-bold text-3xl hover:text-[#8A3CFA] transition duration-500'>Danila Barinov</h1>
                            <h3 className='text-glow-hover'>Project designer</h3>
                        </div>

                        <p>Danila have created all design of this project, working with frontend developers</p>
                        
                        <div className=' h-fit flex flex-row space-x-10 justify-center'>
                            <a href="https://www.instagram.com/danila_barinow/" className='scale-150  '><InstagramIcon className='scale-125 '/></a>
                            <a className='scale-150'><TelegramIcon className='scale-125'/></a>
                            <a href='' className='scale-150'><GitHubIcon className='scale-125'/></a>
                        </div>

                    </div>
                </div>

                 
                {/* контейнер с создателем 3 */}
                <div className=' w-[400px] h-[500px] flex flex-col items-center text-center p-4 scale-hover'>
                    <div className=' w-[120px] h-[120px] rounded-full bg-fuchsia-300 mb-1'><img></img></div>
                    {/* контейнер с текстом  */}
                    <div className='flex flex-col  h-[70%] space-y-10 justify-center'>
                        <div className='flex flex-col space-y-0.5'>
                            <h1 className='font-bold text-3xl hover:text-[#8A3CFA] transition duration-500'>Alex Rojcov</h1>
                            <h3 className='text-glow-hover'>Web designer</h3>
                        </div>

                        <p>Alex have been working in duo with Danila making visual part of our project. He is front end developer of the site</p>
                        
                        <div className=' h-fit flex flex-row space-x-10 justify-center'>
                            <a href="https://www.instagram.com/sourswitchbladeee/" className='scale-150  '><InstagramIcon className='scale-125 '/></a>
                            <a className='scale-150'><TelegramIcon className='scale-125'/></a>
                            <a href='https://github.com/slizis228' className='scale-150'><GitHubIcon className='scale-125'/></a>
                        </div>

                    </div>
                </div>


            </div>

            {/* 3ий контенер с текстом и кнопкой */}
            <div className=' flex flex-col text-center space-y-7'>
                <h1 className='font-bold text-4xl text-glow-hover'>We're hiring!</h1>
                <p>Join our passionate team and make an impact.</p>
                <Link className='flex w-[150px] h-[50px] border-2 self-center items-center justify-center scale-hover'>Open Positions</Link>
            </div>

            
        </div>



    </>
  )
}

export default TestPage