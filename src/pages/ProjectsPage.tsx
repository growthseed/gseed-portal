import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from '@/components/projetos/ProjectCard';
import { ProjectFilterSidebar } from '@/components/projetos/ProjectFilterSidebar';
import { projectService } from '@/services/projectService';
import type { Project } from '@/types/database.types';

interface Filters {
  search: string;
  category?: string;
  workModel?: 'remote' | 'onsite' | 'hybrid';
  minBudget?: number;
  maxBudget?: number;
  location?: string;
  skills?: string[];
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
  });
  const [showSidebar, setShowSidebar] = useState(true);

  // Load projects with useCallback for memoization
  const loadProjects = useCallback(async () => {
    console.log('[ProjectsPage] 🔄 Loading projects...');
    setLoading(true);
    setError(null);
    
    try {
      const result = await projectService.getAll({
        search: filters.search || undefined,
        category: filters.category || undefined,
        work_model: filters.workModel || undefined,
        min_budget: filters.minBudget || undefined,
        max_budget: filters.maxBudget || undefined,
        location: filters.location || undefined,
        skills: filters.skills || undefined,
      });
      
      if (result.success && result.data) {
        console.log('[ProjectsPage] ✅ Projects loaded:', result.data.length);
        setProjects(result.data);
      } else {
        console.error('[ProjectsPage] ❌ Error loading:', result.message);
        setError(result.message || 'Error loading projects');
      }
    } catch (err: any) {
      console.error('[ProjectsPage] 💥 Fatal error:', err);
      setError(err.message || 'Error loading projects');
    } finally {
      setLoading(false);
    }
  }, [
    filters.search,
    filters.category,
    filters.workModel,
    filters.minBudget,
    filters.maxBudget,
    filters.location,
    filters.skills
  ]);

  // Load projects only when filters change
  useEffect(() => {
    console.log('[ProjectsPage] 📍 Filters changed, reloading...');
    loadProjects();
  }, [loadProjects]);

  const clearFilters = useCallback(() => {
    setFilters({ search: '' });
  }, []);

  const activeFiltersCount = useMemo(() => 
    (filters.category ? 1 : 0) +
    (filters.workModel ? 1 : 0) +
    (filters.minBudget ? 1 : 0) +
    (filters.maxBudget ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.skills && filters.skills.length > 0 ? filters.skills.length : 0),
    [filters]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Filter Sidebar */}
      <ProjectFilterSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Available Projects
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {projects.length} {projects.length === 1 ? 'project found' : 'projects found'}
                </p>
              </div>
              
              <Button asChild size="lg">
                <Link to="/create-project">
                  <Briefcase className="mr-2" size={20} />
                  Create Project
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search projects by title, description or skills..."
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
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gseed-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={loadProjects}>Try Again</Button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filters.search || activeFiltersCount > 0
                  ? 'Try adjusting your search filters'
                  : 'Be the first to create a project!'}
              </p>
              {(filters.search || activeFiltersCount > 0) && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} projeto={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
