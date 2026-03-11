// Royal Smart Notes + Workout Planner - Workout Module

let workouts = JSON.parse(localStorage.getItem('workouts')) || {};
let currentWorkoutDay = null;

// Exercise database
const exerciseDatabase = {
    arms: [
        'Bicep Curls',
        'Tricep Dips',
        'Hammer Curls',
        'Overhead Tricep Extension',
        'Concentration Curls',
        'Diamond Push-ups'
    ],
    legs: [
        'Squats',
        'Lunges',
        'Leg Press',
        'Calf Raises',
        'Deadlifts',
        'Step-ups'
    ],
    chest: [
        'Push-ups',
        'Bench Press',
        'Chest Flys',
        'Incline Press',
        'Decline Press',
        'Cable Crossovers'
    ],
    back: [
        'Pull-ups',
        'Rows',
        'Lat Pulldowns',
        'Deadlifts',
        'Face Pulls',
        'Superman'
    ],
    shoulders: [
        'Shoulder Press',
        'Lateral Raises',
        'Front Raises',
        'Rear Delt Flys',
        'Arnold Press',
        'Shrugs'
    ],
    core: [
        'Planks',
        'Crunches',
        'Russian Twists',
        'Leg Raises',
        'Mountain Climbers',
        'Bicycle Crunches'
    ]
};

// Initialize Workout Planner
document.addEventListener('DOMContentLoaded', () => {
    initializeWorkoutPlanner();
    loadAllWorkouts();
});

function initializeWorkoutPlanner() {
    // Add workout buttons
    document.querySelectorAll('.btn-add-workout').forEach(btn => {
        btn.addEventListener('click', () => {
            const day = btn.dataset.day;
            openWorkoutModal(day);
        });
    });

    // Modal controls
    document.getElementById('close-workout-modal').addEventListener('click', closeWorkoutModal);
    document.getElementById('cancel-workout-btn').addEventListener('click', closeWorkoutModal);
    document.getElementById('save-workout-btn').addEventListener('click', saveWorkout);

    // Muscle group change handler
    document.getElementById('workout-muscle-group').addEventListener('change', (e) => {
        const muscleGroup = e.target.value;
        updateExerciseOptions(muscleGroup);

        // Hide/show exercise and max reps fields
        const exerciseGroup = document.getElementById('exercise-type-group');
        const maxRepsGroup = document.getElementById('max-reps-group');
        const recommendation = document.getElementById('workout-recommendation');

        if (muscleGroup === 'rest') {
            exerciseGroup.style.display = 'none';
            maxRepsGroup.style.display = 'none';
            recommendation.classList.remove('active');
        } else if (muscleGroup) {
            exerciseGroup.style.display = 'block';
            maxRepsGroup.style.display = 'block';
        }
    });

    // Max reps change handler
    document.getElementById('workout-max-reps').addEventListener('input', (e) => {
        const maxReps = parseInt(e.target.value);
        const muscleGroup = document.getElementById('workout-muscle-group').value;
        const exercise = document.getElementById('workout-exercise').value;

        if (maxReps && muscleGroup && exercise) {
            showWorkoutRecommendation(maxReps, exercise);
        }
    });

    // Exercise change handler
    document.getElementById('workout-exercise').addEventListener('change', () => {
        const maxReps = parseInt(document.getElementById('workout-max-reps').value);
        const exercise = document.getElementById('workout-exercise').value;

        if (maxReps && exercise) {
            showWorkoutRecommendation(maxReps, exercise);
        }
    });

    // Close modal on outside click
    document.getElementById('workout-modal').addEventListener('click', (e) => {
        if (e.target.id === 'workout-modal') {
            closeWorkoutModal();
        }
    });
}

function openWorkoutModal(day) {
    currentWorkoutDay = day;
    const modal = document.getElementById('workout-modal');
    const modalTitle = document.getElementById('workout-modal-title');

    modalTitle.textContent = `Add Workout - ${capitalizeDay(day)}`;

    // Reset form
    document.getElementById('workout-muscle-group').value = '';
    document.getElementById('workout-exercise').value = '';
    document.getElementById('workout-exercise').innerHTML = '<option value="">Select exercise...</option>';
    document.getElementById('workout-max-reps').value = '';
    document.getElementById('exercise-type-group').style.display = 'none';
    document.getElementById('max-reps-group').style.display = 'none';
    document.getElementById('workout-recommendation').classList.remove('active');

    modal.classList.add('active');
}

function closeWorkoutModal() {
    document.getElementById('workout-modal').classList.remove('active');
    currentWorkoutDay = null;
}

function updateExerciseOptions(muscleGroup) {
    const exerciseSelect = document.getElementById('workout-exercise');

    if (!muscleGroup || muscleGroup === 'rest') {
        exerciseSelect.innerHTML = '<option value="">Select exercise...</option>';
        return;
    }

    const exercises = exerciseDatabase[muscleGroup] || [];

    exerciseSelect.innerHTML = '<option value="">Select exercise...</option>' +
        exercises.map(ex => `<option value="${ex}">${ex}</option>`).join('');
}

function showWorkoutRecommendation(maxReps, exercise) {
    const recommendation = document.getElementById('workout-recommendation');

    // Calculate recommended reps (70-80% of max)
    const recommendedReps = Math.round(maxReps * 0.75);
    const sets = 3;

    recommendation.innerHTML = `
        <h4>Recommended Workout</h4>
        <p><strong>${exercise}</strong></p>
        <p style="font-size: 18px; color: var(--gold);"><strong>${sets} sets Ã— ${recommendedReps} reps</strong></p>
        <p style="font-size: 12px; margin-top: 10px;">Based on your max of ${maxReps} reps (75% intensity)</p>
    `;

    recommendation.classList.add('active');
}

function saveWorkout() {
    const muscleGroup = document.getElementById('workout-muscle-group').value;
    const exercise = document.getElementById('workout-exercise').value;
    const maxReps = parseInt(document.getElementById('workout-max-reps').value);

    if (!muscleGroup) {
        alert('Please select a muscle group');
        return;
    }

    if (muscleGroup === 'rest') {
        // Save rest day
        workouts[currentWorkoutDay] = {
            muscleGroup: 'rest',
            exercise: null,
            maxReps: null,
            sets: null,
            reps: null
        };
    } else {
        if (!exercise) {
            alert('Please select an exercise');
            return;
        }

        if (!maxReps || maxReps < 1) {
            alert('Please enter your maximum reps');
            return;
        }

        // Calculate recommended workout
        const recommendedReps = Math.round(maxReps * 0.75);
        const sets = 3;

        workouts[currentWorkoutDay] = {
            muscleGroup,
            exercise,
            maxReps,
            sets,
            reps: recommendedReps
        };
    }

    localStorage.setItem('workouts', JSON.stringify(workouts));
    loadAllWorkouts();
    closeWorkoutModal();
    updateDashboard(); // Update dashboard stats
}

function loadAllWorkouts() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(day => {
        const workout = workouts[day];
        const container = document.getElementById(`workout-${day}`);

        if (workout) {
            container.innerHTML = createWorkoutDisplay(workout, day);
            attachRemoveWorkoutListener(day);
        } else {
            container.innerHTML = `<button class="btn-add-workout" data-day="${day}">+ Add Workout</button>`;
            // Re-attach event listener
            container.querySelector('.btn-add-workout').addEventListener('click', () => {
                openWorkoutModal(day);
            });
        }
    });
}

function createWorkoutDisplay(workout, day) {
    if (workout.muscleGroup === 'rest') {
        return `
            <div class="workout-rest">
                ðŸŒŸ Rest Day
            </div>
            <button class="btn-remove-workout" data-day="${day}">Remove</button>
        `;
    }

    return `
        <div class="workout-details">
            <h4>${capitalizeDay(workout.muscleGroup)} Day</h4>
            <p><strong>Exercise:</strong> ${workout.exercise}</p>
            <p><strong>Workout:</strong> ${workout.sets} sets Ã— ${workout.reps} reps</p>
            <p style="font-size: 12px; color: var(--text-secondary);">Max reps: ${workout.maxReps}</p>
        </div>
        <button class="btn-remove-workout" data-day="${day}">Remove</button>
    `;
}

function attachRemoveWorkoutListener(day) {
    const removeBtn = document.querySelector(`.btn-remove-workout[data-day="${day}"]`);
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            removeWorkout(day);
        });
    }
}

function removeWorkout(day) {
    if (confirm('Are you sure you want to remove this workout?')) {
        delete workouts[day];
        localStorage.setItem('workouts', JSON.stringify(workouts));
        loadAllWorkouts();
        updateDashboard(); // Update dashboard stats
    }
}

function capitalizeDay(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
