import React, { useState } from "react";
import { Play, Check, Shuffle, Clock, Dog, Info, X, Plus, Edit } from "lucide-react";

// Initial database of training exercises
const initialTrainingExercises = [
  {
    id: 1,
    title: "Calm Touch",
    instructions: `1. Wait until your dog is calm and relaxed
2. Have them sit or lie down in a comfortable position
3. Slowly stroke down one side of their body in a smooth motion
4. Give a treat after each stroke
5. Repeat on both sides, avoiding the spine area
6. As they relax, add the word 'nice' during the stroke
7. Gradually increase time between touch and treat to build patience`,
    videoUrl: "#",
    location: "indoor", // Best done in a quiet, controlled environment
  },
  {
    id: 2,
    title: "Eye Contact",
    instructions: `1. Hold a treat in your closed hand at your dog's nose level
2. Wait for them to make eye contact with you
3. The moment they look into your eyes, mark (say 'yes' or click)
4. Immediately reward with the treat
5. Gradually increase duration before marking (1-3 seconds)
6. Practice in different environments to improve focus
7. Use their regular meals for training to reinforce the behavior`,
    videoUrl: "#",
    location: "anywhere", // Can be practiced in any setting
  },
  {
    id: 3,
    title: "With Me",
    instructions: `1. Stand with your dog facing you
2. Hold a treat in your open left hand at your dog's nose height
3. Take a small step backward while saying 'with me'
4. When your dog follows your hand, say 'good with me' and reward them
5. Start with 1-2 steps, then gradually increase distance
6. Practice in different locations to generalize the behavior`,
    videoUrl: "#",
    location: "anywhere", // Can be practiced in any setting
  },
  {
    id: 4,
    title: "Nice (Check In Cue)",
    instructions: `1. Stand still with your dog on a loose lead
2. Keep hands relaxed at your sides (no food visible)
3. When your dog looks at you, say 'nice' in a calm voice
4. Immediately reward with a high-value treat
5. Practice in different environments:
   - Start in a quiet room
   - Move to the backyard
   - Try on neighborhood walks
   - Practice in busier locations
6. Focus on the start of walks and in new environments`,
    videoUrl: "#",
    location: "outdoor", // Specifically for walks and new places
  },
  {
    id: 5,
    title: "Collar Clock Game",
    instructions: `1. Have your dog sit or stand in front of you
2. Imagine their collar as a clock face (1-11, never 12)
3. Hold a treat in your right hand for positions 1-6
4. Hold a treat in your left hand for positions 7-11
5. Gently touch the collar at the chosen position
6. Keep touches brief and light - no grabbing
7. Reward immediately after each touch
8. Vary the order of positions to keep your dog comfortable
9. Never touch at the 12 o'clock position (directly under the chin)`,
    videoUrl: "#",
    location: "indoor", // Best done in a controlled environment
  },
  {
    id: 6,
    title: "Treat To Feet",
    instructions: `1. Start with your dog on your left side with a loose lead
2. Take one small step forward with your left foot
3. If the lead stays loose:
   - Say 'yes' or click
   - Place a treat by your left foot
   - Let your dog eat from the ground
4. If they pull ahead:
   - Stop immediately
   - Wait for the lead to go slack
   - Take a step back if needed
   - Reward when they return to your side
5. Gradually increase the number of steps between rewards`,
    videoUrl: "#",
    location: "outdoor", // Involves walking on a lead
  },
  {
    id: 7,
    title: "Loose Leash Walking (Handler Position)",
    instructions: `1. Hold the lead in your right hand at your waist
2. Keep your dog on your left side
3. Walk in a straight line without speaking
4. Reward when they:
   - Walk beside you
   - Glance up at you
   - Respond to a change in direction
5. If they pull ahead:
   - Turn 90° to the right
   - Continue walking in the new direction
   - Reward when they catch up on a loose lead
6. Keep training sessions short (5-10 minutes)
7. Gradually increase distractions as they improve`,
    videoUrl: "#",
    location: "outdoor", // Specifically for walking
  },
  {
    id: 8,
    title: "Collar Hold",
    instructions: `1. Walk with your dog on a loose lead
2. When they're focused and relaxed:
   - Gently grasp their collar at the 9 o'clock position
   - Wait for them to make eye contact
   - Say 'treat' in a calm voice
   - Reward with your other hand
3. Keep the hold light and brief
4. Always follow with a reward
5. Gradually increase duration of the hold
6. Practice in different environments
7. Never use the collar hold for corrections`,
    videoUrl: "#",
    location: "anywhere", // Can be practiced in any setting
  },
  {
    id: 9,
    title: "Loop Exercise",
    instructions: `1. Start with a small loop in front of your home
2. Walk with your dog on your left side
3. Reward frequently for:
   - Staying close to your side
   - Maintaining a loose lead
   - Checking in with you
4. Gradually increase the loop size:
   - Add one house at a time
   - Only extend when comfortable
   - Return to shorter loops if needed
5. Watch for signs of stress or distraction
6. Keep training sessions positive and rewarding`,
    videoUrl: "#",
    location: "outdoor", // Involves walking around the neighborhood
  },
  {
    id: 10,
    title: "Door Entrance Manners",
    instructions: `1. Approach the door with your dog on lead
2. Place hand on the handle but don't open yet
3. Wait for your dog to look at you
4. Mark (say 'yes' or click) and reward away from the door
5. Gradually increase difficulty:
   - Wiggle the handle
   - Open the door a crack
   - Open halfway
   - Fully open the door
6. Add a 'wait' cue when they understand the concept
7. Only proceed when they're calm and looking at you
8. Use 'let's go' as the release cue to move forward`,
    videoUrl: "#",
    location: "indoor", // Specifically for doorways
  },
];

export default function App() {
  const [exercises, setExercises] = useState(initialTrainingExercises);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [history, setHistory] = useState([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [locationFilter, setLocationFilter] = useState('anywhere'); // 'anywhere', 'indoor', 'outdoor'
  const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);
  const [formValues, setFormValues] = useState({
    id: null,
    title: "",
    instructions: "",
    videoUrl: "",
    location: "anywhere", // Default location
  });
  const [isLoading, setIsLoading] = useState(false);
  const [clockNumber, setClockNumber] = useState(null);

  // Generate a random number between 1 and 11 for the collar clock
  const generateClockNumber = () => {
    return Math.floor(Math.random() * 11) + 1; // 1-11 inclusive
  };

  const randomizeClockNumber = () => {
    setClockNumber(generateClockNumber());
  };

  // Filter exercises based on location
  const getFilteredExercises = () => {
    if (locationFilter === 'anywhere') return exercises;
    return exercises.filter(ex => ex.location === locationFilter);
  };

  // Generate a random lesson
  const randomizeLesson = () => {
    const filteredExercises = getFilteredExercises();
    if (filteredExercises.length === 0) {
      alert('No exercises match the current filter. Please adjust your filter settings.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredExercises.length);
      const selectedLesson = filteredExercises[randomIndex];
      setCurrentLesson(selectedLesson);
      
      // If the selected lesson is the Collar Clock Game, generate a random number
      if (selectedLesson.title === "Collar Clock Game") {
        setClockNumber(generateClockNumber());
      } else {
        setClockNumber(null);
      }
      
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
      time: timeString,
    };

    setHistory([newEntry, ...history]);
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
        location: currentLesson.location,
      });
    } else {
      setEditingExerciseId(null);
      setFormValues({
        id: null,
        title: "",
        instructions: "",
        videoUrl: "",
        location: "anywhere",
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
              location: formValues.location,
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
        location: formValues.location,
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
      location: target.location,
    });
  };

  const handleAddNewFromList = () => {
    setEditingExerciseId(null);
    setFormValues({
      id: null,
      title: "",
      instructions: "",
      videoUrl: "",
      location: "anywhere",
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
        location: "anywhere",
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
        location: "anywhere",
      });
    }

    setSelectedExerciseIds([]);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            Dog Training Exercises
          </h1>
          <p className="text-gray-600 mb-6">Professional training exercises for your canine companion</p>
          
          {/* Location Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {[
              { value: 'anywhere', label: '🌍 Anywhere' },
              { value: 'indoor', label: '🏠 Indoor' },
              { value: 'outdoor', label: '🌳 Outdoor' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setLocationFilter(value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  locationFilter === value
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100 transform -translate-y-0.5'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={randomizeLesson}
              disabled={isLoading || getFilteredExercises().length === 0}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isLoading || getFilteredExercises().length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                <>
                  <Shuffle size={18} className="text-white" />
                  Randomize Lesson
                </>
              )}
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500 max-w-xl mx-auto">
            Most dogs learn best with short, focused sessions. Aim for training sessions of around
            <span className="font-semibold text-gray-700"> 3-9 minutes</span> per exercise, with plenty of breaks.
          </p>
        </header>

        <main className="space-y-8">
          {currentLesson ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
              <div className="p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                  <div>
                    <div className="inline-block mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {currentLesson.location.charAt(0).toUpperCase() + currentLesson.location.slice(1)}
                      </span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                      {currentLesson.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={16} className="mr-1.5 text-blue-500" />
                      <span>Last practiced: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentLesson(null)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors duration-200"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="prose prose-blue max-w-none">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Info size={18} className="mr-2 text-blue-500" />
                      Instructions
                    </h3>
                    <div className="space-y-3 text-gray-700">
                      {currentLesson.instructions.split('\n').map((step, index) => {
                        // Check if the line starts with a number and dot (for numbered steps)
                        if (/^\d+\./.test(step.trim())) {
                          return (
                            <div key={index} className="flex items-start">
                              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mr-3 mt-0.5">
                                {step.match(/^\d+/)[0]}
                              </span>
                              <span className="leading-relaxed">{step.replace(/^\d+\.\s*/, '')}</span>
                            </div>
                          );
                        }
                        // Handle bullet points (lines starting with - or •)
                        if (/^\s*[-•]\s+/.test(step)) {
                          return (
                            <div key={index} className="flex items-start ml-9">
                              <span className="text-blue-500 mr-2">•</span>
                              <span className="leading-relaxed">{step.replace(/^\s*[-•]\s+/, '')}</span>
                            </div>
                          );
                        }
                        // Regular paragraph
                        return (
                          <p key={index} className="leading-relaxed">
                            {step}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {currentLesson.title === "Collar Clock Game" && clockNumber && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6">
                    {/* Left: text block */}
                    <div className="flex items-start gap-3 flex-1">
                      <Clock size={18} className="mt-0.5 text-blue-600" />
                      <div>
                        <div className="text-xs uppercase tracking-wide text-blue-500 font-semibold">
                          Clock position
                        </div>
                        <div className="text-sm text-slate-600">
                          Touch at
                          <span className="font-semibold text-blue-700"> {clockNumber} o'clock </span>
                          on your dog's collar.
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Use a light, brief touch and always follow with a reward.
                        </div>
                      </div>
                    </div>

                    {/* Middle: big number */}
                    <div className="flex items-center justify-center sm:justify-center min-w-[96px] sm:min-w-[96px]">
                      <div className="px-6 py-3 rounded-lg bg-white border border-blue-100 text-blue-700 text-2xl font-extrabold leading-none">
                        {clockNumber}
                      </div>
                    </div>

                    {/* Right: spin button, vertically centered */}
                    <div className="flex items-center justify-start sm:justify-end min-w-[120px] sm:min-w-[120px] mt-1 sm:mt-0">
                      <button
                        type="button"
                        onClick={randomizeClockNumber}
                        className="text-[11px] px-4 py-2 rounded-full bg-white text-blue-700 font-semibold border border-blue-200 hover:bg-blue-50 transition-colors whitespace-nowrap"
                      >
                        Spin new number
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={markDone}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Check size={18} className="text-white" />
                    Mark as Done
                  </button>
                  {currentLesson.videoUrl && (
                    <button
                      onClick={openVideo}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Play size={18} className="text-white" />
                      Watch Video
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-200">
              <div className="mx-auto w-28 h-28 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <Dog size={48} className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Ready to train your dog?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                Click the button above to get a randomly selected training exercise
                <span className="block text-sm text-gray-400 mt-2">
                  Filter by location using the buttons above to find the perfect exercise for your current setting
                </span>
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2"></span>
                  {getFilteredExercises().length} exercises available
                </div>
                <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
                  {history.length} sessions completed
                </div>
              </div>
            </div>
          )}

          {/* History / Log Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
              <h3 className="font-bold text-lg mb-2">Today's Log</h3>
              <span className="text-xs font-medium bg-stone-100 text-stone-500 px-2 py-1 rounded-full">
                {history.length} Completed
              </span>
            </div>

          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-stone-400 italic text-center py-4">
                No sessions completed yet today.
              </p>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-2 flex-wrap bg-stone-50 p-3 rounded-xl border border-stone-100 animate-fadeIn"
                >
                  <span className="font-medium text-stone-700 text-sm">
                    {entry.title}
                  </span>
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
          </main>
        </div>
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
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Loose leash walking with your dog"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-500">
                    Location
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['anywhere', 'indoor', 'outdoor'].map((loc) => (
                      <label key={loc} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="location"
                          checked={formValues.location === loc}
                          onChange={() =>
                            handleFormChange("location", loc)
                          }
                          className="text-amber-500 focus:ring-amber-300"
                        />
                        <span className="text-sm text-stone-700 capitalize">
                          {loc}
                        </span>
                      </label>
                    ))}
                  </div>
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
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
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
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
    </>
  );
}
