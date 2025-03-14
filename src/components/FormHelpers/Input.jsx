import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatISO } from "date-fns";

const Input = ({
  id,
  type = "text",
  placeholder,
  disabled,
  register,
  required,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Funcția pentru a deschide widget-ul când inputul este clicat
  const handleInputClick = () => {
    if (type === "datetime-local") {
      setOpen(true); // Deschide widget-ul dacă tipul este datetime-local
    }
  };

  // Funcția pentru a gestiona schimbarea datei selectate
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      document.getElementById(id).value = formatISO(date).slice(0, 16);
    }
    setOpen(false); // Închide widget-ul după selecție
  };

  return (
    <input
      id={id}
      type={type}
      className="text-[#000] border bg-white border-[#1151f2] h-[54px] block w-full py-[5px] px-[25px] focus:outline-none placeholder-[#000]"
      placeholder={placeholder}
      {...register(id, { required })}
      disabled={disabled}
      required={required}
    />
  );
};

export default Input;
