"use client";

import CreateTasks from "./create-tasks";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef, useEffect } from "react";
import { handleSubmit } from "@/lib/utils/handle-submit";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { insertArea } from "@/features/areaSlice";
import { handleAreaChange, handleNoteChange, resetForm, handleErrMsg } from "@/features/formSlice";

export default function CreateArea() {
    // Retrieve all required states from the store
    const area = useAppSelector((state) => state.form.area);
    const note = useAppSelector((state) => state.form.note);
    const tasks = useAppSelector((state) => state.form.tasks);

    // Initialize all useRef elements
    const areaRef = useRef<HTMLInputElement>(null);
    const noteRef = useRef<HTMLTextAreaElement>(null);

    // Initialize dispatch function and router
    const dispatch = useAppDispatch();
    const router = useRouter();

    // State to manage loading status
    const [isLoading, setIsLoading] = useState(false);
    const [inputError, setInputError] = useState({ area, message: "" });

    // Reset form and focus on area input
    useEffect(() => {
        dispatch(resetForm());
        areaRef.current?.focus();
    }, []);

    // Handle form submission and subsequent actions
    const submitForm = async (event: FormEvent) => {
        event.preventDefault();

        if (inputError.area === area) {
            return;
        } else {
            setInputError({ area, message: "" });
        }

        setIsLoading(true); // Set loading to true when form is submitted

        // Form data object
        const formData = {
            area,
            note,
            tasks,
        };

        // Throw an error if the tasks array is empty
        if (area.trim() && tasks.length) {
            // Handle Submit
            const response = await handleSubmit(formData); // Use the submitForm function
            isDuplicateArea(response);
        } else {
            !area.trim() && setInputError({ area, message: "Area cannot be empty" });
            !tasks.length && dispatch(handleErrMsg("Tasks cannot be empty"));
        }

        setIsLoading(false);
    };

    // Check duplicate area name
    const isDuplicateArea = (response: any) => {
        if (response.duplicate) {
            setInputError({ area, message: response.message });
        } else {
            response._id && router.push(`/dashboard/${response._id}`);
            dispatch(insertArea(response));
            dispatch(resetForm());
        }
    };

    // Handle the onKeyDown event
    const handleKeyPress = (
        event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
        nextRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    return (
        <div className="w-full overflow-auto pb-8">
            <form onSubmit={submitForm} className="w-full flex-between flex-col gap-4">
                <div className="flex-between mb-2 w-full sticky top-0 border-b-0 bg-black bbn p-4">
                    <h2 className="text-xl font-bold">Create Area</h2>
                    <Button
                        variant="rect"
                        type="submit"
                        disabled={isLoading} // Disable button when loading
                    >
                        {isLoading ? "Creating..." : "Create"}
                    </Button>
                </div>
                <Input
                    ref={areaRef}
                    label="Area:"
                    labelClasses="block bbn p-4 w-full p-1"
                    name="area"
                    value={area}
                    className="w-full rounded-md mt-1"
                    onChange={(event) => dispatch(handleAreaChange(event.target.value))}
                    onKeyDown={(event) => handleKeyPress(event, noteRef)}
                    required
                >
                    {inputError && <p className="text-red-400">{inputError.message}</p>}
                </Input>

                <label className="block w-full bbn p-4">
                    Note:
                    <textarea
                        name="note"
                        value={note}
                        ref={noteRef}
                        onChange={(event) => dispatch(handleNoteChange(event.target.value))}
                        className="w-full p-1 bg-transparent bbn rounded-md min-h-20"
                        rows={4}
                    />
                </label>
                <CreateTasks />
            </form>
        </div>
    );
}
