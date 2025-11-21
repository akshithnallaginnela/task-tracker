import React, { useEffect, useState } from 'react';

const Alarm = ({ tasks }) => {
    const [alarmPlaying, setAlarmPlaying] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [acknowledgedTaskIds, setAcknowledgedTaskIds] = useState(new Set());

    // Simple beep sound (base64 encoded WAV)
    // This is a short 1-second beep generated for testing purposes.
    const beepSound = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU";
    // The above is too short/invalid. Let's use a proper one or a reliable URL.
    // Since I cannot easily generate a long base64 string here without bloating the context, 
    // I will use a very reliable CDN URL that is known to work, or use the SpeechSynthesis API which is built-in.

    // SpeechSynthesis is the safest bet for "no external dependencies" and "no download".

    useEffect(() => {
        const checkAlarms = () => {
            const now = new Date();
            tasks.forEach(task => {
                if (!task.isCompleted && !alarmPlaying && !acknowledgedTaskIds.has(task._id)) {
                    const dueDate = new Date(task.dueDate);
                    const diff = now - dueDate;

                    if (dueDate <= now && diff < 60000) {
                        triggerAlarm(task);
                    }
                }
            });
        };

        const interval = setInterval(checkAlarms, 1000);
        return () => clearInterval(interval);
    }, [tasks, alarmPlaying, acknowledgedTaskIds]);

    const triggerAlarm = (task) => {
        setAlarmPlaying(true);
        setCurrentTask(task);

        // Try SpeechSynthesis first as it is most reliable without external files
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`Task due: ${task.title}`);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            // Loop it by re-triggering in onend, or just play it once/twice.
            // For an alarm, we want it to persist.

            const playLoop = () => {
                if (window.alarmActive) {
                    window.speechSynthesis.speak(utterance);
                }
            };

            utterance.onend = () => {
                // simple delay then loop
                setTimeout(playLoop, 1000);
            };

            window.alarmActive = true;
            playLoop();
        } else {
            // Fallback to Audio if speech not supported (rare)
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.loop = true;
            audio.play().catch(e => console.error("Audio play failed:", e));
            window.alarmAudio = audio;
        }
    };

    const stopAlarm = () => {
        // Stop Speech
        if ('speechSynthesis' in window) {
            window.alarmActive = false;
            window.speechSynthesis.cancel();
        }

        // Stop Audio
        if (window.alarmAudio) {
            window.alarmAudio.pause();
            window.alarmAudio = null;
        }

        setAlarmPlaying(false);

        if (currentTask) {
            setAcknowledgedTaskIds(prev => new Set(prev).add(currentTask._id));
        }
        setCurrentTask(null);
    };

    if (!alarmPlaying) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center animate-bounce">
                <h2 className="text-2xl font-bold text-red-600 mb-4">ALARM!</h2>
                <p className="text-xl mb-6">Task Due: {currentTask?.title}</p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={stopAlarm}
                        className="bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg"
                    >
                        Stop Alarm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Alarm;
