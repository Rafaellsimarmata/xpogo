import { notFound } from "next/navigation";
import CountryDetail from "@/src/components/market/CountryDetail";
import DocumentChecklist from "@/src/components/market/DocumentChecklist";
import StoreSelector from "@/src/components/market/StoreSelector";
import { countries, getCountryById } from "@/src/lib/data/countries";
import { generateChecklist, checklistCompletion } from "@/src/lib/data/documents";

type CountryPageProps = {
  params: {
    country: string;
  };
};

export const generateStaticParams = async () =>
  countries.map((country) => ({
    country: country.id,
  }));

const CountryPage = ({ params }: CountryPageProps) => {
  const country = getCountryById(params.country);

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
        <StoreSelector stores={country.stores} unlocked={unlocked} />
      </div>
    </section>
  );
};

export default CountryPage;
