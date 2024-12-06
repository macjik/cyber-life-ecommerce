'use server';

import { ContentForm } from '@/app/Components/content-form';

//save image appropriately and then retrieve it as so
//add custom categories

export default async function AdminCMSPage({ searchParams }) {
  const { company } = searchParams;
  return <ContentForm company={company && company} />;
}
