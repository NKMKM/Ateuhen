import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';


export default function App() {
    const ImgArray = [
        'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR-X3gsXLUp3ciY-Z2ujQ6ejsrUtXlagHLUFAEYPQHYUG8dKTlF',
        'https://media.istockphoto.com/id/1060456922/photo/cheers-celebration-toast-with-pints-of-beer.jpg?s=612x612&w=0&k=20&c=GvLbeUOIfKJpel-dFke9Z3EQ26iSTLXidRSDjjws3LM=',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKUyypKIq9b3bP1iZ-jtNjO_pTCRMerc-njQ&s',
        'https://sun9-80.userapi.com/s/v1/ig2/06sEGeuEIJ--NpTEblYrAnWyTy1to7Lq-iC1zxhPWtlN0oLOi73DpHH_bmtu_0mZb5tARcWLm6S7VR6TCbC8lxxU.jpg?quality=96&as=32x23,48x35,72x52,108x78,160x116,240x173,360x260,480x347,540x390,640x462,720x520,900x650&from=bu&u=PfbAMdAuqzZ_1Lzq34pKA05ggrzrYb5iyQQEOKco_cU&cs=807x583',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtMqucy88XFodlf25k6T6Ew-ODASSPegvBZw&s'
    ];

    const TextHeaderArray = [
        'Connect with friends',
        'pivo',
        'Chipsi',
        'Play Valo',
        'Suck in dota'
    
    ];
    
    const TextParagraphArray = [
        'Connect, compete, and conquer the gaming world together.',
        'Drink pivo s kentami',
        'I chipsi tojhe',
        'Ruini lobby vsem',
        'Suck in dota'
    
    ];
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <>
        <div className="sm:w-full  md:w-[80%] h-[890px]  flex justify-center items-start relative overflow-hidden mt-5 md:pr-10 select-none">
            <Swiper
                loop={true}
                spaceBetween={30}
                centeredSlides={false}
                autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                }}
                pagination={{
                clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                className="mySwiper w-full h-[90%] relative" // Ограничиваем высоту и делаем контейнер относительно позиционированным
            >
                {ImgArray.map((element, index) => (
                <SwiperSlide key={index} className="relative">
                    <div className='w-full h-[65%]'>
                        <img
                        src={element}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg" // Изображение во всю ширину и высоту
                        />
                    </div>
                    
                    <div className="absolute bottom-30 left-0 w-full sm:px-10 md:px-0 text-white py-24">
                        <h3 className="text-2xl font-bold">{TextHeaderArray[index]}</h3>
                        <p className="text-lg">{TextParagraphArray[index]}</p>
                    </div>
                </SwiperSlide>
                ))}
                <div className="autoplay-progress  transform -translate-x-1/2">
                    <svg viewBox="0 0 48 48" ref={progressCircle}>
                        <circle cx="24" cy="24" r="20"></circle>
                    </svg>
                    <span ref={progressContent}></span>
                </div>
            </Swiper>
            

            
        </div>
    </>
  );
}
