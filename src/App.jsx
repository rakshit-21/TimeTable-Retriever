
import { useState } from "react";
import { Search, Calendar, Clock, MapPin, User, BookOpen } from "lucide-react";

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

  const dayColors = {
    Monday: "from-blue-500 to-purple-600",
    Tuesday: "from-green-500 to-teal-600",
    Wednesday: "from-orange-500 to-red-600",
    Thursday: "from-purple-500 to-pink-600",
    Friday: "from-indigo-500 to-blue-600",
    Saturday: "from-teal-500 to-green-600",
    Sunday: "from-red-500 to-pink-600"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center p-4 font-sans">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="w-full break-words text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Timetable Retriever
</h1>

          </div>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Enter your batch code to view your personalized class schedule
          </p>
        </div>

        {/* Search Form */}
        <div className="w-full max-w-md mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-1 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="Enter Batch (F7, E16...)"
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-lg"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center gap-3 text-indigo-600 mb-6 animate-pulse">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium">Loading your timetable...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 max-w-md w-full animate-fade-in">
            <p className="text-red-600 font-medium text-center">{error}</p>
          </div>
        )}

        {/* Timetable Display */}
        {data.length > 0 && (
          <div className="w-full max-w-6xl space-y-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {Object.keys(groupByDay).map((day, dayIndex) => (
              <div 
                key={day} 
                className="animate-fade-in" 
                style={{ animationDelay: `${0.1 * dayIndex}s` }}
              >
                {/* Day Header */}
                <div className="relative mb-6">
                  <div className={`bg-gradient-to-r ${dayColors[day] || 'from-gray-500 to-gray-600'} rounded-2xl p-1 shadow-xl`}>
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-gradient-to-r ${dayColors[day] || 'from-gray-500 to-gray-600'} rounded-xl`}>
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{day}</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4"></div>
                        <span className="text-sm text-gray-500 font-medium">
                          {groupByDay[day].length} classes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Classes Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {groupByDay[day].map((row, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20"
                    >
                      {/* Time indicator */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {row.start}
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-5 h-5 text-indigo-600" />
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                            {row.subject_code}
                          </h3>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-600">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">Room {row.room}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <User className="w-4 h-4 text-green-500" />
                          <span className="font-medium">{row.faculty}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{row.start}</span>
                        </div>
                      </div>

                      {/* Hover gradient border */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
