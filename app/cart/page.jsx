'use server';

export default async function CartPage({searchParams}) {
    return <>{JSON.stringify(searchParams)}</>
}