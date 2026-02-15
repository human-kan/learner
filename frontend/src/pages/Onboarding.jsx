import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitOnboarding, generateCourse } from '../services/api';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    goal: '',
    timeframeWeeks: 12,
    weeklyHours: 10,
    skillLevel: 'beginner',
    learningStyle: 'mixed',
    endObjective: '',
    priorKnowledge: '',
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 7));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitOnboarding(formData);
      await generateCourse();
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to generate course. Please try again.');
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">What do you want to learn?</h2>
            <p className="text-text-secondary mb-6">Be specific — this helps us build your perfect course.</p>
            <input
              type="text"
              value={formData.goal}
              onChange={(e) => updateField('goal', e.target.value)}
              className="input w-full text-lg"
              placeholder="e.g., Full Stack Web Development"
              autoFocus
            />
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">How much time do you have?</h2>
            <p className="text-text-secondary mb-6">Choose your timeframe (weeks).</p>
            <div className="grid grid-cols-3 gap-4">
              {[4, 8, 12, 16, 24, 52].map((weeks) => (
                <button
                  key={weeks}
                  onClick={() => updateField('timeframeWeeks', weeks)}
                  className={`card py-6 text-center ${
                    formData.timeframeWeeks === weeks ? 'border-accent bg-accent/10' : ''
                  }`}
                >
                  <div className="text-3xl font-bold">{weeks}</div>
                  <div className="text-sm text-text-secondary mt-1">weeks</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Weekly availability?</h2>
            <p className="text-text-secondary mb-6">How many hours per week can you dedicate?</p>
            <div className="grid grid-cols-3 gap-4">
              {[5, 10, 15, 20, 30, 40].map((hours) => (
                <button
                  key={hours}
                  onClick={() => updateField('weeklyHours', hours)}
                  className={`card py-6 text-center ${
                    formData.weeklyHours === hours ? 'border-accent bg-accent/10' : ''
                  }`}
                >
                  <div className="text-3xl font-bold">{hours}</div>
                  <div className="text-sm text-text-secondary mt-1">hours/week</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">What's your skill level?</h2>
            <p className="text-text-secondary mb-6">Be honest — we'll match the content to you.</p>
            <div className="space-y-3">
              {[
                { value: 'beginner', label: 'Beginner', desc: 'Starting from scratch' },
                { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
                { value: 'advanced', label: 'Advanced', desc: 'Deep knowledge' },
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => updateField('skillLevel', level.value)}
                  className={`card w-full text-left ${
                    formData.skillLevel === level.value ? 'border-accent bg-accent/10' : ''
                  }`}
                >
                  <div className="font-semibold">{level.label}</div>
                  <div className="text-sm text-text-secondary">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">How do you learn best?</h2>
            <p className="text-text-secondary mb-6">Choose your preferred style.</p>
            <div className="space-y-3">
              {[
                { value: 'visual', label: 'Visual', desc: 'Videos and diagrams' },
                { value: 'text', label: 'Text', desc: 'Articles and documentation' },
                { value: 'practical', label: 'Practical', desc: 'Hands-on projects' },
                { value: 'mixed', label: 'Mixed', desc: 'Combination of all' },
              ].map((style) => (
                <button
                  key={style.value}
                  onClick={() => updateField('learningStyle', style.value)}
                  className={`card w-full text-left ${
                    formData.learningStyle === style.value ? 'border-accent bg-accent/10' : ''
                  }`}
                >
                  <div className="font-semibold">{style.label}</div>
                  <div className="text-sm text-text-secondary">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">What's your end goal?</h2>
            <p className="text-text-secondary mb-6">What do you want to build or achieve?</p>
            <textarea
              value={formData.endObjective}
              onChange={(e) => updateField('endObjective', e.target.value)}
              className="input w-full h-32 resize-none"
              placeholder="e.g., Build and deploy a full-stack e-commerce app"
              autoFocus
            />
          </div>
        );

      case 7:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">Any prior knowledge?</h2>
            <p className="text-text-secondary mb-6">Tell us what you already know (optional).</p>
            <textarea
              value={formData.priorKnowledge}
              onChange={(e) => updateField('priorKnowledge', e.target.value)}
              className="input w-full h-32 resize-none"
              placeholder="e.g., Basic HTML/CSS, some JavaScript"
              autoFocus
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-text-secondary mb-2">
            <span>Step {step} of 7</span>
            <span>{Math.round((step / 7) * 100)}%</span>
          </div>
          <div className="h-2 bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="card min-h-[400px] flex flex-col">
          <div className="flex-1">{renderStep()}</div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              className="btn-secondary"
              disabled={step === 1}
            >
              Back
            </button>

            {step < 7 ? (
              <button
                onClick={nextStep}
                className="btn-primary"
                disabled={
                  (step === 1 && !formData.goal) ||
                  (step === 6 && !formData.endObjective)
                }
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Generating Course...' : 'Generate My Course'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
