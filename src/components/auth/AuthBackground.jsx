import React, { useEffect, useState } from 'react';

const backgroundImages = [
    "https://bbscdn.df.nexon.com/data6/commu/202505/00210f10-3966-c53e-0c60-cd91b3c56849.jpg",
    "https://bbscdn.df.nexon.com/data6/commu/202503/4e69fb20-bdf0-3a1a-c342-278d6ebe6818.jpg",
    "https://bbscdn.df.nexon.com/data6/commu/202503/c4ad2703-1a4d-7cf3-d3fb-3ca029acf49d.jpg",
    "https://bbscdn.df.nexon.com/data6/commu/202502/107a8ddf-5cfd-89a6-8023-e487c982ce91.jpg",
    "https://bbscdn.df.nexon.com/data6/commu/202503/8ae43487-ce7c-1e40-21bc-7fdb1e3fb21b.jpg",
    "https://bbscdn.df.nexon.com/data6/commu/202503/597e2b67-43b0-e701-4dca-0b81e5fab2c2.jpg",
    "https://bbscdn.df.nexon.com/data6/commu/202505/9582d1af-4eeb-be68-4415-211986b1e30a.jpg",
    "https://bbscdn.df.nexon.com/data6/commu/202505/87fb4e5f-49e3-1812-06b4-7d36f3707378.jpg",
    "https://bbscdn.df.nexon.com/data6/commu/202505/354bf7ab-fed4-5e11-b095-f6b56f575d0b.jpg",
    "https://bbscdn.df.nexon.com/data6/commu/202505/b371c36b-924c-c14a-98a1-c786926439ef.jpg",
    "https://bbscdn.df.nexon.com/data6/commu/202505/947c69da-0177-1427-2d20-fb5999bb1aed.jpg"
];

const IMAGE_CHANGE_INTERVAL = 30000; // 30초마다 이미지 변경

export default function AuthBackground({ className }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) => 
                    prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
                );
                setIsTransitioning(false);
            }, 500);
        }, IMAGE_CHANGE_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    // 기본 클래스와 전달받은 className을 병합
    const combinedClassName = `relative flex-1 hidden lg:block overflow-hidden rounded-l-3xl ${className || ''}`.trim();

    return (
        <div className={combinedClassName}>
            <div className="relative w-full h-full">
                {backgroundImages.map((image, index) => (
                    <img
                        key={image}
                        src={image}
                        alt={`auth-bg-${index}`}
                        className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ${
                            index === currentImageIndex
                                ? 'translate-x-0'
                                : index < currentImageIndex
                                ? '-translate-x-full'
                                : 'translate-x-full'
                        }`}
                    />
                ))}
            </div>
            <div className="absolute inset-0 bg-black/10" />
        </div>
    );
} 