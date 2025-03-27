import { ReactNode, Suspense } from "react";
import { BarLoader } from "react-spinners";

export default async function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto">
      <Suspense fallback={<BarLoader width={"100%"} color="#36d7b7" />}>
        {children}
      </Suspense>
    </div>
  );
}