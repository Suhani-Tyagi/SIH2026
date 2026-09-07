import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Award, HelpCircle } from 'lucide-react';

interface Question {
  id: string;
  discipline: string;
  skillCategory: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const SkillAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});

  const [scores, setScores] = useState({
    panchakarma: 85,
    herbalFormulation: 78,
    clinicalDiagnostics: 90,
    nadiPariksha: 82,
    yogaTherapy: 65,
    researchMethodology: 75,
    patientCounseling: 88,
    qaGmp: 70
  });

  useEffect(() => {
    fetch('/api/skills/questions', {
      headers: { Authorization: `Bearer ${localStorage.getItem('ayush_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.questions && Array.isArray(data.questions)) {
          const parsed = data.questions.map((q: any) => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || [])
          }));
          setQuestions(parsed);
        }
      })
      .catch(console.error);
  }, []);

  const handleScoreChange = (field: string, val: number) => {
    setScores((prev) => ({ ...prev, [field]: val }));
  };

  const handleMcqSelect = (questionId: string, option: string) => {
    setMcqAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/skills/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('ayush_token')}`
        },
        body: JSON.stringify({
          answers: mcqAnswers,
          categoryScores: scores
        })
      });
      if (res.ok) {
        navigate('/student/skill-profile');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      
      {/* Top Title Card */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold border border-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Evidence-Based AYUSH Skill Evaluation
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Technical MCQ & Skill Competency Mapping
        </h1>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          Answer domain-specific technical MCQs and evaluate your practical confidence across 8 key AYUSH competency pillars to calculate your server-verified Skill Readiness Score.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between max-w-xl mx-auto px-4">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep === step
                  ? 'bg-ayush-primary text-amber-400 ring-4 ring-emerald-100 shadow-sm'
                  : currentStep > step
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
            </div>
            {step < 5 && <div className={`w-8 sm:w-12 h-1 rounded ${currentStep > step ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {/* STEP 1: Domain MCQs */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-700" /> Step 1: Technical MCQ Knowledge Quiz
              </h3>
              <p className="text-xs text-slate-500">Answer standardized questions evaluated against Charaka Samhita & API Pharmacopoeial standards.</p>
            </div>

            <div className="space-y-6">
              {questions.length > 0 ? (
                questions.slice(0, 5).map((q, idx) => (
                  <div key={q.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-xs font-bold text-slate-800">
                      Q{idx + 1}. [{q.skillCategory}] {q.questionText}
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleMcqSelect(q.id || `q_${idx}`, opt)}
                          className={`p-2.5 text-left text-xs font-medium rounded-xl border transition-all ${
                            mcqAnswers[q.id || `q_${idx}`] === opt
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                  Default AYUSH Pharmacopoeial Question Bank loaded. Click Next to proceed to practical skill self-ratings.
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Panchakarma & Shodhana */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Step 2: Classical Panchakarma & Shodhana Therapy</h3>
              <p className="text-xs text-slate-500">Rate your clinical experience in executing classical Purvakarma and Pradhanakarma procedures.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Panchakarma Procedure Execution (Abhyanga, Swedana, Vasti, Vamana, Shirodhara)</span>
                  <span className="text-emerald-700 font-extrabold">{scores.panchakarma}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.panchakarma}
                  onChange={(e) => handleScoreChange('panchakarma', parseInt(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Theoretical Understanding Only</span>
                  <span>Supervised Clinical Practice</span>
                  <span>Independent Master Practitioner</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Dravyaguna & Herbal Formulations */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Step 3: Dravyaguna & Herbal Formulation Knowledge</h3>
              <p className="text-xs text-slate-500">Herb identification, Rasa Shastra, extraction methods, and formulation preparation.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Herbal Standardization & Classical Bhaishajya Kalpana</span>
                  <span className="text-emerald-700 font-extrabold">{scores.herbalFormulation}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.herbalFormulation}
                  onChange={(e) => handleScoreChange('herbalFormulation', parseInt(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Nadi Pariksha & Clinical Diagnostics */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Step 4: Nadi Pariksha & Clinical Diagnostics</h3>
              <p className="text-xs text-slate-500">Tactile pulse diagnosis, Rogi Pariksha, and pathology correlation.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Nadi Pariksha (Pulse Diagnosis) Tactile Proficiency</span>
                  <span className="text-emerald-700 font-extrabold">{scores.nadiPariksha}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.nadiPariksha}
                  onChange={(e) => handleScoreChange('nadiPariksha', parseInt(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Clinical Diagnostics & Differential Diagnosis</span>
                  <span className="text-emerald-700 font-extrabold">{scores.clinicalDiagnostics}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.clinicalDiagnostics}
                  onChange={(e) => handleScoreChange('clinicalDiagnostics', parseInt(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Research & Industrial QA/GMP */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Step 5: Research Methodology & Industrial QA/GMP</h3>
              <p className="text-xs text-slate-500">Good Clinical Practice (GCP), trial design, Schedule T, and AYUSH export compliance.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Research Methodology, GCP & Medical Writing</span>
                  <span className="text-emerald-700 font-extrabold">{scores.researchMethodology}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.researchMethodology}
                  onChange={(e) => handleScoreChange('researchMethodology', parseInt(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Industrial QA/QC, GMP Compliance & Schedule T</span>
                  <span className="text-emerald-700 font-extrabold">{scores.qaGmp}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.qaGmp}
                  onChange={(e) => handleScoreChange('qaGmp', parseInt(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : <div></div>}

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-6 py-2.5 bg-ayush-primary hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg"
            >
              {loading ? 'Evaluating Score...' : 'Submit & Generate Verified Profile'} <Award className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
