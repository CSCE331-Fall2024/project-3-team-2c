import * as React from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { CalendarIcon } from "lucide-react";
import { type SelectSingleEventHandler } from "react-day-picker";
import { type Dispatch, type SetStateAction } from "react";

interface DatePickerProps {
  dateValue: Date;
  setDateFunction: Dispatch<SetStateAction<Date>>;
}

/**
 * DatePicker Component
 * 
 * A reusable date picker component that allows users to select a single date.
 * 
 * @param {Date | undefined} dateValue - The currently selected date. If undefined, no date is selected.
 * @param {(date: Date | undefined) => void} setDateFunction - Callback function to update the selected date.
 * 
 * @returns {JSX.Element} The rendered DatePicker component.
 */

export function DatePicker({ dateValue, setDateFunction }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !dateValue && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={setDateFunction as SelectSingleEventHandler}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
