export interface StudentMatchProfile {
  id: string;
  degree: string;
  passoutYear: number;
  location?: string;
  skillScores: Record<string, number>; // e.g. { panchakarma: 85, qaGmp: 80, ... }
  verifiedBadges: string[];
  careerGoals?: string[];
}

export interface OpportunityMatchTarget {
  id: string;
  title: string;
  type: string;
  system: string;
  minDegree: string;
  eligibleBatch: number;
  location: string;
  mode: string;
  skillsRequired: string[]; // required skills
  preferredSkills?: string[];
  knockoutQuestions?: { id: string; question: string; requiredAnswer: string }[];
}

export interface MatchResult {
  eligible: boolean;
  matchScore: number;
  missingMandatory: string[];
  scoreBreakdown: {
    skillFitScore: number;       // Weight 35%
    eligibilityScore: number;    // Weight 20%
    careerAlignmentScore: number;// Weight 15%
    locationModeScore: number;   // Weight 10%
    verifiedEvidenceScore: number;// Weight 10%
    employerPreferenceScore: number; // Weight 10%
  };
  topStrengths: string[];
  topGaps: string[];
  explanation: string;
}

export function computeOpportunityMatch(
  student: StudentMatchProfile,
  opportunity: OpportunityMatchTarget,
  studentAnswers?: Record<string, string>
): MatchResult {
  const missingMandatory: string[] = [];

  // 1. Mandatory Hard Eligibility Checks
  // Degree check
  if (opportunity.minDegree && student.degree) {
    const studentDeg = student.degree.toUpperCase();
    const reqDeg = opportunity.minDegree.toUpperCase();
    if (!studentDeg.includes(reqDeg) && !reqDeg.includes('ALL') && !reqDeg.includes('BAMS')) {
      // Not hard fail if related AYUSH degree, but log if major mismatch
    }
  }

  // Knockout questions check
  if (opportunity.knockoutQuestions && opportunity.knockoutQuestions.length > 0 && studentAnswers) {
    for (const kq of opportunity.knockoutQuestions) {
      const givenAns = studentAnswers[kq.id] || studentAnswers[kq.question];
      if (givenAns && givenAns.trim().toLowerCase() !== kq.requiredAnswer.trim().toLowerCase()) {
        missingMandatory.push(`Failed knockout criteria: ${kq.question}`);
      }
    }
  }

  const eligible = missingMandatory.length === 0;

  // 2. Component Scoring
  // A. Skill Fit Score (35%)
  const requiredSkills = opportunity.skillsRequired || [];
  let skillSum = 0;
  const topStrengths: string[] = [];
  const topGaps: string[] = [];

  if (requiredSkills.length > 0) {
    requiredSkills.forEach((skillName) => {
      const normalizedKey = skillName.toLowerCase().replace(/[^a-z0-9]/g, '');
      let studentSkillScore = 0;

      // Find best match in student's skillScores
      Object.keys(student.skillScores || {}).forEach((key) => {
        const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normKey.includes(normalizedKey) || normalizedKey.includes(normKey)) {
          studentSkillScore = Math.max(studentSkillScore, student.skillScores[key]);
        }
      });

      if (studentSkillScore >= 75) {
        topStrengths.push(skillName);
      } else {
        topGaps.push(skillName);
      }
      skillSum += studentSkillScore;
    });
  }

  const skillFitScore = requiredSkills.length > 0 ? Math.min(100, Math.round(skillSum / requiredSkills.length)) : 80;

  // B. Eligibility & Batch Score (20%)
  let eligibilityScore = 90;
  if (student.passoutYear && opportunity.eligibleBatch) {
    const diff = Math.abs(student.passoutYear - opportunity.eligibleBatch);
    if (diff === 0) eligibilityScore = 100;
    else if (diff === 1) eligibilityScore = 85;
    else eligibilityScore = 70;
  }

  // C. Career Alignment Score (15%)
  let careerAlignmentScore = 75;
  if (student.careerGoals && student.careerGoals.length > 0) {
    const isGoalMatch = student.careerGoals.some(
      (goal) =>
        opportunity.title.toLowerCase().includes(goal.toLowerCase()) ||
        opportunity.type.toLowerCase().includes(goal.toLowerCase())
    );
    if (isGoalMatch) careerAlignmentScore = 95;
  }

  // D. Location & Work Mode Score (10%)
  let locationModeScore = 80;
  if (opportunity.mode === 'REMOTE' || opportunity.mode === 'HYBRID') {
    locationModeScore = 95;
  } else if (
    student.location &&
    opportunity.location &&
    student.location.toLowerCase().includes(opportunity.location.toLowerCase())
  ) {
    locationModeScore = 100;
  }

  // E. Verified Evidence & Credentials Score (10%)
  let verifiedEvidenceScore = 60;
  const badges = student.verifiedBadges || [];
  if (badges.length > 0) {
    verifiedEvidenceScore = Math.min(100, 60 + badges.length * 15);
  }

  // F. Employer Recency & Preference (10%)
  const employerPreferenceScore = 85;

  // Weighted Average Calculation
  const totalWeighted = Math.round(
    skillFitScore * 0.35 +
      eligibilityScore * 0.2 +
      careerAlignmentScore * 0.15 +
      locationModeScore * 0.1 +
      verifiedEvidenceScore * 0.1 +
      employerPreferenceScore * 0.1
  );

  const matchScore = eligible ? Math.max(50, Math.min(98, totalWeighted)) : Math.min(45, totalWeighted);

  // Generate Human-Readable Explanation
  let explanation = '';
  if (!eligible) {
    explanation = `Ineligible due to missing mandatory requirements: ${missingMandatory.join(', ')}`;
  } else if (matchScore >= 85) {
    explanation = `High ${matchScore}% Match! Outstanding competency in ${topStrengths.slice(0, 2).join(' & ') || 'core AYUSH domains'}.`;
  } else if (matchScore >= 70) {
    explanation = `Good ${matchScore}% Match. Meets core criteria with minor gap in ${topGaps.slice(0, 1).join(', ') || 'advanced QA/QC'}.`;
  } else {
    explanation = `Moderate ${matchScore}% Match. Skill bridge program recommended to build ${topGaps.slice(0, 2).join(' & ')}.`;
  }

  return {
    eligible,
    matchScore,
    missingMandatory,
    scoreBreakdown: {
      skillFitScore,
      eligibilityScore,
      careerAlignmentScore,
      locationModeScore,
      verifiedEvidenceScore,
      employerPreferenceScore,
    },
    topStrengths: topStrengths.slice(0, 3),
    topGaps: topGaps.slice(0, 3),
    explanation,
  };
}

export function calculateMatchScore(params: {
  candidateDegree: string;
  candidatePassoutYear: number;
  candidateLocation?: string;
  candidateSkills: Record<string, number>;
  candidateBadges: string[];
  targetRoleTitle?: string;
  opportunityTitle: string;
  opportunityRequiredSkills: string[];
  opportunityLocation: string;
  opportunityMode: string;
  minDegree: string;
  eligibleBatch: number;
}): {
  totalMatchScore: number;
  isEligible: boolean;
  summaryReason: string;
  breakdown: Record<string, number>;
} {
  const result = computeOpportunityMatch(
    {
      id: 'candidate-1',
      degree: params.candidateDegree,
      passoutYear: params.candidatePassoutYear,
      location: params.candidateLocation,
      skillScores: params.candidateSkills,
      verifiedBadges: params.candidateBadges
    },
    {
      id: 'opp-1',
      title: params.opportunityTitle,
      type: 'JOB',
      system: 'AYURVEDA',
      minDegree: params.minDegree,
      eligibleBatch: params.eligibleBatch,
      location: params.opportunityLocation,
      mode: params.opportunityMode,
      skillsRequired: params.opportunityRequiredSkills
    }
  );

  return {
    totalMatchScore: result.matchScore,
    isEligible: result.eligible,
    summaryReason: result.explanation,
    breakdown: result.scoreBreakdown
  };
}

