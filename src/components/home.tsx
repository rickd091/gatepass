import React from "react";
import DashboardHeader from "./layout/DashboardHeader";
import RequestForm from "./asset-request/RequestForm";
import RequestStatus from "./asset-request/RequestStatus";
import RequestList from "./asset-request/RequestList";

interface HomeProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const Home = ({
  user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
}: HomeProps) => {
  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="pt-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            KMA Asset Gate Pass Request
          </h1>
          <p className="mt-2 text-gray-600">
            Submit a request for asset movement across KMA facilities
          </p>
        </div>

        <div className="mb-8">
          <RequestList />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <RequestForm onSubmit={handleFormSubmit} />
          </div>
          <div className="lg:w-[300px]">
            <RequestStatus />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
