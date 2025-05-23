import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

import jeansImg from '../assets/jeans.jpg';
import tshirtsImg from '../assets/tshirts.jpg';
import shoesImg from '../assets/shoes.jpg';
import glassesImg from '../assets/glasses.png';
import jacketsImg from '../assets/jackets.jpg';
import suitsImg from '../assets/suits.jpg';
import bagsImg from '../assets/bags.jpg';

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: jeansImg },
  { href: "/t-shirts", name: "T-shirts", imageUrl: tshirtsImg },
  { href: "/shoes", name: "Shoes", imageUrl: shoesImg },
  { href: "/glasses", name: "Glasses", imageUrl: glassesImg },
  { href: "/jackets", name: "Jackets", imageUrl: jacketsImg },
  { href: "/suits", name: "Suits", imageUrl: suitsImg },
  { href: "/bags", name: "Bags", imageUrl: bagsImg },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
          explore our categories
        </h1>
        <p className='text-center text-xl text-gray-300 mb-12'>
          discover the latest trends in eco-friendly fashion
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center'>
          {categories.map((category, index) => (
            <div 
              key={category.name} 
              className={`${index === categories.length - 1 ? "lg:col-span-3 lg:col-start" : ""}`}
            >
              <CategoryItem category={category} />
            </div>
          ))}
        </div>

        {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
      </div>
    </div>
  );
};

export default HomePage;
