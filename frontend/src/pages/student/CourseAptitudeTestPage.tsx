import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  FileCheck,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  XCircle
} from 'lucide-react';

export const CourseAptitudeTestPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchAssessment();
  }, [courseId, token]);

  const fetchAssessment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/assessment`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAssessment(data.assessment);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (questionId: string, option: string) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmitTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/assessment/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });

      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ayush-primary"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-xl font-bold text-gray-800">Aptitude Test Not Available</h3>
        <p className="text-gray-600 max-w-md mx-auto text-sm">
          No aptitude test is currently configured or unlocked for this course. Please ensure all required course lessons are completed.
        </p>
        <button
          onClick={() => navigate(`/courses/${courseId}/player`)}
          className="px-4 py-2 bg-ayush-primary text-white text-xs font-semibold rounded-lg inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Course Player
        </button>
      </div>
    );
  }

  // Result View after Submission
  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className={`bg-white rounded-xl p-8 shadow-md border text-center space-y-6 ${result.passed ? 'border-emerald-200' : 'border-red-200'}`}>
          {result.passed ? (
            <>
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <Award className="w-10 h-10" />
              </div>
              <div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wide">
                  PASSED (75% Mandatory Threshold Achieved)
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Congratulations!</h1>
                <p className="text-gray-600 text-sm mt-1 max-w-lg mx-auto">
                  You scored <strong className="text-emerald-700 text-lg">{result.scorePercent}%</strong> on the industry aptitude test! Your verifiable E-Certificate has been issued.
                </p>
              </div>

              {/* Certificate Details Card */}
              {result.certificate && (
                <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-200 text-left space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" /> Tamper-Resistant E-Certificate
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2.5 py-1 rounded border border-emerald-300">
                      {result.certificate.certificateNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Candidate:</span>
                      <p className="font-bold text-gray-900">{result.certificate.studentName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Course Program:</span>
                      <p className="font-bold text-gray-900">{result.certificate.courseTitle}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Issuing Entity:</span>
                      <p className="font-bold text-gray-900">{result.certificate.providerName || 'Ministry of AYUSH'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Attestation:</span>
                      <p className="font-bold text-gray-900">{result.certificate.signatory}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <Link
                      to={`/certificate/verify/${result.certificate.id}`}
                      target="_blank"
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <ExternalLink className="w-4 h-4" /> View Public Verification Link
                    </Link>
                    <Link
                      to="/student/portfolio"
                      className="w-full sm:w-auto px-4 py-2.5 bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 rounded-lg font-semibold text-xs text-center transition"
                    >
                      View in Digital Portfolio
                    </Link>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate(`/courses/${courseId}/player`)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold text-xs transition"
                >
                  Return to Course
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                <XCircle className="w-10 h-10" />
              </div>
              <div>
                <span className="px-3 py-1 bg-red-50 text-red-800 border border-red-200 rounded-full text-xs font-bold uppercase tracking-wide">
                  DID NOT PASS (Required: 75%)
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">Score: {result.scorePercent}%</h1>
                <p className="text-gray-600 text-sm mt-1 max-w-md mx-auto">{result.message}</p>
              </div>

              {result.missedDomains && result.missedDomains.length > 0 && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-left space-y-2">
                  <h4 className="text-xs font-bold text-red-900 uppercase">Recommended Review Domains</h4>
                  <ul className="list-disc list-inside text-xs text-red-800 space-y-1">
                    {result.missedDomains.map((domain: string, idx: number) => (
                      <li key={idx}>{domain}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setAnswers({});
                  }}
                  className="px-5 py-2.5 bg-ayush-primary text-white rounded-lg font-semibold text-xs flex items-center gap-2 hover:bg-emerald-800 transition"
                >
                  <RefreshCw className="w-4 h-4" /> Retake Aptitude Test
                </button>
                <button
                  onClick={() => navigate(`/courses/${courseId}/player`)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg font-semibold text-xs hover:bg-gray-200 transition"
                >
                  Review Course Lessons
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Active Aptitude Test Form View
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
            <Award className="w-4 h-4 text-amber-500" /> Mandatory Industry Certification Test
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{assessment.title || 'Course Aptitude Evaluation'}</h1>
          <p className="text-xs text-gray-500 mt-1">Must score $\ge 75\%$ to earn your Ministry-attested E-Certificate.</p>
        </div>

        <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 text-amber-900 text-xs font-bold">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{assessment.timeLimitMinutes || 30} Mins</span>
        </div>
      </div>

      {/* Test Form */}
      <form onSubmit={handleSubmitTest} className="space-y-6">
        {(assessment.questions || []).map((q: any, qIdx: number) => (
          <div key={q.id || qIdx} className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-gray-900 text-sm">
                <span className="text-ayush-primary font-bold mr-2">Q{qIdx + 1}.</span> {q.question}
              </h3>
            </div>

            <div className="space-y-2 pl-4">
              {(q.options || []).map((opt: string, oIdx: number) => {
                const isSelected = answers[q.id] === opt;
                return (
                  <label
                    key={oIdx}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition ${
                      isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleOptionChange(q.id, opt)}
                      className="text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-gray-50 p-4 rounded-xl border flex items-center justify-between">
          <span className="text-xs text-gray-600">
            Answered: {Object.keys(answers).length} / {assessment.questions?.length || 0} questions
          </span>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(`/courses/${courseId}/player`)}
              className="px-4 py-2 border bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || Object.keys(answers).length === 0}
              className="px-6 py-2 bg-ayush-primary hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 transition"
            >
              {submitting ? 'Submitting & Grading...' : 'Submit Aptitude Test'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
