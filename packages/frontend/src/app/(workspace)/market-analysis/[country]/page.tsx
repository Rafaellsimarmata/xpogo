import { cache } from "react";
import { notFound } from "next/navigation";
import CountryDetail from "@/src/components/market/CountryDetail";
import DocumentChecklist from "@/src/components/market/DocumentChecklist";
import StoreSelector from "@/src/components/market/StoreSelector";
import { generateChecklist, checklistCompletion } from "@/src/lib/data/documents";
import { fetchCountries } from "@/src/services/countryService";

const getCountries = cache(async () => {
  try {
    return await fetchCountries();
  } catch (error) {
    console.error("Failed to fetch countries", error);
    return [];
  }
});

const getCountryBySlug = cache(async (slug: string) => {
  const list = await getCountries();
  return list.find((country) => country.id === slug);
});

type CountryPageProps = {
  params: {
    country: string;
  };
};

export const generateStaticParams = async () => {
  const countryList = await getCountries();
  return countryList.map((country) => ({
    country: country.id,
  }));
};

const CountryPage = async ({ params }: CountryPageProps) => {
  const country = await getCountryBySlug(params.country);

  if (!country) {
    notFound();
  }

  const checklist = generateChecklist("kopi", country.id);
  const unlocked = checklistCompletion(checklist) >= 90;

  return (
    <section className="bg-gradient-to-b from-white to-blue-50/40 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6">
        <CountryDetail country={country} />
        <DocumentChecklist
          documents={checklist}
          title={`Checklist dokumen untuk ${country.name}`}
          description="Daftar persyaratan yang wajib dipenuhi sebelum proses pengiriman berlangsung."
        />
        <StoreSelector stores={country.stores ?? []} unlocked={unlocked} />
      </div>
    </section>
  );
};

export default CountryPage;
