import { FC } from "react";

// Define the props for the component
interface OrganizationPageProps {
  params: {
    orgId: string;
  };
}

const OrganizationPage: FC<OrganizationPageProps> = async ({ params }) => {
  const { orgId } = params;
  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title pb-2">
          {orgId}
        </h1>
      </div>
    </div>
  );
};

export default OrganizationPage;
