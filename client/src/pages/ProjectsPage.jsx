import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjects from '../hooks/useProjects';
import ProjectCard from '../components/projects/ProjectCard';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { Plus, Search, Filter, FolderKanban, SortAsc } from 'lucide-react';

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Name A-Z' },
];

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, loading, error, addProject, removeProject } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects
      .filter((project) => {
        if (!query) return true;

        const title = project.title?.toLowerCase() || project.name?.toLowerCase() || '';
        const description = project.description?.toLowerCase() || '';
        const techStack = (project.techStack || []).map((item) => item.toLowerCase());

        return (
          title.includes(query) ||
          description.includes(query) ||
          techStack.some((tech) => tech.includes(query))
        );
      })
      .filter((project) => {
        if (statusFilter === 'all') return true;
        return project.status === statusFilter;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return (a.title || a.name || '').localeCompare(b.title || b.name || '');
      });
  }, [projects, searchQuery, statusFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('newest');
  };

  const handleDeleteProject = async (projectId) => {
    await removeProject(projectId);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-gray-400 mt-1">{projects.length} total projects</p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-3xl border border-surface-border bg-dark-900 p-3">
            <div className="relative w-full">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, description, tech stack"
                className="input pl-11 w-full"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="relative block">
              <span className="sr-only">Status filter</span>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Filter size={18} />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input pl-10"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="relative block">
              <span className="sr-only">Sort projects</span>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <SortAsc size={18} />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input pl-10"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center justify-between rounded-3xl border border-surface-border bg-dark-900 px-4 py-3 text-sm text-gray-400">
              <div className="inline-flex items-center gap-2">
                <FolderKanban size={18} />
                {filteredProjects.length} results
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="text-indigo-300 hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:block rounded-3xl border border-surface-border bg-dark-900 p-6">
          <h2 className="text-sm font-semibold text-white">Quick tips</h2>
          <p className="mt-3 text-sm text-gray-400">
            Use the search box to find projects by title, description, or tech stack. Filter by status and sort to surface the work you need.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-surface-border bg-dark-900">
          <LoadingSpinner size="lg" />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start managing tasks, notes, and sprints."
          actionLabel="Create project"
          onAction={() => setIsModalOpen(true)}
        />
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-3xl border border-surface-border bg-dark-900 p-8 text-gray-400">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">No projects match your search</h2>
              <p className="mt-2 text-sm text-gray-400">
                Try refining your search or updating the status and sort filters.
              </p>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Search size={16} />
              Reset filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id || project._id}
              project={project}
              onClick={() => navigate(`/projects/${project.id || project._id}`)}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addProject}
        submitLabel="Create Project"
      />
    </div>
  );
}
