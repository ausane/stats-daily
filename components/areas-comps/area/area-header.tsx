"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteArea } from "@/lib/utils/handle-delete";
import { useAppDispatch } from "@/store/hooks";
import { removeAreaById, setCurrentArea } from "@/features/areaSlice";
import IconButton from "@/components/ui/icon-button";
import Input from "@/components/ui/input";
import { updateAreaName } from "@/lib/utils/handle-update";
import { ConfirmDeletionDialog } from "@/components/confirm-dialog";
import { InputChangeEvent, TaskItemCompoProps } from "@/lib/types";
import { ModeToggle } from "@/components/theme-provider";
import { handleKeyDownEnter } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleAlert, Pencil, User2, Trash, ChevronDown } from "lucide-react";
import { RenameAreaDialog } from "@/components/confirm-dialog";

export default function AreaHeader(props: { _id: string; area: string }) {
    const { _id, area } = props;

    const areaRef = useRef<HTMLInputElement>(null);

    const [inputError, setInputError] = useState(false);
    const [areaName, setAreaName] = useState(area);
    const [updating, setUpdating] = useState(false);
    const [areaInput, setAreaInput] = useState(areaName);
    const [dialog, openDialog] = useState(false);

    const dispatch = useAppDispatch();

    const handleAreaChange = (event: InputChangeEvent) => {
        setAreaInput(event.target.value);
        setInputError(false);
    };

    const openRenameAreaDialog = () => {
        openDialog(true);
        setAreaInput(areaName);
        setInputError(false);
    };

    const handleAreaUpdate = async () => {
        if (inputError) return;
        if (!areaInput) {
            setInputError(true);
            return;
        }

        setUpdating(true);

        const response = await updateAreaName(_id, areaInput);

        if (response && response.duplicate) {
            setInputError(response.message);
        } else {
            setInputError(false);
            setAreaName(areaInput);
            dispatch(setCurrentArea({ _id, area: areaInput }));
            openDialog(false);
        }

        setUpdating(false);
    };

    return (
        <div className="w-full">
            <div className="w-full max-md:pl-16 relative flex-between gap-4 py-4 overflow-x-hidden">
                <div className="flex-start gap-4 group">
                    <TaskItemCompo
                        areaId={_id}
                        areaName={areaName}
                        openRenameAreaDialog={openRenameAreaDialog}
                    />
                </div>

                <div className="flex gap-4 z-40">
                    <ModeToggle />
                    <IconButton className="h-10 w-10">
                        <User2 size={20} />
                    </IconButton>
                </div>
            </div>

            <RenameAreaDialog
                dialog={dialog}
                updating={updating}
                onClick={handleAreaUpdate}
                openDialog={openDialog}
            >
                <div className="w-full flex items-end justify-center flex-col gap-2">
                    <Input
                        label="Area"
                        ref={areaRef}
                        name="area"
                        value={areaInput}
                        onChange={handleAreaChange}
                        className="h-10 w-3/4"
                        labelClasses="w-full flex-end gap-4"
                        onKeyDown={(e) =>
                            handleKeyDownEnter(e, handleAreaUpdate)
                        }
                    />
                    {(!areaInput || inputError) && (
                        <span className="flex-start gap-1 text-sm text-[#f93a37] opacity-80">
                            <CircleAlert size={15} />
                            {!areaInput && <span>Area cannot be empty!</span>}
                            {inputError && <span>{inputError}</span>}
                        </span>
                    )}
                </div>
            </RenameAreaDialog>
        </div>
    );
}

export function TaskItemCompo(props: TaskItemCompoProps) {
    const { areaId, areaName, openRenameAreaDialog } = props;
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [deleteDialog, setDeleteDialog] = useState(false);

    const handleDelete = async () => {
        await deleteArea(areaId);
        dispatch(removeAreaById(areaId));
        router.push("/areas/create");
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="border-0 outline-0 z-10 flex gap-1"
                    >
                        <h2 className="text-xl truncate max-w-[80%] opacity-80">
                            {areaName}
                        </h2>
                        <ChevronDown className="opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-20">
                    <DropdownMenuItem onClick={openRenameAreaDialog}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Confirm Delete Dialog Component */}
            <ConfirmDeletionDialog
                deleteDialog={deleteDialog}
                setDeleteDialog={setDeleteDialog}
                onClick={handleDelete}
            />
        </>
    );
}
