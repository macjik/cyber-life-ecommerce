'use server';

import { ContentForm } from '@/app/Components/content-form';

export default async function AdminCMSPage({ searchParams }) {
  const { company } = searchParams;
  return <ContentForm company={company && company} />;
}
