import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DurationStepProps {
  onNext?: () => void;
  onBack?: () => void;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange?: (date: Date) => void;
  onEndDateChange?: (date: Date) => void;
}

const DurationStep = ({
  onNext = () => {},
  onBack = () => {},
  startDate = new Date(),
  endDate = new Date(),
  onStartDateChange = () => {},
  onEndDateChange = () => {},
}: DurationStepProps) => {
  return (
    <Card className="w-full p-6 bg-white">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Set Duration</h2>
          <p className="text-gray-500">
            Please specify when you need the asset and when you'll return it
          </p>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && onStartDateChange(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">Return Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && onEndDateChange(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Return Confirmation Required</Label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="checkbox"
                id="requireReturnConfirmation"
                className="h-4 w-4 text-blue-600"
                onChange={(e) => onReturnConfirmationChange?.(e.target.checked)}
              />
              <Label
                htmlFor="requireReturnConfirmation"
                className="text-sm text-gray-600"
              >
                Asset return must be confirmed by department head
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Input
              id="notes"
              placeholder="Any special requirements or notes about the duration"
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </div>
    </Card>
  );
};

export default DurationStep;
