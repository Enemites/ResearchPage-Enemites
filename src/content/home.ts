export interface StatItem {
  id: string;
  value: number;
  displayValue?: string;
  label: string;
  sublabel: string;
}

export interface PaperHighlight {
  label: string;
  value: string;
}

export interface ResearchPaper {
  id: string;
  category: string;
  date?: string;
  title: string;
  author?: string;
  abstract: string;
  tags: string[];
  metaIcon: string;
  metaText: string;
  highlights?: PaperHighlight[];
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
    id: 'stat-vram',
    value: 79,
    displayValue: '-79.0%',
    label: 'Peak Activation VRAM',
    sublabel: 'K = 6 local blocks vs. Global BP on 1 GPU',
  },
  {
    id: 'stat-speedup',
    value: 247,
    displayValue: '2.47x',
    label: '2-GPU Async Speedup',
    sublabel: 'Zero-bubble pipeline on Kaggle NVIDIA T4x2',
  },
  {
    id: 'stat-iterations',
    value: 5,
    displayValue: 'v1-v5',
    label: 'Falsification Cycles',
    sublabel: 'Every component tested against strict kill criteria',
  },
  {
    id: 'stat-papers',
    value: 1,
    displayValue: '01',
    label: 'Published Preprint',
    sublabel: 'Formally proved in Lean 4 + silicon verified',
  },
];

export const researchPapers: ResearchPaper[] = [
  {
    id: 'paper-sprint-lp',
    category: 'Technical Preprint',
    date: 'November 25, 2026',
    title: 'SPRINT-LP: GPU-Native Local Plasticity with Hard-Isolated Parallel Streams',
    author: 'Enemites Research Team · M.D. Nafis',
    abstract:
      'Formal Lean 4 proofs and Kaggle NVIDIA T4x2 empirical validation refuting GPU incompatibility of local plasticity and hard-isolated parallel streams.',
    tags: ['Local Plasticity', 'Lean 4', 'CUDA Graphs', 'Multi-GPU', 'Parallel Streams'],
    metaIcon: 'PROOF',
    metaText: '15 references · Lean 4 + T4x2',
    highlights: [
      { label: 'Single-GPU VRAM', value: '-79.0% (159.2 MB)' },
      { label: '2-GPU Speedup', value: '2.47x Zero-Bubble' },
      { label: 'Orthogonality', value: 'CKA = 0.057' },
    ],
    href: '/papers/sprint-lp/',
    ctaLabel: 'Read technical preprint',
  },
];

export const benchmarks: BenchmarkItem[] = [
  {
    id: 'benchmark-vram',
    number: '01',
    label: 'Memory Law (Theorem 2A)',
    title: 'Single-GPU Activation VRAM Cut',
    description:
      'Partitioning an identical 12-layer network from K = 1 (Global BP) to K = 6 eager local blocks cuts peak activation memory from 758.1 MB to 159.2 MB while running 11.5% faster via L2 cache locality.',
    metricValue: '-79.0%',
    metricUnit: '758.1 -> 159.2 MB',
    barClass: 'benchmark-card__bar-fill--clay',
    barWidth: '79%',
    status: 'Verified on NVIDIA T4 (CF-2 rebound 3.45x confirmed)',
  },
  {
    id: 'benchmark-pipeline',
    number: '02',
    label: 'Multi-GPU Scaling (Theorem 3)',
    title: 'Zero-Bubble Async T4x2 Speedup',
    description:
      'Eliminating cross-stage backward locks via local plasticity and FP16 ping-pong buffers cuts 2-GPU step latency from 41.82 ms (synchronous Global BP) down to 16.96 ms.',
    metricValue: '2.47x',
    metricUnit: '16.96 vs. 41.82 ms/step',
    barClass: 'benchmark-card__bar-fill--ink',
    barWidth: '88%',
    status: 'Verified on Kaggle T4x2 (CF-3 bubble counterfactual)',
  },
  {
    id: 'benchmark-energy',
    number: '03',
    label: 'Roofline Efficiency (Theorem 2B)',
    title: 'Iso-Width Energy & Latency Gain',
    description:
      'Packing parallel streams into contiguous cuBLAS batched GEMMs with whole-step CUDA Graphs delivers 0.73-0.79x latency and up to 1.39x samples/Joule measured via NVML hardware counters.',
    metricValue: '1.39x',
    metricUnit: 'samples/Joule at d = 256',
    barClass: 'benchmark-card__bar-fill--clay',
    barWidth: '73%',
    status: 'Verified via NVML hardware energy counters',
  },
  {
    id: 'benchmark-orthogonality',
    number: '04',
    label: 'Representation Quality',
    title: 'Stream Orthogonality & Pose R2',
    description:
      'On parameter-matched AffCIFAR-10 v2 (1.26M vs. 1.31M params), live 2-GPU async training incurs zero accuracy loss (77.58% vs. 77.19% 1-GPU) and surpasses Global BP on pose regression (+0.325 vs. +0.318 R2).',
    metricValue: '0.057',
    metricUnit: 'CKA (94.3% orthogonal)',
    barClass: 'benchmark-card__bar-fill--sage',
    barWidth: '94%',
    status: 'Verified on AffCIFAR-10 v2 (30 epochs, 2-GPU async)',
  },
];

export const methodologySteps: MethodologyStep[] = [
  {
    step: '01 / Formal',
    title: 'First-Principles Proof in Lean 4',
    description:
      'Before writing training loops, we formalize isolation, memory bounds, roofline laws, and pipeline utilization in pure Lean 4 with zero sorry and cross-check every bound symbolically.',
  },
  {
    step: '02 / Silicon',
    title: 'Hardware-Native Kernel Design',
    description:
      'We align biological and algorithmic primitives directly to GPU memory hierarchies—replacing fragmented kernels with batched Tensor Core GEMMs, static FP16, and whole-step CUDA Graphs.',
  },
  {
    step: '03 / Falsification',
    title: 'Counterfactual Kill Criteria',
    description:
      'Every claim is stress-tested by deliberately breaking its governing mechanism on live hardware (CF-1 through CF-4). Components that fail strict memory, speed, or learning gates are rejected.',
  },
  {
    step: '04 / Applied',
    title: 'Translation into Realms',
    description:
      'Verified architectures feed directly into Realms—Enemites’ AI world model and adaptive simulation platform—so product capability is grounded in reproducible scientific evidence.',
  },
];
