import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-center h-screen">
      <Loader className="animate-spin" />
    </div>
  );
}
