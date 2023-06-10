import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface MyDatePickerProps {
  selected: Date | null;
  onChange: (date: Date, id: string) => void;
  userId: string;
}

const MyDatePicker: React.FC<MyDatePickerProps> = ({ selected, onChange, userId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(selected);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onChange(date, userId);
  };

  const now = new Date(); // Get current date and time
  now.setMilliseconds(0); // Reset milliseconds to avoid precision issues

  return (
    <div className="datepicker-container">
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date) => handleDateChange(date)}
        dateFormat="yyyy-MM-dd HH:mm"
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Time"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        minDate={now}
      />
    </div>
  );
};

export default MyDatePicker;

