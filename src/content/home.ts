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
    id: 'stat-references',
    value: 81,
    label: 'Peer-Reviewed References',
    sublabel: 'Nature, NeurIPS, Cell, PNAS, ICML',
  },
  {
    id: 'stat-domains',
    value: 8,
    label: 'Research Domains',
    sublabel: 'Neuroscience, AI, Cognition & more',
  },
  {
    id: 'stat-studies',
    value: 5,
    label: 'Published Benchmarks',
    sublabel: 'Validated benchmark reports completed',
  },
  {
    id: 'stat-metrics',
    value: 2,
    label: 'Published Research Papers',
    sublabel: 'Syntheses & technical preprints published',
  },
];

export const researchPapers: ResearchPaper[] = [
  {
    id: 'paper-sprint-lp',
    category: 'Technical Preprint',
    title: 'SPRINT-LP: GPU-Native Local Plasticity with Hard-Isolated Parallel Streams',
    author: 'Enemites Research Team · M.D. Nafis',
    abstract:
      'Formally proved in Lean 4 and empirically validated on Kaggle NVIDIA T4x2 silicon, SPRINT-LP refutes GPU incompatibility of local plasticity and hard-isolated parallel streams: -79.0% activation VRAM and 11.5% faster single-GPU execution, 0.79x Iso-Width latency with 1.28x energy efficiency, 2.47x 2-GPU zero-bubble speedup, and zero accuracy loss on AffCIFAR-10 v2.',
    tags: ['Local Plasticity', 'CUDA Graphs', 'Lean 4', 'Multi-GPU', 'Parallel Streams'],
    metaIcon: 'REF',
    metaText: '15 references · Lean 4 + T4x2',
    href: '/papers/sprint-lp/',
    ctaLabel: 'Read technical preprint',
  },
  {
    id: 'paper-ai-cognitive',
    category: 'Evidence-Backed Synthesis',
    title: 'AI Cognitive Replication',
    author: 'Created by Nafis',
    abstract:
      'An evidence-backed synthesis of current AI capabilities in cognitive replication, brain functions not yet replicated, neuroscientific gaps, and the principles required to narrow the gap between artificial and biological intelligence.',
    tags: ['Transformers', 'Neuroscience', 'Continual Learning', 'Causal Reasoning', 'Symbol Grounding'],
    metaIcon: 'REF',
    metaText: '66 references',
    href: '/papers/ai-cognitive-replication/',
    ctaLabel: 'Read evidence-backed synthesis',
  },
  {
    id: 'paper-cognitive-load',
    category: 'Evidence-Backed Synthesis',
    title: 'Cognitive Load Optimization Through Adaptive Interface Design',
    abstract:
      'Investigation into how dynamic interface complexity affects working memory utilization and task completion rates. Measuring real-time cognitive load via behavioral proxies across NovaX user sessions.',
    tags: ['Working Memory', 'UX Research', 'Cognitive Load', 'Adaptive UI'],
    metaIcon: 'LAB',
    metaText: 'In Progress',
    ctaLabel: 'Coming Soon',
    disabled: true,
  },
  {
    id: 'paper-flow-state',
    category: 'Evidence-Backed Synthesis',
    title: 'Flow State Induction & Sustained Attention in Digital Environments',
    abstract:
      "Examining the neural and behavioral correlates of flow states within NovaX's gamified cognitive training paradigm. Analysis of session duration, error patterns, and self-reported engagement metrics.",
    tags: ['Flow State', 'Attention', 'Gamification', 'Engagement'],
    metaIcon: 'LAB',
    metaText: 'In Progress',
    ctaLabel: 'Coming Soon',
    disabled: true,
  },
];

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
    title: 'Scientific Synthesis & Publication',
    description:
      'Every research initiative starts with a comprehensive review of peer-reviewed literature. We produce citation-mapped scientific syntheses with traceable references from venues like Nature, Science, NeurIPS, and Cell, then publish them as our scientific foundation.',
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
