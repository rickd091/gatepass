import React, { useState } from "react";
import DashboardHeader from "./layout/DashboardHeader";
import RequestStepper from "./asset-request/RequestStepper";
import RequestForm from "./asset-request/RequestForm";
import RequestStatus from "./asset-request/RequestStatus";

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
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

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
          <RequestStepper
            steps={[
              {
                label: "Asset Details",
                completed: currentStep > 0,
                current: currentStep === 0,
              },
              {
                label: "Purpose",
                completed: currentStep > 1,
                current: currentStep === 1,
              },
              {
                label: "Duration",
                completed: currentStep > 2,
                current: currentStep === 2,
              },
              {
                label: "Review",
                completed: currentStep > 3,
                current: currentStep === 3,
              },
            ]}
            onStepClick={handleStepClick}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <RequestForm
              initialStep={currentStep}
              onSubmit={handleFormSubmit}
            />
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
