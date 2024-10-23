'use server';

export default async function InvitePage(props) {
  const searchParams = await props.searchParams;
  return <>{JSON.stringify(searchParams)}</>;
}
