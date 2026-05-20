import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    order: z.number().optional(),
    connected_project: z.string().optional(),
  }),
});

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    project: z.enum([
      'scholion',
      'notice',
      'thbrdy-dev',
      'pop-ai',
      'silicon-golem',
      'editorial',
      'pre-pando',
      'other',
    ]),
    shape: z.enum([
      'design-decision',
      'failure-mode',
      'problem-and-method',
      'star-with-design-decision',
      'outcome-reframe',
    ]),
    agentRelevance: z.enum(['agent', 'partial', 'adjacent']),
    tagline: z.string().max(80),
    questions: z.array(z.string()).min(1).max(3),
    handles: z.array(z.string()).min(1).max(3),
  }),
});

export const collections = { writing, stories };
