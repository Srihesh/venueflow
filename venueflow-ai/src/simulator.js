import { ref, set } from "firebase/database";
import { db } from "./firebase";

export const START_SIMULATION = () => {
    console.log("Simulator Started!");
    setInterval(() => {
        // Gates (A, B, C, D)
        const gates = {
            A: Math.floor(Math.random() * 20),
            B: Math.floor(Math.random() * 45),
            C: Math.floor(Math.random() * 15),
            D: Math.floor(Math.random() * 30),
        };

        // Staff Assignments
        const staff = {
            "Gate A": 4,
            "Gate B": 2,
            "Gate C": 5,
            "Gate D": 3,
            "Main Concourse": 10,
            "VIP Lounge": 2,
        };

        // Concessions
        const concessions = [
            { id: 1, name: "Burger Stand", waitTime: Math.floor(Math.random() * 15) },
            { id: 2, name: "Beer & Pretzels", waitTime: Math.floor(Math.random() * 25) },
            { id: 3, name: "Ice Cream Cart", waitTime: Math.floor(Math.random() * 5) }
        ];

        // Zones with crowd levels (0.0 to 1.0)
        // Helps generating heatmap logic: Green (0-0.4), Yellow(0.4-0.7), Red(0.7-1.0)
        const zones = {
            "North Stand": Math.random(),
            "South Stand": Math.random(),
            "East Stand": Math.random(),
            "West Stand": Math.random(),
            "Central Pitch": Math.random(),
        };

        set(ref(db, 'venueData'), {
            gates,
            staff,
            concessions,
            zones,
            timestamp: Date.now()
        });
    }, 5000);
};
