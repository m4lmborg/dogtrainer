import React, { useEffect, useState } from "react";
import { Play, Check, Shuffle, Clock, Dog, Info, X } from "lucide-react";

const HISTORY_STORAGE_KEY = "dogtrainer.history.v1";

const formatDateInput = (date) => date.toISOString().slice(0, 10);
const getDateOnly = (isoString) =>
  isoString ? isoString.slice(0, 10) : formatDateInput(new Date());

// Initial database of training exercises
const initialTrainingExercises = [
  {
    id: 1,
    title: "Sit & Stay",
    instructions:
      "Ask your dog to sit. Once seated, say 'Stay' and take one step back. Wait 3 seconds. Step back to the dog and reward. Repeat, gradually increasing distance and time.",
    videoUrl: "#",
  },
  {
    id: 2,
    title: "Loose Leash Walking",
    instructions:
      "Walk with your dog on a loose leash. If they pull, stop immediately like a tree. Wait for the leash to slacken before moving forward again. Reward heavily when they walk by your side.",
    videoUrl: "#",
  },
  {
    id: 3,
    title: "The 'Leave It' Command",
    instructions:
      "Place a treat in your closed hand. Let the dog sniff or lick. Wait for them to stop and pull away. The moment they do, say 'Yes!' and give them a different treat from your other hand.",
    videoUrl: "#",
  },
  {
    id: 4,
    title: "Recall (Come)",
    instructions:
      "Have a partner hold the dog or put them in a sit stay. Walk away, crouch down, open your arms and call their name happily with 'Come!'. Reward with a jackpot of treats when they arrive.",
    videoUrl: "#",
  },
  {
    id: 5,
    title: "Touch (Hand Target)",
    instructions:
      "Hold your palm out flat close to the dog's nose. When they sniff or touch it, click or say 'Yes!' and treat. Repeat until they reliably bump your hand with their nose.",
    videoUrl: "#",
  },
];

export default function App() {
  const [exercises, setExercises] = useState(initialTrainingExercises);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch (error) {
      console.error("Failed to parse history from storage", error);
    }

    return [];
  });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);
  const todayString = formatDateInput(new Date());
  const [dateFilter, setDateFilter] = useState({ mode: "date", value: todayString });
  const [formValues, setFormValues] = useState({
    id: null,
    title: "",
    instructions: "",
    videoUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const getRelativeDateString = (offsetDays) => {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    return formatDateInput(target);
  };

  const setFilterToDate = (value) => setDateFilter({ mode: "date", value });
  const setFilterToWeek = () => setDateFilter({ mode: "week", value: todayString });
  const setFilterToAll = () => setDateFilter({ mode: "all", value: "" });

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  // Generate a random lesson
  const randomizeLesson = () => {
    if (exercises.length === 0) return;

    setIsLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * exercises.length);
      setCurrentLesson(exercises[randomIndex]);
      setIsLoading(false);
    }, 400);
  };

  // Mark the current lesson as done
  const markDone = () => {
    if (!currentLesson) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newEntry = {
      id: Date.now(),
      title: currentLesson.title,
      date: now.toISOString(),
      time: timeString,
    };

    setHistory((prev) => [newEntry, ...prev]);
  };

  const openVideo = () => {
    if (!currentLesson) return;
    setIsVideoModalOpen(true);
  };

  const openManageModal = () => {
    if (currentLesson) {
      setEditingExerciseId(currentLesson.id);
      setFormValues({
        id: currentLesson.id,
        title: currentLesson.title,
        instructions: currentLesson.instructions,
        videoUrl: currentLesson.videoUrl || "",
      });
    } else {
      setEditingExerciseId(null);
      setFormValues({
        id: null,
        title: "",
        instructions: "",
        videoUrl: "",
      });
    }
    setIsManageModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveExercise = () => {
    const trimmedTitle = formValues.title.trim();
    const trimmedInstructions = formValues.instructions.trim();

    if (!trimmedTitle || !trimmedInstructions) {
      alert("Title and instructions are required.");
      return;
    }

    if (editingExerciseId != null) {
      // Update existing exercise
      const updated = exercises.map((ex) =>
        ex.id === editingExerciseId
          ? {
              ...ex,
              title: trimmedTitle,
              instructions: trimmedInstructions,
              videoUrl: formValues.videoUrl.trim(),
            }
          : ex
      );

      setExercises(updated);

      if (currentLesson && currentLesson.id === editingExerciseId) {
        const fresh = updated.find((ex) => ex.id === editingExerciseId) || null;
        setCurrentLesson(fresh);
      }
    } else {
      // Add new exercise
      const newId = Date.now();
      const newExercise = {
        id: newId,
        title: trimmedTitle,
        instructions: trimmedInstructions,
        videoUrl: formValues.videoUrl.trim(),
      };

      const updated = [newExercise, ...exercises];
      setExercises(updated);
      setCurrentLesson(newExercise);
    }

    setIsManageModalOpen(false);
  };

  const handleEditFromList = (id) => {
    const target = exercises.find((ex) => ex.id === id);
    if (!target) return;
    setEditingExerciseId(id);
    setFormValues({
      id: target.id,
      title: target.title,
      instructions: target.instructions,
      videoUrl: target.videoUrl || "",
    });
  };

  const handleAddNewFromList = () => {
    setEditingExerciseId(null);
    setFormValues({
      id: null,
      title: "",
      instructions: "",
      videoUrl: "",
    });
  };

  const toggleSelectExercise = (id) => {
    setSelectedExerciseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAllExercises = () => {
    if (selectedExerciseIds.length === exercises.length) {
      setSelectedExerciseIds([]);
    } else {
      setSelectedExerciseIds(exercises.map((ex) => ex.id));
    }
  };

  const handleDeleteSingle = (id) => {
    const updated = exercises.filter((ex) => ex.id !== id);
    setExercises(updated);

    if (currentLesson && currentLesson.id === id) {
      setCurrentLesson(null);
    }

    if (editingExerciseId === id) {
      setEditingExerciseId(null);
      setFormValues({
        id: null,
        title: "",
        instructions: "",
        videoUrl: "",
      });
    }

    setSelectedExerciseIds((prev) => prev.filter((x) => x !== id));
  };

  const handleDeleteSelected = () => {
    if (selectedExerciseIds.length === 0) return;

    const idsToDelete = new Set(selectedExerciseIds);
    const updated = exercises.filter((ex) => !idsToDelete.has(ex.id));
    setExercises(updated);

    if (currentLesson && idsToDelete.has(currentLesson.id)) {
      setCurrentLesson(null);
    }

    if (editingExerciseId != null && idsToDelete.has(editingExerciseId)) {
      setEditingExerciseId(null);
      setFormValues({
        id: null,
        title: "",
        instructions: "",
        videoUrl: "",
      });
    }

    setSelectedExerciseIds([]);
  };

  const filterMatches = (entry) => {
    if (dateFilter.mode === "all") return true;

    if (dateFilter.mode === "week") {
      const anchorDate = new Date(todayString);
      const entryDate = new Date(entry.date);
      const diffDays = (anchorDate - entryDate) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays < 7;
    }

    if (!dateFilter.value) return true;
    return getDateOnly(entry.date) === dateFilter.value;
  };

  const filteredHistory = history.filter(filterMatches);
  const groupedHistory = history.reduce((acc, entry) => {
    const dateKey = getDateOnly(entry.date);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {});
  const sortedDateKeys = Object.keys(groupedHistory).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-800 p-4 sm:p-6 flex justify-center items-start">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <header className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-full shadow-lg mb-2">
            <Dog className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
            Daily Dog Trainer
          </h1>
          <p className="text-stone-500 text-sm">
            Randomize your routine. Keep them guessing.
          </p>
        </header>

        {/* Main Action Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-200 relative">
          <div className="p-6 flex flex-col items-center space-y-6">
            {/* Randomize Button */}
            <button
              onClick={randomizeLesson}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all duration-200 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-md group"
            >
              <Shuffle
                className={`w-5 h-5 ${
                  isLoading
                    ? "animate-spin"
                    : "group-hover:rotate-12 transition-transform"
                }`}
              />
              {currentLesson ? "Spin Again" : "Start Training Session"}
            </button>

            {/* Display Area */}
            <div
              className={`w-full transition-all duration-500 ${
                currentLesson
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 h-0 overflow-hidden"
              }`}
            >
              {currentLesson && (
                <>
                  <div className="border-t border-stone-100 w-full my-2"></div>

                  {/* Title */}
                  <div className="text-center pt-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                      Current Drill
                    </span>
                    <h2 className="text-2xl font-bold mt-2 text-stone-800">
                      {currentLesson.title}
                    </h2>
                  </div>

                  {/* Instructions */}
                  <div className="bg-stone-50 rounded-xl p-4 mt-4 text-stone-600 leading-relaxed text-sm text-center border border-stone-100">
                    {currentLesson.instructions}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button
                      onClick={openVideo}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-stone-200 hover:border-indigo-200 hover:bg-indigo-50 text-stone-700 font-semibold rounded-xl transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      View Video
                    </button>

                    <button
                      onClick={markDone}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-sm active:scale-95 transition-all"
                    >
                      <Check className="w-5 h-5" />
                      Mark Done
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Placeholder state if no lesson is selected */}
            {!currentLesson && (
              <div className="py-12 text-center text-stone-400">
                <p>Press the button above to pick a random exercise.</p>
              </div>
            )}
          </div>
        </div>

        {/* History / Log Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-stone-800">Training Log</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium bg-stone-100 text-stone-500 px-2 py-1 rounded-full">
                {filteredHistory.length} shown
              </span>
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs px-3 py-1 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={history.length === 0}
              >
                Clear history
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilterToDate(todayString)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  dateFilter.mode === "date" && dateFilter.value === todayString
                    ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setFilterToDate(getRelativeDateString(-1))}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  dateFilter.mode === "date" &&
                  dateFilter.value === getRelativeDateString(-1)
                    ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={setFilterToWeek}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  dateFilter.mode === "week"
                    ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                This week
              </button>
              <button
                type="button"
                onClick={setFilterToAll}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  dateFilter.mode === "all"
                    ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                All time
              </button>
            </div>

            <label className="flex items-center gap-2 text-xs text-stone-600">
              <span className="font-semibold">Pick a date</span>
              <input
                type="date"
                value={dateFilter.mode === "date" ? dateFilter.value : todayString}
                onChange={(e) => setFilterToDate(e.target.value)}
                className="border border-stone-200 rounded-lg px-2 py-1 text-xs bg-white"
              />
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-stone-500">Daily summary</p>
            {sortedDateKeys.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No history saved yet.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {sortedDateKeys.map((dateKey) => (
                  <div
                    key={dateKey}
                    className="flex items-center justify-between bg-stone-50 px-3 py-2 rounded-xl border border-stone-100"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-stone-700">
                        {new Date(dateKey).toLocaleDateString([], {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {groupedHistory[dateKey].slice(0, 4).map((entry) => (
                          <span
                            key={entry.id}
                            className="text-[11px] bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-full"
                          >
                            {entry.title}
                          </span>
                        ))}
                        {groupedHistory[dateKey].length > 4 && (
                          <span className="text-[11px] text-stone-500">
                            +{groupedHistory[dateKey].length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600">
                      {groupedHistory[dateKey].length} done
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            {filteredHistory.length === 0 ? (
              <p className="text-sm text-stone-400 italic text-center py-4">
                No sessions match this date range.
              </p>
            ) : (
              filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-100 animate-fadeIn"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-stone-700 text-sm">
                      {entry.title}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {new Date(entry.date).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 font-mono bg-white px-2 py-1 rounded-md border border-stone-100">
                    {entry.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Manage sessions button at bottom */}
        <button
          onClick={openManageModal}
          className="w-full text-sm font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50 rounded-2xl py-3 flex items-center justify-center gap-2"
        >
          <Info className="w-4 h-4" />
          Manage training sessions
        </button>
      </div>

      {/* Video Modal Overlay */}
      {isVideoModalOpen && currentLesson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Mock Video Player */}
            <div className="aspect-video bg-stone-900 flex flex-col items-center justify-center text-white p-8 text-center">
              <Play className="w-16 h-16 opacity-80 mb-4" />
              <p className="font-medium">Video Player Placeholder</p>
              <p className="text-sm text-stone-400 mt-2">
                In a real app, the video for <br />
                <span className="text-white font-bold">
                  "{currentLesson.title}"
                </span>{" "}
                would play here.
              </p>
              {currentLesson.videoUrl && currentLesson.videoUrl !== "#" && (
                <a
                  href={currentLesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 text-xs font-semibold bg-white text-stone-900 rounded-full hover:bg-stone-100"
                >
                  Open video in new tab
                </a>
              )}
            </div>

            <div className="p-6">
              <h3 className="font-bold text-lg mb-2">Watch and Learn</h3>
              <p className="text-stone-600 text-sm">
                Watch the professional demonstration before attempting the drill
                with your dog. Keep sessions short and fun.
              </p>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-full mt-6 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Exercises Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setIsManageModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-stone-100 hover:bg-stone-200 text-stone-700 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 space-y-4">
              <h3 className="font-bold text-lg">Manage training sessions</h3>

              {/* List of all exercises */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>All sessions ({exercises.length})</span>
                  <button
                    type="button"
                    onClick={toggleSelectAllExercises}
                    className="px-2 py-1 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100"
                  >
                    {selectedExerciseIds.length === exercises.length &&
                    exercises.length > 0
                      ? "Clear selection"
                      : "Select all"}
                  </button>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1 border border-stone-100 rounded-xl p-1 bg-stone-50">
                  {exercises.length === 0 ? (
                    <p className="text-xs text-stone-400 text-center py-4">
                      No training sessions yet. Add one below.
                    </p>
                  ) : (
                    exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between rounded-lg px-2 py-1 bg-white"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedExerciseIds.includes(exercise.id)}
                            onChange={() => toggleSelectExercise(exercise.id)}
                            className="h-3 w-3 rounded border-stone-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleEditFromList(exercise.id)}
                            className="text-xs text-stone-700 font-medium hover:text-indigo-600 text-left"
                          >
                            {exercise.title}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSingle(exercise.id)}
                          className="text-[11px] text-rose-500 hover:text-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleAddNewFromList}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    + Add new session
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    disabled={selectedExerciseIds.length === 0}
                    className="text-xs px-3 py-1 rounded-lg border border-rose-100 text-rose-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-50"
                  >
                    Delete selected
                  </button>
                </div>
              </div>

              <hr className="border-stone-100" />

              {/* Edit / add form */}
              <div className="space-y-3">
                <p className="text-xs text-stone-500">
                  {editingExerciseId != null
                    ? "Editing selected session."
                    : "Creating a new training session."}
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-500">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formValues.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Loose leash walking with Loki"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-500">
                    Instructions
                  </label>
                  <textarea
                    value={formValues.instructions}
                    onChange={(e) =>
                      handleFormChange("instructions", e.target.value)
                    }
                    rows={5}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                    placeholder="Step by step notes for this drill."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-500">
                    Video URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formValues.videoUrl}
                    onChange={(e) =>
                      handleFormChange("videoUrl", e.target.value)
                    }
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="https://youtu.be/..."
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3 justify-end">
                <button
                  onClick={() => setIsManageModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveExercise}
                  className="px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
