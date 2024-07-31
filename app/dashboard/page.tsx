"use client";

import { useState, useRef } from "react";

const TaskInput = () => {
    const [inputtask, setInputtask] = useState("");
    const inputRef = useRef(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            // Handle enter key press
            console.log("Enter key pressed:", inputtask);
            // Optionally, you can clear the input field
            setInputtask("");
        }
    };

    return (
        <input
            ref={inputRef}
            type="text"
            name="task"
            value={inputtask}
            onChange={(e) => setInputtask(e.target.value)}
            onKeyDown={handleKeyDown}
            className="form-input mt-1 block w-full"
        />
    );
};

export default TaskInput;
