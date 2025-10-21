'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'hero' | 'products'>('hero');
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');
  const [currentHeroImage, setCurrentHeroImage] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: null as File | null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadProducts();
    loadHeroImage();
  }, [router]);

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('제품 로딩 실패:', error);
    }
  };

  const loadHeroImage = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setCurrentHeroImage(data.heroImage || '');
      }
    } catch (error) {
      console.error('표지사진 로딩 실패:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImage(file);
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  const handleHeroImageUpload = async () => {
    if (!heroImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', heroImage);
    formData.append('type', 'hero');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentHeroImage(data.url);
        setHeroImage(null);
        setHeroImagePreview('');
        alert('표지사진이 업로드되었습니다.');
      } else {
        alert('업로드에 실패했습니다.');
      }
    } catch (error) {
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', newProduct.image);
    formData.append('type', 'product');

    try {
      // 이미지 업로드
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        alert('이미지 업로드에 실패했습니다.');
        return;
      }

      const uploadData = await uploadRes.json();

      // 제품 추가
      const productRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: newProduct.price,
          image: uploadData.url,
        }),
      });

      if (productRes.ok) {
        alert('제품이 추가되었습니다.');
        setNewProduct({ name: '', price: '', image: null });
        loadProducts();
      } else {
        alert('제품 추가에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('제품이 삭제되었습니다.');
        loadProducts();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-wider">COCS 관리자</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('hero')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'hero'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            표지사진 관리
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'products'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            제품 관리
          </button>
        </div>

        {/* Hero Image Tab */}
        {activeTab === 'hero' && (
          <div className="mt-8 bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-medium mb-6">표지사진 업로드</h2>

            {currentHeroImage && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">현재 표지사진:</p>
                <img
                  src={currentHeroImage}
                  alt="Current Hero"
                  className="w-full max-w-2xl h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  새 표지사진 선택
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
                />
              </div>

              {heroImagePreview && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">미리보기:</p>
                  <img
                    src={heroImagePreview}
                    alt="Preview"
                    className="w-full max-w-2xl h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <button
                onClick={handleHeroImageUpload}
                disabled={!heroImage || loading}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? '업로드 중...' : '표지사진 업로드'}
              </button>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="mt-8 space-y-8">
            {/* Add Product Form */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-medium mb-6">제품 추가</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제품명
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    가격
                  </label>
                  <input
                    type="text"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="예: 89,000원"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제품 이미지
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? '추가 중...' : '제품 추가'}
                </button>
              </form>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-medium mb-6">등록된 제품</h2>
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">등록된 제품이 없습니다.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{product.name}</h3>
                        <p className="text-gray-600 mb-3">{product.price}</p>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
