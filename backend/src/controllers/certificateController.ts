import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma, { isDatabaseConfigured } from '../prisma';
import { memoryCertificates, memoryAuditLogs, MemoryAuditLog } from '../store/inMemoryStore';

export const verifyCertificatePublic = async (req: Request, res: Response) => {
  try {
    const { certificateId } = req.params;
    let cert: any = null;

    if (isDatabaseConfigured) {
      try {
        cert = await prisma.certificate.findFirst({
          where: {
            OR: [
              { id: certificateId },
              { certificateNumber: certificateId },
              { verificationQrToken: certificateId }
            ]
          },
          include: { student: true, course: true }
        });
      } catch (e) {}
    }

    if (!cert) {
      cert = memoryCertificates.find(
        c => c.id === certificateId || c.certificateNumber === certificateId || c.verificationQrToken === certificateId
      );
    }

    if (!cert) {
      return res.status(404).json({
        isValid: false,
        status: 'NOT_FOUND',
        message: `No certificate record found matching identifier "${certificateId}". Please check the certificate number or QR token.`
      });
    }

    const isValid = cert.status === 'VALID';

    return res.json({
      isValid,
      status: cert.status,
      certificate: {
        id: cert.id,
        certificateNumber: cert.certificateNumber,
        studentName: cert.studentName || cert.student?.name,
        courseTitle: cert.courseTitle || cert.course?.title,
        providerName: cert.providerName || cert.course?.providerName,
        issueDate: cert.issueDate,
        score: cert.score,
        signatory: cert.signatory || 'Ministry of AYUSH & AIIA Academic Cell',
        status: cert.status,
        revocationReason: cert.revocationReason || null,
        verificationQrToken: cert.verificationQrToken
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const revokeCertificate = async (req: AuthRequest, res: Response) => {
  try {
    const { certificateId } = req.params;
    const { reason } = req.body;
    const actorId = req.user?.id;
    const actorRole = req.user?.role;

    if (!actorId || (actorRole !== 'INDUSTRY' && actorRole !== 'SUPER_ADMIN')) {
      return res.status(403).json({ message: 'Only Industry Partners or Super Admins can revoke certificates' });
    }

    if (isDatabaseConfigured) {
      try {
        const cert = await prisma.certificate.update({
          where: { id: certificateId },
          data: {
            status: 'REVOKED',
            revocationReason: reason || 'Revoked by Issuing Industry Partner / Administrator'
          }
        });

        await prisma.auditLog.create({
          data: {
            actorId,
            actorRole: actorRole || 'INDUSTRY',
            action: 'CERTIFICATE_REVOKED',
            targetEntity: cert.certificateNumber,
            detailsJson: JSON.stringify({ certificateId, reason })
          }
        });

        return res.json({ message: `Certificate ${cert.certificateNumber} has been revoked successfully.`, certificate: cert });
      } catch (e) {}
    }

    // Memory Fallback
    const memCert = memoryCertificates.find(c => c.id === certificateId || c.certificateNumber === certificateId);
    if (!memCert) return res.status(404).json({ message: 'Certificate not found' });

    memCert.status = 'REVOKED';
    memCert.revocationReason = reason || 'Revoked by Issuing Industry Partner / Administrator';

    const memAudit: MemoryAuditLog = {
      id: `audit-mem-${Date.now()}`,
      actorId,
      actorRole: actorRole || 'INDUSTRY',
      action: 'CERTIFICATE_REVOKED',
      targetEntity: memCert.certificateNumber,
      detailsJson: JSON.stringify({ certificateId, reason }),
      timestamp: new Date()
    };
    memoryAuditLogs.push(memAudit);

    return res.json({ message: `Certificate ${memCert.certificateNumber} has been revoked successfully.`, certificate: memCert });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getStudentCertificates = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    if (isDatabaseConfigured) {
      try {
        const certificates = await prisma.certificate.findMany({
          where: { studentId },
          orderBy: { issueDate: 'desc' }
        });
        if (certificates.length > 0) return res.json({ certificates });
      } catch (e) {}
    }

    const memCerts = memoryCertificates.filter(c => c.studentId === studentId);
    return res.json({ certificates: memCerts });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
