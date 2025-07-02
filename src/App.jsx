
import { useState } from "react";

// Fallback to localhost if env not set
const API = import.meta.env.VITE_API_URL;

export default function TimetableApp() {
  const [batch, setBatch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTimetable = async () => {
    const b = batch.trim();
    if (!b) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/timetable/${b}`);
      if (!res.ok) {
        throw new Error("Batch not found");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTimetable();
  };

  // Group rows by day for nicer display
  const groupByDay = data.reduce((acc, row) => {
    (acc[row.day] = acc[row.day] || []).push(row);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600 drop-shadow-sm">
        College Timetable
      </h1>

      {/* Batch input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-center mb-8 w-full max-w-md"
      >
        <input
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          placeholder="Enter Batch (F7, E16…)"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          Show
        </button>
      </form>

      {/* Feedback */}
      {loading && <p className="text-gray-500">Loading…</p>}
      {error && (
        <p className="text-red-600 font-medium mb-4">{error}</p>
      )}

      {/* Timetable display */}
      {data.length > 0 && (
        <div className="w-full max-w-4xl space-y-6">
          {Object.keys(groupByDay).map((day) => (
            <div key={day}>
              <h2 className="text-xl font-semibold mb-2 text-indigo-700">
                {day}
              </h2>
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="w-full text-left border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3">Start</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Room</th>
                      <th className="p-3">Faculty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupByDay[day].map((row, idx) => (
                      <tr
                        key={idx}
                        className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50"
                      >
                        <td className="p-3 whitespace-nowrap">{row.start}</td>
                        <td className="p-3 whitespace-nowrap">{row.subject_code}</td>
                        <td className="p-3 whitespace-nowrap">{row.room}</td>
                        <td className="p-3 whitespace-nowrap">{row.faculty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
