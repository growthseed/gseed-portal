import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Briefcase, Filter, X, UserPlus, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { professionalService } from '@/services/professionalService';
import { FilterSidebar } from '@/components/layout/FilterSidebar';
import type { Profile } from '@/types/database.types';

interface Filters {
  search: string;
  profession?: string;
  skills?: string[];
  location?: string;
  minRate?: number;
  maxRate?: number;
  minRating?: number;
  isAvailable?: boolean;
  isAsdrm?: boolean;
}

export function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
  });
  const [showFilters] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Load professionals with useCallback for memoization
  const loadProfessionals = useCallback(async () => {
    console.log('[ProfessionalsPage] 🔄 Loading professionals...');
    setLoading(true);
    setError(null);
    
    try {
      const result = await professionalService.getAll({
        search: filters.search || undefined,
        skills: filters.skills || undefined,
        location: filters.location || undefined,
        min_rate: filters.minRate || undefined,
        max_rate: filters.maxRate || undefined,
        min_rating: filters.minRating || undefined,
        is_available: filters.isAvailable,
        is_asdrm_member: filters.isAsdrm,
      });
      
      if (result.success && result.data) {
        console.log('[ProfessionalsPage] ✅ Professionals loaded:', result.data.length);
        setProfessionals(result.data);
      } else {
        console.error('[ProfessionalsPage] ❌ Error loading:', result.message);
        setError(result.message || 'Error loading professionals');
      }
    } catch (err: any) {
      console.error('[ProfessionalsPage] 💥 Fatal error:', err);
      setError(err.message || 'Error loading professionals');
    } finally {
      setLoading(false);
    }
  }, [
    filters.search,
    filters.skills,
    filters.location,
    filters.minRate,
    filters.maxRate,
    filters.minRating,
    filters.isAvailable,
    filters.isAsdrm
  ]);

  // Load professionals only when filters change
  useEffect(() => {
    console.log('[ProfessionalsPage] 📍 Filters changed, reloading...');
    loadProfessionals();
  }, [loadProfessionals]);

  const clearFilters = useCallback(() => {
    setFilters({ search: '' });
  }, []);

  const activeFiltersCount = useMemo(() => 
    (filters.profession ? 1 : 0) +
    (filters.skills && filters.skills.length > 0 ? filters.skills.length : 0) +
    (filters.location ? 1 : 0) +
    (filters.minRate ? 1 : 0) +
    (filters.maxRate ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.isAvailable ? 1 : 0),
    [filters]
  );

  const formatCurrency = (value?: number) => {
    if (!value) return 'To be discussed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        filters={filters}
        onFiltersChange={setFilters}
        type="professionals"
      />
      
      {/* Main Content */}
      <div className="flex-1">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Professionals
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {professionals.length} {professionals.length === 1 ? 'professional found' : 'professionals found'}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search by name, skills or location..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 h-12"
              />
            </div>
            
            {/* Filter Button - Mobile */}
            <Button
              variant={showSidebar ? 'default' : 'outline'}
              onClick={() => setShowSidebar(!showSidebar)}
              className="h-12 relative lg:hidden"
            >
              <SlidersHorizontal size={20} className="mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            
            {/* Desktop Button to Toggle Sidebar */}
            <Button
              variant="outline"
              onClick={() => setShowSidebar(!showSidebar)}
              className="h-12 hidden lg:flex"
            >
              <SlidersHorizontal size={20} className="mr-2" />
              {showSidebar ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Advanced Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                  >
                    <X size={16} className="mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="text"
                      placeholder="City or State"
                      value={filters.location || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        location: e.target.value || undefined 
                      }))}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Min Rate/Hour */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Rate/Hour
                  </label>
                  <Input
                    type="number"
                    placeholder="$ 0"
                    value={filters.minRate || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      minRate: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                  />
                </div>

                {/* Max Rate/Hour */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Rate/Hour
                  </label>
                  <Input
                    type="number"
                    placeholder="No limit"
                    value={filters.maxRate || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      maxRate: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                  />
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Rating
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="0.0"
                      value={filters.minRating || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        minRating: e.target.value ? Number(e.target.value) : undefined 
                      }))}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isAvailable || false}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      isAvailable: e.target.checked || undefined 
                    }))}
                    className="w-4 h-4 text-gseed-600 rounded focus:ring-2 focus:ring-gseed-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Only available
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant={filters.isAvailable ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters(prev => ({ 
                ...prev, 
                isAvailable: !prev.isAvailable || undefined 
              }))}
            >
              Available Now
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gseed-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading professionals...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={loadProfessionals}>Try Again</Button>
          </div>
        ) : professionals.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No professionals found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filters.search || activeFiltersCount > 0
                ? 'Try adjusting your search filters'
                : 'No professionals registered yet'}
            </p>
            {(filters.search || activeFiltersCount > 0) && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional) => (
              <Link
                key={professional.id}
                to={`/professionals/${professional.id}`}
                className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-gseed-500 dark:hover:border-gseed-500 transition-all"
              >
                {/* Avatar & Cover */}
                <div className="relative h-32 bg-gradient-to-r from-gseed-500 to-gseed-600">
                  {professional.cover_url && (
                    <img 
                      src={professional.cover_url} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute -bottom-10 left-4">
                    {professional.avatar_url ? (
                      <img 
                        src={professional.avatar_url} 
                        alt={professional.name}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-gray-800"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gseed-500 to-gseed-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white dark:ring-gray-800">
                        {professional.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-12">
                  {/* Name & Title */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gseed-600 dark:group-hover:text-gseed-400 transition-colors">
                      {professional.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {professional.professional_title || 'Professional'}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Briefcase size={14} />
                      <span>{professional.views_count || 0} views</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {professional.professional_bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {professional.professional_bio}
                    </p>
                  )}

                  {/* Skills */}
                  {professional.skills && professional.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {professional.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {professional.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{professional.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">From</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(professional.hourly_rate ? Number(professional.hourly_rate) : undefined)}/h
                      </div>
                    </div>
                    
                    <Badge variant={(professional.availability === 'freelance' || professional.availability === 'part_time') ? 'success' : 'secondary'}>
                      {(professional.availability === 'freelance' || professional.availability === 'part_time') ? 'Available' : 'Busy'}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default ProfessionalsPage;
