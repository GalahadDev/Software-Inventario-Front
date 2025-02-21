import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "lucide-react";

interface SearchBarProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

export function SearchDate({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: SearchBarProps) {
  return (
    <div className="mb-6 flex space-x-4">
      <div className="relative">
        <DatePicker
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Fecha De Inicio"
          className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-500 focus:outline-none focus:ring"
        />
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="relative">
        <DatePicker
          selected={endDate}
          onChange={onEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || undefined} 
          placeholderText="Fecha De Termino"
          className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-500 focus:outline-none focus:ring"
        />
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}
