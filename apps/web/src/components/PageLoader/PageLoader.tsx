import { LoadingSpinner } from "../ui/loading-spinner";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner />
    </div>
  );
}
