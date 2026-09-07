import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, AlertOctagon, CheckCircle2, Award, Calendar, User, BookOpen, Building2, QrCode, Download } from 'lucide-react';

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
  const printCertificate = () => window.print();

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

      {/* Printable certificate document */}
      {cert ? (
        <div className="space-y-3">
          <div className="flex justify-end print:hidden"><button onClick={printCertificate} className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-2"><Download className="w-4 h-4" /> Print / Save Certificate</button></div>
          <div className="bg-[#fffdf5] shadow-xl border-[10px] border-emerald-900 outline outline-2 outline-amber-500 outline-offset-[-18px] overflow-hidden relative text-center px-8 py-12 sm:px-16 sm:py-16">
            <div className="absolute top-7 left-8 text-left"><p className="text-[9px] tracking-[0.22em] font-bold text-emerald-900">MINISTRY OF AYUSH • GOVERNMENT OF INDIA</p><p className="text-[10px] text-slate-500">AIIA National Skill Framework</p></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-2 border-emerald-800 rounded-full flex items-center justify-center"><QrCode className="w-9 h-9 text-emerald-800" /></div>
            <Award className="w-14 h-14 text-amber-600 mx-auto mb-3" />
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-800 font-bold">This is to certify that</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-emerald-950 mt-5 border-b border-amber-500 inline-block pb-2 px-8">{cert.studentName}</h2>
            <p className="text-sm text-slate-600 mt-6">has successfully completed the industry-certified programme</p>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 mt-3 max-w-2xl mx-auto">{cert.courseTitle}</h3>
            <p className="text-sm text-slate-600 mt-5">with a final assessed score of <strong className="text-emerald-800">{cert.score}%</strong>, satisfying the required 75% standard.</p>
            <div className="mt-10 grid grid-cols-3 gap-3 text-[10px] text-slate-600">
              <div className="border-t border-slate-400 pt-2"><strong className="block text-slate-800">{new Date(cert.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>Date of issue</div>
              <div className="border-t border-slate-400 pt-2"><strong className="block text-slate-800">{cert.providerName}</strong>Issuing partner</div>
              <div className="border-t border-slate-400 pt-2"><strong className="block text-slate-800">{cert.signatory || 'AIIA Academic Cell'}</strong>Authorised signatory</div>
            </div>
            <p className="mt-8 font-mono text-[10px] text-slate-500">Certificate No. {cert.certificateNumber} • Verification token: {cert.verificationQrToken}</p>

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
