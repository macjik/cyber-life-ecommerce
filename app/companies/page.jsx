'use server';

import db from '@/models/index';
import Image from '@/node_modules/next/image';
import Link from '@/node_modules/next/link';
import { DeleteCompany, EditCompany } from '../Components/content-form';

const { User, Company } = db;

export default async function Companies({ searchParams }) {
  const { id } = searchParams;
  let isAdmin = await User.findOne({ where: { sub: id } });

  if (isAdmin.role !== 'admin') {
    return <>Unauthorized!</>;
  }

  let companies = await Company.findAll({
    attributes: ['id', 'name', 'description', 'slogan', 'logo'],
  });

  companies = companies.map((company) => company.dataValues);

  return (
    <div className="w-full min-h-screen flex flex-col p-6 mt-16">
      <header className="mb-8 self-center">
        <h1 className="text-3xl font-bold text-gray-800">Companies Dashboard</h1>
        <p className="text-gray-600">Manage and view all registered companies.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <Link href={`/?shop=${company.id}`}>
              <div className="w-full h-40 bg-gray-200 border-gray-300 border-b">
                <Image
                  src={company.logo}
                  width={256}
                  height={256}
                  alt={`${company.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <div className="p-4 flex flex-col justify-between flex-grow">
              <h2 className="text-lg font-semibold text-gray-800">Name: {company.name}</h2>
              <p className="text-gray-600 text-sm mt-2 font-semibold">
                Description: {company.description}
              </p>
              <p className="text-gray-600 text-sm mt-2">Slogan:{company.slogan}</p>
            </div>
            <EditCompany
              id={company.id}
              name={company.name}
              description={company.description}
              slogan={company.slogan}
              logo={company.logo}
            />
            <DeleteCompany id={company.id} />
          </div>
        ))}
      </section>
    </div>
  );
}
