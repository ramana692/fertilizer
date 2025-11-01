import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'paddy',
      name: 'Paddy - நெல்',
      nameEn: 'Paddy',
      nameTa: 'நெல்',
      image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
      description: 'Rice cultivation products'
    },
    {
      id: 'maize',
      name: 'Maize - மக்காச்சோளம்',
      nameEn: 'Maize',
      nameTa: 'மக்காச்சோளம்',
      image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400',
      description: 'Corn farming essentials'
    },
    {
      id: 'pulses',
      name: 'Pulses - பயிறுவகை பயிர்கள்',
      nameEn: 'Pulses',
      nameTa: 'பயிறுவகை பயிர்கள்',
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400',
      description: 'Lentils and legumes'
    },
    {
      id: 'horticulture',
      name: 'Horticultural Crops- Seedlings ...',
      nameEn: 'Horticultural Crops',
      nameTa: 'தோட்டக்கலை பயிர்கள்',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
      description: 'Garden and nursery products'
    },
    {
      id: 'cotton',
      name: 'Cotton - பருத்தி',
      nameEn: 'Cotton',
      nameTa: 'பருத்தி',
      image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
      description: 'Cotton farming supplies'
    },
    {
      id: 'sugarcane',
      name: 'Sugarcane - கரும்பு',
      nameEn: 'Sugarcane',
      nameTa: 'கரும்பு',
      image: 'https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?w=400',
      description: 'Sugarcane cultivation'
    },
    {
      id: 'wheat',
      name: 'Wheat - கோதுமை',
      nameEn: 'Wheat',
      nameTa: 'கோதுமை',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      description: 'Wheat farming products'
    },
    {
      id: 'groundnut',
      name: 'Groundnut - நிலக்கடலை',
      nameEn: 'Groundnut',
      nameTa: 'நிலக்கடலை',
      image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400',
      description: 'Peanut cultivation'
    }
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 rounded-full p-3">
                <FaLeaf className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-700">
                Should you have any inquiries, please do not hesitate to contact us at{' '}
                <span className="font-semibold text-blue-700">0422-6611527</span> between{' '}
                <span className="font-semibold">9:00 AM to 5:00 PM (Monday – Friday)</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Products Title */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-900">Shop Products</h1>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Category Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.nameEn}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=' + category.nameEn;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Category Info */}
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {category.nameEn}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{category.nameTa}</p>
                <p className="text-xs text-gray-500">{category.description}</p>
              </div>

              {/* Hover Effect */}
              <div className="px-4 pb-4">
                <div className="w-full py-2 bg-blue-600 text-white text-center rounded-md font-medium hover:bg-blue-700 transition-colors">
                  View Products
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
