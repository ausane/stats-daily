"use client";

import CreateTasks from "./create-tasks";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef, useEffect } from "react";
import { handleSubmit } from "@/lib/utils/handle-submit";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { insertArea } from "@/features/areaSlice";
import { CircleAlert } from "lucide-react";
import {
    handleAreaChange,
    handleNoteChange,
    resetForm,
    handleErrMsg,
} from "@/features/formSlice";
import { InputChangeEvent } from "@/lib/types";

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
    const [prevAreaValue, setPrevAreaValue] = useState(area);
    const [inputError, setInputError] = useState("");

    // Reset form and focus on area input
    useEffect(() => {
        dispatch(resetForm());
        areaRef.current?.focus();
    }, [dispatch]);

    // Handle form submission and subsequent actions
    const submitForm = async (event: FormEvent) => {
        event.preventDefault();

        if (prevAreaValue === area) {
            return;
        } else {
            setInputError("");
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
            !area.trim() && setInputError("Area cannot be empty");
            !tasks.length && dispatch(handleErrMsg("Tasks cannot be empty"));
        }

        setIsLoading(false);
    };

    // Check duplicate area name
    const isDuplicateArea = (response: any) => {
        if (response?.duplicate) {
            setInputError(response.message);
        } else if (response?._id) {
            router.push(`/areas/${response._id}`);
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
            if (!area.trim()) {
                setInputError("Area cannot be empty!");
                dispatch(handleAreaChange(""));
                return;
            }
            if (nextRef.current) nextRef.current.focus();
        }
    };

    // Handle area input onChange event
    const handleAreaChangeFunc = (event: InputChangeEvent) => {
        const value = event.target.value;
        setInputError(value ? "" : "Area cannot be empty!");
        dispatch(handleAreaChange(value));
    };

    return (
        <div className="w-3/4 h-full overflow-auto p-4 pt-0 max-md:w-full">
            <form
                onSubmit={submitForm}
                className="w-full h-full flex-between flex-col gap-4 max-sm:h-auto"
            >
                <div className="w-full flex-start flex-col sticky top-0 bg-background max-md:pl-16">
                    <div className="w-full flex-between px-4 py-4">
                        <h2 className="text-xl font-bold">Create Area</h2>
                        <Button
                            type="submit"
                            className="text-[#fafafa] bg-green-700 hover:bg-green-800"
                            disabled={isLoading} // Disable button when loading
                        >
                            {isLoading ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </div>
                <div className="flex grow h-4/5 w-full max-sm:flex-col bbn rounded-md">
                    <div className="w-2/5 flex flex-col max-sm:w-full">
                        <Input
                            ref={areaRef}
                            label="Area"
                            labelClasses="border-b p-4 w-full h-24"
                            name="area"
                            value={area}
                            className="w-full h-10 rounded-md mt-1"
                            onChange={handleAreaChangeFunc}
                            onKeyDown={(e) => handleKeyPress(e, noteRef)}
                            // required
                        >
                            {inputError && (
                                <span className="flex-start mt-2 text-sm gap-1 opacity-80 text-red-500 -z-10">
                                    <CircleAlert size={15} />
                                    <span>{inputError}</span>
                                </span>
                            )}
                        </Input>

                        <label className="h-full w-full p-4 grow max-sm:border-b">
                            Note
                            <textarea
                                name="note"
                                value={note}
                                ref={noteRef}
                                onChange={(e) =>
                                    dispatch(handleNoteChange(e.target.value))
                                }
                                className="w-full h-[calc(100%-28px)] resize-none p-1 bg-transparent bbn rounded-md min-h-20 max-sm:resize-y mt-1"
                            />
                        </label>
                    </div>

                    <CreateTasks />
                </div>
            </form>
        </div>
    );
}
