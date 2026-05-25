import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProjects from '../hooks/useProjects';
import ProjectCard from '../components/projects/ProjectCard';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import logo from '../assets/logo.png';
import { Plus, FolderKanban, TrendingUp, CheckSquare, Clock } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, loading, error, addProject, removeProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Calculate stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const totalTasks = projects.reduce((sum, p) => sum + (p.taskCount || 0), 0);

  // Filter projects based on active tab
  const filteredProjects =
    activeFilter === 'all' ? projects : projects.filter((p) => p.status === activeFilter);

  // Handle project creation
  const handleCreateProject = async (data) => {
    try {
      await addProject(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create project:', err);
      throw err;
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await removeProject(projectId);
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  // Handle project card click
  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <p className="text-gray-400 text-sm">Welcome back,</p>
        <h1 className="text-3xl font-bold text-white">
          {user?.name?.split(' ')[0] || 'Developer'}
        </h1>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Projects Stat */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Projects</p>
              <p className="text-2xl font-bold text-white">{totalProjects}</p>
            </div>
            <div className="rounded-lg bg-indigo-600/20 p-3 text-indigo-400">
              <FolderKanban size={20} />
            </div>
          </div>
        </div>

        {/* Active Projects Stat */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Projects</p>
              <p className="text-2xl font-bold text-white">{activeProjects}</p>
            </div>
            <div className="rounded-lg bg-green-600/20 p-3 text-green-400">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        {/* Total Tasks Stat */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{totalTasks}</p>
            </div>
            <div className="rounded-lg bg-purple-600/20 p-3 text-purple-400">
              <CheckSquare size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Header and New Project Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Projects</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 border-b border-surface-border">
        {['all', 'active', 'paused', 'completed'].map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-3 font-medium transition capitalize border-b-2 ${
              activeFilter === filter
                ? 'border-indigo-500 text-white bg-indigo-600/10'
                : 'border-transparent text-gray-500 hover:bg-surface-raised'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={activeFilter === 'all' ? 'No projects yet' : `No ${activeFilter} projects`}
          description={
            activeFilter === 'all'
              ? 'Create your first project to get started'
              : 'Try a different filter to see more projects'
          }
          actionLabel={activeFilter === 'all' ? 'Create Project' : undefined}
          onAction={activeFilter === 'all' ? () => setIsModalOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div key={project._id || project.id} className="group">
              <ProjectCard
                project={project}
                onClick={() => handleProjectClick(project._id || project.id)}
                onDelete={handleDeleteProject}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        submitLabel="Create Project"
      />
    </div>
  );
}

