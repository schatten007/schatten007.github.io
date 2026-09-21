import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    category: z.enum(['Automation', 'Developer tools', 'Data systems', 'Systems']),
    tags: z.array(z.string()),
    date: z.coerce.date(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    status: z.string().default('Public repository'),
    repo: z.url(),
    source: z.url(),
    visual: z.enum(['tailor', 'sentinel', 'observatory', 'generic']).default('generic'),
    accent: z.enum(['lime', 'lavender', 'peach']).default('lime'),
    evidence: z.string(),
    evidenceLabel: z.string(),
    takeaway: z.string(),
    architecture: z.array(z.object({ title: z.string(), detail: z.string() })).min(2),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    readingTime: z.string(),
    draft: z.boolean().default(false),
    relatedProject: z.string().optional(),
  }),
});

export const collections = { projects, notes };
