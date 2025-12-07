import React, { useState } from "react";
import { Play, Check, Shuffle, Clock, Dog, Info, X } from "lucide-react";

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
    <div className="min-h-screen bg-stone-100 font-sans text-stone-800 p-4 sm:p-6 flex justify-center items-start">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <header className="text-center space-y-2 mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-full shadow-lg">
              <Dog className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
                Daily Dog Trainer
              </h1>
              <p className="text-stone-500 text-sm">
                Randomize your routine. Keep them guessing.
              </p>
            </div>
          </div>
          
          {/* Location Filter */}
          <div className="flex flex-wrap gap-3 justify-center mt-2 mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="location"
                checked={locationFilter === 'anywhere'}
                onChange={() => setLocationFilter('anywhere')}
                className="text-amber-500 focus:ring-amber-300"
              />
              <span className="text-sm text-stone-700">Anywhere</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="location"
                checked={locationFilter === 'indoor'}
                onChange={() => setLocationFilter('indoor')}
                className="text-amber-500 focus:ring-amber-300"
              />
              <span className="text-sm text-stone-700">Indoors</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="location"
                checked={locationFilter === 'outdoor'}
                onChange={() => setLocationFilter('outdoor')}
                className="text-amber-500 focus:ring-amber-300"
              />
              <span className="text-sm text-stone-700">Outdoors</span>
            </label>
          </div>
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
                    
                    {/* Collar Clock Number Display */}
                    {currentLesson.title === "Collar Clock Game" && clockNumber && (
                      <div className="mt-4 p-4 bg-white rounded-lg border-2 border-amber-200">
                        <p className="text-sm font-medium text-amber-700 mb-2">Today's Clock Position:</p>
                        <div className="text-4xl font-bold text-amber-600 animate-pulse">
                          {clockNumber}
                        </div>
                        <p className="text-xs text-amber-600 mt-2">
                          {clockNumber <= 6 ? 'Use your right hand' : 'Use your left hand'}
                        </p>
                        <button
                          onClick={() => setClockNumber(generateClockNumber())}
                          className="mt-2 text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1 rounded-full transition-colors"
                        >
                          New Number
                        </button>
                      </div>
                    )}
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
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
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
                  className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-100 animate-fadeIn"
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
    </div>
  );
}
