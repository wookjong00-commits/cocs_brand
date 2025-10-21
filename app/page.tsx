'use client';

import React, { useState, useEffect } from 'react';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());

  const instagramImages = Array(12).fill('/api/placeholder/400/400');
  const productImages = Array(8).fill('/api/placeholder/400/500');

  // Auto-slide for product carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [productImages.length]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-light tracking-wider">COCS</div>
          <div className="flex items-center gap-8">
            <button className="text-sm hover:opacity-60 transition-opacity">Cart</button>
            <button className="text-sm hover:opacity-60 transition-opacity">Login</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/api/placeholder/1920/1080')`,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-relaxed mb-8 animate-fade-in">
            COCS
          </h1>
          <p className="text-lg md:text-xl font-light leading-relaxed opacity-90 animate-fade-in-delay">
            Rather than simply designing products,<br />
            we make about designing the space itself that provides<br />
            warmth and comfort just by placing COCS&apos;s product.
          </p>
        </div>
      </section>

      {/* Product Carousel Section */}
      <section
        id="collection"
        data-animate
        className={`py-20 px-6 bg-gray-50 transition-all duration-1000 ${
          visibleSections.has('collection') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-16">Our Collection</h2>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
            >
              {productImages.map((img, idx) => (
                <div
                  key={idx}
                  className="min-w-[33.333%] px-3"
                >
                  <div className="group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                    <img
                      src={img}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {productImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'w-8 bg-black' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section
        id="instagram"
        data-animate
        className={`py-20 px-6 transition-all duration-1000 ${
          visibleSections.has('instagram') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-4">@COCS_OFFICIAL</h2>
            <p className="text-gray-600 text-lg">
              Follow COCS as we create special moments together.
            </p>
          </div>

          {/* Event Banner */}
          <div className="mb-12 p-8 bg-gray-100 rounded-lg">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wider text-gray-500">POP UP</p>
              <p className="text-xl font-light">THE HYUNDAI SEOUL</p>
              <p className="text-gray-600">6F, 여의도, 4F COEX 삼성점</p>
              <p className="text-gray-600 mt-4">date. 12.24 THU - 01.06 THU</p>
              <p className="text-gray-500 text-sm mt-4">
                @_cocs 전 제품 구매시 포장 시 보관 가능한 박스 증정
              </p>
            </div>
          </div>

          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instagramImages.map((img, idx) => (
              <div
                key={idx}
                className={`aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-all duration-500 ${
                  visibleSections.has('instagram')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <img
                  src={img}
                  alt={`Instagram ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-light mb-4">COCS</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Creating warmth and comfort<br />
                through thoughtful design
              </p>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">
                Email: hello@cocs.com<br />
                Instagram: @cocs_official
              </p>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-4">Shop</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lamps</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ceramics</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2024 COCS. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s backwards;
        }
      `}</style>
    </div>
  );
}
