"use client";

import CreateTasks from "./create-tasks";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef, useEffect } from "react";
import { handleSubmit } from "@/lib/utils/handle-submit";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { insertArea } from "@/features/area-slice";
import { CircleAlert } from "lucide-react";
import {
    handleAreaChange,
    handleNoteChange,
    resetForm,
    handleEmptyTasks,
} from "@/features/form-slice";
import { InputChangeEvent, TSC } from "@/lib/types";

export default function CreateArea({ userId }: { userId: string }) {
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
    const [prevAreaInput, setPrevAreaInput] = useState("");
    const [inputError, setInputError] = useState("");

    // Helper variable to store the trimmed area name
    const areaName = area.trim();

    // Reset form and focus on area input
    useEffect(() => {
        dispatch(resetForm());
        areaRef.current?.focus();
    }, [dispatch]);

    // Handle form submission and subsequent actions
    const submitForm = async (event: FormEvent) => {
        event.preventDefault();

        // Set an error if the area or tasks array is empty
        if (!validateForm() || !isAreaChanged()) return;

        setIsLoading(true);

        // Handle Submit
        const response = await handleSubmit({ userId, area, note, tasks });
        isDuplicateArea(response);

        setIsLoading(false);
    };

    // Validate form data function
    const validateForm = () => {
        if (!areaName) setInputError("Area cannot be empty!");
        if (!tasks.length) dispatch(handleEmptyTasks("Tasks cannot be empty!"));
        if (areaName.length > 20) setInputError("Only 20 characters allowed!");

        return areaName && tasks.length && areaName.length <= 20;
    };

    // Duplicate area handler function
    const isAreaChanged = () => {
        const areaChanged = prevAreaInput !== areaName;
        if (!areaChanged) setInputError(`'${areaName}' already exists!`);

        return areaChanged;
    };

    // Check duplicate area name
    const isDuplicateArea = (response: TSC | any) => {
        if (response?.duplicate) {
            setPrevAreaInput(areaName);
            setInputError(`'${areaName}' already exists!`);
        } else if (response?.areaId) {
            router.push(`/areas/${response.areaId}`);
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
            if (!areaName) {
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
                    <div className="w-full flex-between py-4">
                        <h2 className="text-xl px-4 opacity-80">Create Area</h2>
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
                            labelClasses="border-b p-4 w-full"
                            name="area"
                            value={area}
                            className="w-full h-10 rounded-md mt-1"
                            onChange={handleAreaChangeFunc}
                            onKeyDown={(e) => handleKeyPress(e, noteRef)}
                            // required
                        >
                            {inputError && (
                                <span className="flex-start mt-2 text-sm gap-1 opacity-80 text-[#f93a37] -z-10">
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
