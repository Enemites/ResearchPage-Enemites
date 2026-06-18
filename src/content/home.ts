export interface StatItem {
  id: string;
  value: number;
  label: string;
  sublabel: string;
}

export interface ResearchPaper {
  id: string;
  category: string;
  title: string;
  author?: string;
  abstract: string;
  tags: string[];
  metaIcon: string;
  metaText: string;
  href?: string;
  ctaLabel: string;
  disabled?: boolean;
}

export interface BenchmarkItem {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  metricValue: string;
  metricUnit: string;
  barClass: string;
  barWidth: string;
  status: string;
}

export interface MethodologyStep {
  step: string;
  title: string;
  description: string;
}

export const stats: StatItem[] = [
  {
    id: 'stat-papers',
    value: 0,
    label: 'Published Papers',
    sublabel: 'First papers are on the way',
  },
  {
    id: 'stat-references',
    value: 0,
    label: 'Public References',
    sublabel: 'Citation corpus pending publication',
  },
  {
    id: 'stat-benchmarks',
    value: 0,
    label: 'Published Benchmarks',
    sublabel: 'Benchmark reports not public yet',
  },
  {
    id: 'stat-domains',
    value: 0,
    label: 'Public Domains',
    sublabel: 'Research areas pending publication',
  },
];

export const researchPapers: ResearchPaper[] = [];

export const benchmarks: BenchmarkItem[] = [
  {
    id: 'benchmark-cognitive',
    number: '01',
    label: 'Core Metric',
    title: 'Cognitive Performance Index',
    description:
      'Composite score measuring problem-solving speed, pattern recognition accuracy, and multi-step reasoning across standardized cognitive tasks.',
    metricValue: '--',
    metricUnit: 'Data not available',
    barClass: 'benchmark-card__bar-fill--purple',
    barWidth: '0%',
    status: 'Data collection pending; baseline setup in progress',
  },
  {
    id: 'benchmark-speed',
    number: '02',
    label: 'Efficiency Metric',
    title: 'Learning Acquisition Rate',
    description:
      'Speed at which users acquire and demonstrate mastery of new cognitive patterns, measured by task accuracy over sessions.',
    metricValue: '--',
    metricUnit: 'Data not available',
    barClass: 'benchmark-card__bar-fill--cyan',
    barWidth: '0%',
    status: 'Awaiting user cohort data; measurement pipeline staged',
  },
  {
    id: 'benchmark-retention',
    number: '03',
    label: 'Reliability Metric',
    title: 'User Retention Rate',
    description:
      'Percentage of users who consistently return and maintain active participation across defined time windows after initial onboarding.',
    metricValue: '--',
    metricUnit: 'Data not available',
    barClass: 'benchmark-card__bar-fill--green',
    barWidth: '0%',
    status: 'Retention study not started; dataset unavailable',
  },
  {
    id: 'benchmark-completion',
    number: '04',
    label: 'Execution Metric',
    title: 'Completion Rate',
    description:
      'Share of assigned cognitive activities completed end-to-end by users, tracked across sessions to evaluate training consistency.',
    metricValue: '--',
    metricUnit: 'Data not available',
    barClass: 'benchmark-card__bar-fill--amber',
    barWidth: '0%',
    status: 'Completion benchmark setup in progress; awaiting cohort data',
  },
  {
    id: 'benchmark-focus',
    number: '05',
    label: 'Attention Metric',
    title: 'Focus Rate',
    description:
      'User focus endurance measured through sustained attention signals such as uninterrupted task streaks, distraction drops, and session stability.',
    metricValue: '--',
    metricUnit: 'Data not available',
    barClass: 'benchmark-card__bar-fill--blue',
    barWidth: '0%',
    status: 'Focus endurance analysis pipeline staged for rollout',
  },
];

export const methodologySteps: MethodologyStep[] = [
  {
    step: 'Step 01',
    title: 'Literature Review & Publication',
    description:
      'Every research initiative starts with a comprehensive review of peer-reviewed literature. We produce citation-mapped publications with traceable references from credible venues, then publish them as our scientific foundation.',
  },
  {
    step: 'Step 02',
    title: 'Internal Data Collection',
    description:
      "We instrument NovaX's platform to collect anonymized behavioral and performance data. Metrics include task completion rates, error patterns, session engagement, and cognitive load proxies, all collected with IRB-equivalent ethical standards.",
  },
  {
    step: 'Step 03',
    title: 'Statistical Analysis & Validation',
    description:
      'Collected data undergoes rigorous statistical analysis including significance testing, effect size estimation, and cross-validation across user cohorts. We use pre-registered analysis plans to prevent p-hacking.',
  },
  {
    step: 'Step 04',
    title: 'Benchmark Reporting & Iteration',
    description:
      'We report benchmark outcomes as processed performance summaries and use the findings to guide continuous product iteration across cohorts and use cases.',
  },
];
