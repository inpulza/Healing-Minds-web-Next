import {
  BLOG_PILLAR_WEIGHTS,
  type BlogContentFormat,
  type BlogContentPillar,
  type BlogPatientStage,
} from "../strategy/healing-minds";

export type TopicScoreBreakdown = {
  novelty: number;
  clusterOpportunity: number;
  pillarPriority: number;
  categoryRotation: number;
  stageGap: number;
  formatDiversity: number;
  curatedResearchCoverage: number;
  penalties: {
    listicle: number;
    repeatedCategory: number;
    repeatedPillar: number;
    repeatedFormat: number;
  };
  total: number;
};

export function scoreTopicCandidate(input: {
  overlapScore: number;
  clusterCount: number;
  maxClusterCount: number;
  pillar: BlogContentPillar;
  recentCategoryKeys: string[];
  categoryKey: string;
  recentPillars: string[];
  recentFormats: string[];
  patientStage: BlogPatientStage;
  missingStages: BlogPatientStage[];
  contentFormat: BlogContentFormat;
  curatedSourceCount: number;
  riskyListicle: boolean;
}): TopicScoreBreakdown {
  const novelty = Math.round(Math.max(0, 1 - input.overlapScore) * 40);
  const clusterOpportunity = input.maxClusterCount === 0
    ? 18
    : Math.round((1 - (input.clusterCount / Math.max(1, input.maxClusterCount))) * 18);
  const pillarPriority = Math.round((BLOG_PILLAR_WEIGHTS[input.pillar] / 22) * 15);
  const categoryRotation = input.recentCategoryKeys[0] === input.categoryKey ? 3 : 10;
  const stageGap = input.missingStages.includes(input.patientStage) ? 8 : 3;
  const formatDiversity = input.recentFormats.includes(input.contentFormat) ? 2 : 5;
  const curatedResearchCoverage = Math.min(4, input.curatedSourceCount);
  const penalties = {
    listicle: input.riskyListicle ? -15 : 0,
    repeatedCategory: input.recentCategoryKeys.length >= 2
      && input.recentCategoryKeys.slice(0, 2).every(key => key === input.categoryKey) ? -8 : 0,
    repeatedPillar: input.recentPillars.length >= 2
      && input.recentPillars.slice(0, 2).every(pillar => pillar === input.pillar) ? -8 : 0,
    repeatedFormat: input.recentFormats.length >= 3
      && input.recentFormats.slice(0, 3).every(format => format === input.contentFormat) ? -6 : 0,
  };
  const total = Math.max(0, Math.min(100, Math.round(
    novelty
      + clusterOpportunity
      + pillarPriority
      + categoryRotation
      + stageGap
      + formatDiversity
      + curatedResearchCoverage
      + Object.values(penalties).reduce((sum, value) => sum + value, 0),
  )));
  return {
    novelty,
    clusterOpportunity,
    pillarPriority,
    categoryRotation,
    stageGap,
    formatDiversity,
    curatedResearchCoverage,
    penalties,
    total,
  };
}
