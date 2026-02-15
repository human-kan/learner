import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse, completeModule } from '../services/api';

export default function Course() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    getCourse(id)
      .then((res) => {
        setCourse(res.data.course);
        // Auto-select first active module
        const firstActive = res.data.course.modules.find((m) => m.status === 'active');
        if (firstActive) setSelectedModule(firstActive);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleComplete = async () => {
    if (!selectedModule) return;

    setCompleting(true);
    try {
      await completeModule(selectedModule.id);

      // Refresh course data
      const res = await getCourse(id);
      setCourse(res.data.course);

      // Select next active module
      const nextActive = res.data.course.modules.find((m) => m.status === 'active');
      setSelectedModule(nextActive || null);
    } catch (err) {
      alert('Failed to complete module');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-text-secondary">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-text-secondary mb-4">Course not found</div>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const video = selectedModule?.resources?.find((r) => r.type === 'video');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-800 bg-card">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-text-secondary hover:text-text-primary mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold">{course.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module List (Sidebar) */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Modules</h2>
            <div className="space-y-2">
              {course.modules.map((module, idx) => {
                const isLocked = module.status === 'locked';
                const isCompleted = module.status === 'completed';
                const isActive = selectedModule?.id === module.id;

                return (
                  <button
                    key={module.id}
                    onClick={() => !isLocked && setSelectedModule(module)}
                    disabled={isLocked}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      isLocked
                        ? 'bg-background border-gray-800 opacity-50 cursor-not-allowed'
                        : isActive
                        ? 'bg-accent/10 border-accent'
                        : 'bg-card border-gray-800 hover:border-accent/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">
                        {isCompleted ? '✅' : isLocked ? '🔒' : '▶️'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{module.title}</div>
                        <div className="text-sm text-text-secondary mt-1">
                          Week {module.weekNumber} • {module.estimatedHours}h • {module.xpReward} XP
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {selectedModule ? (
            <div className="space-y-6">
              {/* Video Player */}
              {video && (
                <div className="card p-0 overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeVideoId}`}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg">{video.title}</h3>
                  </div>
                </div>
              )}

              {/* Module Info */}
              <div className="card">
                <h2 className="text-2xl font-bold mb-2">{selectedModule.title}</h2>
                <p className="text-text-secondary mb-6">{selectedModule.description}</p>

                {selectedModule.status === 'completed' ? (
                  <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
                    ✅ Module completed! +{selectedModule.xpReward} XP earned
                  </div>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="btn-primary w-full"
                  >
                    {completing ? 'Completing...' : `Complete Module (+${selectedModule.xpReward} XP)`}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">🎓</div>
              <p className="text-text-secondary">Select a module to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
