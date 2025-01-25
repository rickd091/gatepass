import React from "react";
import { Check } from "lucide-react";

interface StepperProps {
  steps?: Array<{
    label: string;
    completed: boolean;
    current: boolean;
  }>;
  onStepClick?: (index: number) => void;
}

const RequestStepper = ({
  steps = [
    { label: "Asset Details", completed: true, current: false },
    { label: "Purpose", completed: false, current: true },
    { label: "Duration", completed: false, current: false },
    { label: "Security", completed: false, current: false },
    { label: "Review", completed: false, current: false },
  ],
  onStepClick = () => {},
}: StepperProps) => {
  return (
    <div className="w-full max-w-[800px] bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => onStepClick(index)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step.completed
                    ? "bg-green-600 border-green-600 text-white"
                    : step.current
                      ? "border-blue-600 text-blue-600"
                      : "border-gray-300 text-gray-300"
                }`}
              >
                {step.completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-sm ${
                  step.current ? "text-blue-600 font-medium" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 ${
                  step.completed ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RequestStepper;
