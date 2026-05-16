"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DatePickerProps {
  value?: string | Date
  onChange?: (val: string) => void
  withTime?: boolean
}

export function DatePicker({ value, onChange, withTime = false }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [time, setTime] = React.useState<string>(
    value && withTime ? format(new Date(value), "HH:mm") : "00:00"
  )

  // Sync incoming value
  React.useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setDate(d);
        if (withTime) {
          setTime(format(d, "HH:mm"));
        }
      }
    }
  }, [value, withTime]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate && onChange) {
      if (withTime) {
        const [hours, minutes] = time.split(':');
        const newDate = new Date(selectedDate);
        newDate.setHours(parseInt(hours || '0', 10));
        newDate.setMinutes(parseInt(minutes || '0', 10));
        // Return local ISO string without Z to match standard datetime-local format
        onChange(format(newDate, "yyyy-MM-dd'T'HH:mm"));
      } else {
        onChange(format(selectedDate, "yyyy-MM-dd"));
      }
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (date && onChange) {
      const [hours, minutes] = newTime.split(':');
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours || '0', 10));
      newDate.setMinutes(parseInt(minutes || '0', 10));
      onChange(format(newDate, "yyyy-MM-dd'T'HH:mm"));
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-white",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            withTime ? format(date, "PPP p") : format(date, "PPP")
          ) : (
            <span>Pilih tanggal</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
        />
        {withTime && (
          <div className="p-3 border-t flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input 
              type="time" 
              value={time} 
              onChange={handleTimeChange} 
              className="flex-1"
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
