// src/components/News.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          'https://newsapi.org/v2/everything',
          {
            params: {
              q: 'agriculture',
              apiKey: 'ec148088559f4f5a9f152c449bec078f',
            },
          }
        );
        setArticles(response.data.articles.slice(0, 10));
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="text-center text-2xl mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-2xl mt-8">Error: {error.message}</div>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="container mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-700">News & Events</h1>
      <div className="mx-[-15px]">
        <Slider {...settings} className="mb-8">
          {articles.map((article) => (
            <div key={article.url} className="px-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
                {article.urlToImage && (
                  <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">{article.title}</h2>
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{article.description}</p>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-teal-200 text-white px-4 py-2 rounded hover:bg-teal-300 transition duration-300 text-center"                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default News;