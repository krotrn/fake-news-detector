import ArchivePage from "@/components/archive-ui";
import { fetchArchivedNews } from "@/services/archive";

export default async function Page() {
  const data = await fetchArchivedNews();
  return <ArchivePage archives={data} />;
}
