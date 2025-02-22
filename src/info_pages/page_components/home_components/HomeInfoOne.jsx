import { React, useEffect, useState, useRef} from 'react'
import { LuBox } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from 'react-router-dom';


const HomeInfoOne = () => {
    const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
<div
      ref={ref}
      className={`opacity-0 translate-y-10 transition-all duration-700 ease-out ${
        isVisible ? "animate-fadeInUp opacity-100 translate-y-0" : ""
      } flex flex-col items-center`}
    >        
    {/* контейнер с текстом */}
        <div className='flex flex-col items-center m-10 w-[770px]'>
            <p className='font-bold text-s cursor-pointer text-glow-hover'>Join</p>
            <h1 className='text-5xl font-bold text-center m-5 text-[#8A3CFA]'>Experience Competitive Gaming Like Never Before</h1>
            <p className='text-center'>At Ateuhen, we provide a unique ELO-based ranking system that matches players of similar skill levels. This ensures fair competition and a thrilling gaming experience for everyone.</p>
        </div>
    {/* //контейнер с карточками  */}
        <div className='flex flex-row justify-around mt-32 mb-32'>
        {/* блок 1 с коробкой и текстом */}
        <div className='w-1/3 flex flex-col items-center scale-hover group '>
            <div className='w-[50px] h-[50px]'><LuBox className='w-full h-full'/></div>
            <h1 className='text-3xl font-bold text-center m-8 text-glow-hover'>Understanding Our Tournament and League Structure</h1>
            <p className='text-center text-lg'>Join free and paid tournaments to compete for exciting prizes.</p>
        </div>


        {/* блок 2 с коробкой и текстом */}
        <div className='w-1/3 flex flex-col items-center scale-hover '>
            <div className='w-[50px] h-[50px]'><LuBox className='w-full h-full'/></div>
            <h1 className='text-3xl font-bold text-center m-8 text-glow-hover'>How to Easily Join Matches</h1>
            <p className='text-center text-lg'>Simply create an account and start competing today!</p>
        </div>

        {/* блок 3 с коробкой и текстом */}
        <div className='w-1/3 flex flex-col items-center scale-hover'>
            <div className='w-[50px] h-[50px]'><LuBox className='w-full h-full'/></div>
            <h1 className='text-3xl font-bold text-center m-8 text-glow-hover'>Get Ready to Level Up Your Game</h1>
            <p className='text-center text-lg'>Sign up now and join the action!</p>
        </div>

        </div>
    {/* //контейнер с кнопками */}
        <div className="flex flex-row justify-between w-[250px] mb-20">
            <button className="w-[130px] h-[50px] border-2 border-white rounded-lg button-violet-hover">
                Learn More
            </button>
            <div className="flex flex-row">
                <button className="flex items-center  rounded-lg px-4 py-2 group scale-hover">
                <Link to="/login"><span>Sign in</span></Link>
                <MdKeyboardArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2" />
                </button>
            </div>
        </div>

    </div>
  
  
  
  )
}

export default HomeInfoOne