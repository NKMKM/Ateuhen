import React, { useState, useEffect, useRef } from 'react';

const CustomScrollbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollbarHeight, setScrollbarHeight] = useState(0);
  const [scrollableHeight, setScrollableHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollbarRef = useRef(null);
  const containerRef = useRef(null);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setScrollY(scrollTop);
  };

  const handleResize = () => {
    setScrollbarHeight(window.innerHeight); // Высота экрана
    setScrollableHeight(document.documentElement.scrollHeight - window.innerHeight); // Высота всей страницы для прокрутки
  };

  const startDragging = (e) => {
    setIsDragging(true);
    document.body.style.cursor = 'grabbing'; // Меняем курсор на "граб"
    document.body.style.userSelect = 'none'; // Отключаем выделение текста
  };

  const stopDragging = () => {
    setIsDragging(false);
    document.body.style.cursor = 'default'; // Возвращаем курсор в обычное состояние
    document.body.style.userSelect = ''; // Восстанавливаем нормальное выделение текста
  };

  const handleDragging = (e) => {
    if (isDragging) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollbarHeight = scrollbarRef.current.getBoundingClientRect().height;
      const offset = e.clientY - containerRect.top - scrollbarHeight / 2;
      const scrollPercentage = offset / containerRect.height;
      window.scrollTo(0, scrollPercentage * scrollableHeight);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize(); // Инициализация размеров при загрузке страницы

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollableHeight]);

  useEffect(() => {
    // Если пользователь прокручивает страницу, обновляем положение полосы
    const scrollPercentage = scrollY / scrollableHeight * 100;
    if (scrollbarRef.current) {
      scrollbarRef.current.style.top = `${scrollPercentage}%`;
    }
  }, [scrollY, scrollableHeight]);

  useEffect(() => {
    if (isDragging) {
      // Добавляем обработчик события для движения мыши по всему документу
      document.addEventListener('mousemove', handleDragging);
      document.addEventListener('mouseup', stopDragging);

      return () => {
        document.removeEventListener('mousemove', handleDragging);
        document.removeEventListener('mouseup', stopDragging);
      };
    }
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        marginRight: '4px',
        top: 0,
        right: 0,
        width: '10px',
        height: '100vh',
        backgroundColor: 'black',
        borderRadius: '5px',
        zIndex: '1000',
        cursor: 'pointer',
      }}
    >
      <div
        ref={scrollbarRef}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '150px', // Высота полосы прокрутки, можно менять
          backgroundColor: '#8A3CFA',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onMouseDown={startDragging}
      />
    </div>
  );
};

export default CustomScrollbar;
