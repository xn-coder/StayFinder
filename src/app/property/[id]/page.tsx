import { PropertyDetails } from "@/components/property-details";

export default function PropertyPage({ params }: { params: { id: string } }) {
  return <PropertyDetails propertyId={params.id} />;
}
