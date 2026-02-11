'use client';

import { useState } from 'react';

interface RetrospectiveFilterProps {
    onCategoryChange: (category: string | null) => void;
    onSearchChange: (search: string) => void;
}

const categories = [
    { id: 'keep', label: '유지', color: 'bg-green-100 text-green-800' },
    { id: 'stop', label: '중단', color: 'bg-red-100 text-red-800' },
    { id: 'start', label: '시작', color: 'bg-blue-100 text-blue-800' },
    { id: 'improve', label: '개선', color: 'bg-yellow-100 text-yellow-800' },
];

export default function RetrospectiveFilter({
    onCategoryChange,
    onSearchChange,
}: RetrospectiveFilterProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCategoryClick = (categoryId: string) => {
        const newCategory = activeCategory === categoryId ? null : categoryId;
        setActiveCategory(newCategory);
        onCategoryChange(newCategory);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearchChange(value);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    카테고리 필터
                </label>
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${activeCategory === category.id
                                    ? category.color
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    검색
                </label>
                <input
                    type="text"
                    placeholder="제목, 태그로 검색..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
}
