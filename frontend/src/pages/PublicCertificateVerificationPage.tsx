import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, AlertOctagon, CheckCircle2, Award, Calendar, User, BookOpen, Building2, QrCode } from 'lucide-react';

export const PublicCertificateVerificationPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchCertificate();
  }, [certificateId]);

  const fetchCertificate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/certificate/verify/${certificateId}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ayush-primary"></div>
      </div>
    );
  }

  const cert = data?.certificate;
  const isValid = data?.isValid;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8 px-4">
      {/* Official Header Badge */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100 text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-emerald-950 text-amber-400 rounded-full flex items-center justify-center font-bold text-lg border-2 border-amber-400">
            AIIA
          </div>
          <div className="text-left">
            <h2 className="text-xs font-bold text-emerald-900 tracking-wider uppercase">Ministry of AYUSH • Government of India</h2>
            <h1 className="text-lg font-extrabold text-gray-900">National AYUSH Industry E-Certificate Verification System</h1>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className={`p-4 rounded-xl border flex items-center justify-center gap-3 font-bold text-sm ${
          isValid
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-red-50 border-red-300 text-red-900'
        }`}>
          {isValid ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span>AUTHENTIC & VALIDATED E-CERTIFICATE</span>
            </>
          ) : (
            <>
              <AlertOctagon className="w-6 h-6 text-red-600 shrink-0" />
              <span>{data?.status === 'REVOKED' ? 'CERTIFICATE HAS BEEN REVOKED' : 'INVALID CERTIFICATE RECORD'}</span>
            </>
          )}
        </div>
      </div>

      {/* Certificate Details Document Card */}
      {cert ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
          {/* Top Decorative Border */}
          <div className="h-3 bg-gradient-to-r from-emerald-800 via-amber-500 to-emerald-900"></div>

          <div className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Certificate Identifier</span>
                <h3 className="text-2xl font-mono font-extrabold text-gray-900">{cert.certificateNumber}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Issued under Ministry of AYUSH Skill Standardisation Framework</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border text-center font-mono text-[10px] text-gray-600 space-y-1">
                <QrCode className="w-8 h-8 mx-auto text-gray-700" />
                <span>{cert.verificationQrToken || 'VERIFIED-QR'}</span>
              </div>
            </div>

            {/* Main Certificate Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <User className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500 block">Candidate Name</span>
                  <strong className="text-base text-gray-900">{cert.studentName}</strong>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <BookOpen className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500 block">Industry Course Program</span>
                  <strong className="text-base text-gray-900">{cert.courseTitle}</strong>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
                <Building2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500 block">Issuing Provider / Partner</span>
                  <strong className="text-gray-900">{cert.providerName}</strong>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
                <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500 block">Aptitude Score & Threshold</span>
                  <strong className="text-gray-900">{cert.score}% (Pass Threshold: 75%)</strong>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
                <Calendar className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500 block">Issue Date</span>
                  <strong className="text-gray-900">{new Date(cert.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-500 block">Official Attestation Authority</span>
                  <strong className="text-gray-900">{cert.signatory || 'Ministry of AYUSH & AIIA Academic Cell'}</strong>
                </div>
              </div>
            </div>

            {/* Revocation Warning if Revoked */}
            {cert.status === 'REVOKED' && (
              <div className="p-4 bg-red-100 rounded-lg border border-red-300 text-red-900 text-xs space-y-1">
                <h4 className="font-bold text-red-950 uppercase flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4" /> Certificate Revoked Notice
                </h4>
                <p>Reason for Revocation: {cert.revocationReason || 'Revoked by issuing authority'}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 shadow border text-center space-y-3">
          <AlertOctagon className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-xl font-bold text-gray-800">Certificate Not Found</h3>
          <p className="text-gray-600 text-sm">{data?.message || 'No record matches the provided certificate ID or QR token.'}</p>
        </div>
      )}

      {/* Portal Link Footer */}
      <div className="text-center pt-4">
        <Link to="/" className="text-xs font-semibold text-ayush-primary hover:underline">
          Return to AYUSH Setu Portal
        </Link>
      </div>
    </div>
  );
};
