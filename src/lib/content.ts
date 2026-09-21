import { getCollection } from 'astro:content';

export async function getProjects() {
  return (await getCollection('projects', ({ data }) => !data.draft)).sort(
    (a, b) => a.data.order - b.data.order || b.data.date.getTime() - a.data.date.getTime(),
  );
}

export async function getNotes() {
  return (await getCollection('notes', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}
