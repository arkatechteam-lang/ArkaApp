import React from 'react';
import { ArrowLeft, Construction } from 'lucide-react';
import { AdminScreen } from '../../AdminApp';

interface PlaceholderScreenProps {
  title: string;
  description: string;
  onNavigate: (screen: AdminScreen) => void;
}

export function PlaceholderScreen({ title, description, onNavigate }: PlaceholderScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-12 flex flex-col items-center justify-center text-center">
          <Construction className="w-24 h-24 text-blue-600 mb-6" />
          <h2 className="text-gray-900 mb-3">Screen Under Development</h2>
          <p className="text-gray-600 max-w-md">
            This screen is being built according to the business requirements. 
            The functionality will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
