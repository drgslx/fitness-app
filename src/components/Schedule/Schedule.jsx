"use client";

import React, { useState } from "react";
import ScheduleAnnouncement from "../scheduleAnnouncement/ScheduleAnnouncement";

const Schedule = ({ isAdmin, schedule, announcements }) => {
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [newData, setNewData] = useState({
    time: "",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  });

  const handleChange = (field, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this schedule?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/schedule/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Failed to delete schedule: ${errorResponse.message}`);
      }

      alert("Schedule deleted successfully!");
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      alert(`Failed to delete schedule: ${error.message}`);
    }
  };

  const handleEditClick = (rowIndex) => {
    setEditingRowIndex(rowIndex);
    setEditData(schedule[rowIndex]);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`/api/schedule/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Failed to update schedule: ${errorResponse.message}`);
      }

      alert("Schedule updated successfully!");
    } catch (error) {
      console.error("Failed to update schedule:", error);
      alert(`Failed to update schedule: ${error.message}`);
    }

    setEditingRowIndex(null);
  };

  const handleAddClick = async () => {
    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Failed to create schedule: ${errorResponse.message}`);
      }

      alert("New schedule entry added successfully!");
    } catch (error) {
      console.error("Failed to create schedule:", error);
      alert("Failed to create schedule.");
    }

    setNewData({
      time: "",
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
      Saturday: "",
    });
  };

  return (
    <div data-aos="fade-up"
    data-aos-duration="500"
    data-aos-once="true" className="py-10 w-full bg-black" id="schedule">
      <div className="container mx-auto px-2">
        {/* Desktop/Table View */}
        <div className="hidden md:block relative overflow-x-auto w-full">
        
          <table className="min-w-full bg-white table-fixed border-collapse shadow-md">
            <thead>
              <tr className="bg-[#C84B2F] text-white">
                <th className="py-3 px-2 sm:px-2 text-center w-1/6 sm:w-1/7">Ora</th>
                <th className="py-3 px-2 sm:px-2 text-center w-1/6 sm:w-1/7">Lunedì</th>
                <th className="py-3 px-2 sm:px-2 text-center w-1/6 sm:w-1/7">Martedì</th>
                <th className="py-3 px-2 sm:px-2 text-center w-1/6 sm:w-1/7">Mercoledì</th>
                <th className="py-3 px-2 sm:px-2 text-center w-1/6 sm:w-1/7">Giovedì</th>
                <th className="py-3 px-2 sm:px-2 text-center w-1/6 sm:w-1/7">Venerdì</th>
                <th className="py-3 px-2 sm:px-2 text-center w-1/6 sm:w-1/7">Sabato</th>
                {isAdmin && <th className="py-3 px-2 sm:px-2 text-center w-1/6 sm:w-1/7">Azioni</th>}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {schedule.map((row, rowIndex) => (
                <tr key={row.id} className="text-center border-b">
                  <td className="bg-[#C84B2F] text-white py-3 px-2 sm:px-2 text-sm">
                    {editingRowIndex === rowIndex ? (
                      <input
                        type="text"
                        value={editData.time || ""}
                        onChange={(e) => handleChange("time", e.target.value)}
                        className="block w-full h-12 mb-1 p-3 text-black border border-gray-300 rounded-md"
                        placeholder="Ora"
                      />
                    ) : (
                      <div>{row.time || "-"}</div>
                    )}
                  </td>

                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                    <td key={day} className="py-3 px-2 sm:px-2 text-sm">
                      {editingRowIndex === rowIndex ? (
                        <input
                          type="text"
                          value={editData[day] || ""}
                          onChange={(e) => handleChange(day, e.target.value)}
                          className="block w-full h-12 mb-1 p-3 border border-gray-300 rounded-md"
                          placeholder="Descrizione"
                        />
                      ) : (
                        <div>
                          {row[day] ? row[day].split(": ").map((part, index) => (
                            <div key={index} className="whitespace-pre-line">
                              {index === 0 ? part + ":" : part}
                            </div>
                          )) : "-"}
                        </div>
                      )}
                    </td>
                  ))}

                  {isAdmin && (
                    <td className="py-3 px-2 sm:px-2 text-sm">
                      {editingRowIndex === rowIndex ? (
                        <div className="flex flex-col sm:flex-row">
                          <button
                            onClick={handleSaveClick}
                            className="bg-green-500 text-white px-3 py-1 rounded mb-2 sm:mb-0 sm:mr-2"
                          >
                            Salva
                          </button>
                          <button
                            onClick={() => handleDeleteClick(row.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(rowIndex)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Modifica
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {
        announcements.map((announcementItem, index) => (
          <h1 className="text-[#c8c8c8] text-3xl text-center" key={index}>{announcementItem.scheduleAnnouncement}</h1>
        ))
      }
        </div>

        {/* Mobile/List View */}
        <div className="md:hidden">
          {schedule.map((row, rowIndex) => (
            <div key={row.id} className="mb-4 p-4 bg-white shadow-md rounded text-black">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Ora:</span>
                {editingRowIndex === rowIndex ? (
                  <input
                    type="text"
                    value={editData.time || ""}
                    onChange={(e) => handleChange("time", e.target.value)}
                    className="block w-full h-12 p-3 border border-gray-300 rounded-md"
                    placeholder="Ora"
                  />
                ) : (
                  <span>{row.time || "-"}</span>
                )}
              </div>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <div key={day} className="flex justify-between mb-2">
                  <span className="font-semibold">{day}:</span>
                  {editingRowIndex === rowIndex ? (
                    <input
                      type="text"
                      value={editData[day] || ""}
                      onChange={(e) => handleChange(day, e.target.value)}
                      className="block w-full h-12 p-3 border border-gray-300 rounded-md"
                      placeholder="Descrizione"
                    />
                  ) : (
                    <span>
                      {row[day] ? row[day].split(": ").map((part, index) => (
                        <div key={index} className="whitespace-pre-line">
                          {index === 0 ? part + ":" : part}
                        </div>
                      )) : "-"}
                    </span>
                  )}
                </div>
              ))}
              {isAdmin && (
                <div className="flex justify-between mt-2">
                  {editingRowIndex === rowIndex ? (
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={handleSaveClick}
                        className="bg-green-500 text-white px-2 py-2 rounded"
                      >
                        Salva
                      </button>
                      <button
                        onClick={() => handleDeleteClick(row.id)}
                        className="bg-red-500 text-white px-2 py-2 rounded"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(rowIndex)}
                      className="bg-blue-500 text-white px-2 py-2 rounded"
                    >
                      Modifica
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="mt-4">
            <h3 className="text-white mb-2">Aggiungi un nuovo orario</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-7">
              <input
                type="text"
                value={newData.time}
                onChange={(e) => setNewData({ ...newData, time: e.target.value })}
                placeholder="Ora"
                className="block w-full h-12 p-3 border text-black border-gray-300 rounded-md"
              />
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <input
                  key={day}
                  type="text"
                  value={newData[day]}
                  onChange={(e) => setNewData({ ...newData, [day]: e.target.value })}
                  placeholder={day}
                  className="block text-black w-full h-12 p-3 border border-gray-300 rounded-md"
                />
              ))}
            </div>
            <button
              onClick={handleAddClick}
              className="mt-4 bg-green-500 text-white px-2 py-2 rounded"
            >
              Aggiungi
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Schedule;
