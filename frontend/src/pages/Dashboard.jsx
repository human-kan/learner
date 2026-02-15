import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, getStats } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  useEffect(() => {
    Promise.all([getCourses(), getStats()])
      .then(([coursesRes, statsRes]) => {
        setCourses(coursesRes.data.courses);
        setStats(statsRes.data.stats);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-text-secondary">Loading...</div>
      </div>
    );
  }

  const xpToNextLevel = stats ? (stats.level * 500) - stats.totalXp : 0;
  const xpProgress = stats ? (stats.totalXp % 500) / 500 * 100 : 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-text-secondary mt-1">Ready to level up?</p>
          </div>
          <button onClick={logoutUser} className="btn-secondary">
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <div className="text-sm text-text-secondary mb-1">Level</div>
              <div className="text-4xl font-bold text-accent">{stats.level}</div>
            </div>

            <div className="card">
              <div className="text-sm text-text-secondary mb-1">Total XP</div>
              <div className="text-4xl font-bold">{stats.totalXp}</div>
            </div>

            <div className="card">
              <div className="text-sm text-text-secondary mb-1">Streak</div>
              <div className="text-4xl font-bold text-orange-500">{stats.streakDays}🔥</div>
            </div>

            <div className="card">
              <div className="text-sm text-text-secondary mb-1">Completed</div>
              <div className="text-4xl font-bold text-green-500">{stats.modulesCompleted}</div>
            </div>
          </div>
        )}

        {/* XP Progress Bar */}
        {stats && (
          <div className="card mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Level {stats.level} Progress</span>
              <span>{xpToNextLevel} XP to Level {stats.level + 1}</span>
            </div>
            <div className="h-4 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-purple-500 transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Courses */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Courses</h2>

          {courses.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-text-secondary mb-4">No courses yet. Create your first one!</p>
              <button
                onClick={() => navigate('/onboarding')}
                className="btn-primary"
              >
                Start Learning
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {courses.map((course) => {
                const completedModules = course.modules.filter((m) => m.status === 'completed').length;
                const progress = (completedModules / course.totalModules) * 100;

                return (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="card cursor-pointer hover:border-accent"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{course.title}</h3>
                        <p className="text-text-secondary mt-1">{course.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-text-secondary">
                          {completedModules} / {course.totalModules} modules
                        </div>
                        <div className="text-2xl font-bold text-accent mt-1">
                          {Math.round(progress)}%
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
