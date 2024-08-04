"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteArea } from "@/lib/utils/handle-delete";
import { useAppDispatch } from "@/store/hooks";
import { removeAreaById, setCurrentArea } from "@/features/areaSlice";
import IconButton from "@/components/ui/icon-button";
import Input from "@/components/ui/input";
import { updateAreaName } from "@/lib/utils/handle-update";
import ConfirmDialog from "@/components/confirm-dialog";
import { TaskItemCompoProps } from "@/lib/types";
import { ModeToggle } from "@/components/theme-provider";
import { handleKeyDownEnter } from "@/lib/constants";
import {
    Check,
    CircleAlert,
    LoaderCircle,
    Pencil,
    X,
    User2,
    PanelLeft,
} from "lucide-react";

export default function AreaHeader({
    _id,
    area,
}: {
    _id: string;
    area: string;
}) {
    const areaRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [areaDisplay, setAreaDisplay] = useState(false);
    const [areaInput, setAreaInput] = useState("");
    const [areaName, setAreaName] = useState(area);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (areaDisplay) areaRef.current?.focus();
    }, [areaDisplay]);

    const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAreaName(event.target.value);
        setError(false);
    };

    const handleClose = () => {
        setAreaDisplay(false);
        setAreaName(areaInput);
        setError(false);
    };

    const handleAreaUpdate = async () => {
        if (error) return;
        if (!areaName) {
            setError(true);
            return;
        }

        setUpdating(true);
        const response = await updateAreaName(_id, areaName);

        if (response && response.duplicate) {
            setError(response.message);
        } else {
            setAreaInput(areaName);
            setAreaDisplay(false);
            dispatch(setCurrentArea({ _id, area: areaName }));
        }

        setUpdating(false);
    };

    return (
        <div className="w-full">
            <div className="w-full flex-between gap-4 mb-4">
                <div className="max-md:flex hidden">
                    <IconButton className="w-10 h-10">
                        <PanelLeft />
                    </IconButton>
                </div>
                <div className="flex-start gap-4 group">
                    {areaDisplay ? (
                        <>
                            <span className="relative flex-start">
                                <Input
                                    ref={areaRef}
                                    name="area"
                                    value={areaName}
                                    onChange={handleAreaChange}
                                    onKeyDown={(e) =>
                                        handleKeyDownEnter(e, handleAreaUpdate)
                                    }
                                />
                                {!areaName && (
                                    <span className="empty-alert">
                                        <CircleAlert size={15} />
                                        <span>Area cannot be empty!</span>
                                    </span>
                                )}
                            </span>

                            <AreaUpdateIcons
                                updating={updating}
                                handleAreaUpdate={handleAreaUpdate}
                                handleClose={handleClose}
                            />
                        </>
                    ) : (
                        <TaskItemCompo
                            areaId={_id}
                            areaName={areaName}
                            setAreaInput={setAreaInput}
                            setAreaDisplay={setAreaDisplay}
                        />
                    )}
                </div>
                <div className="flex gap-4">
                    <ModeToggle />
                    <IconButton className="h-10 w-10">
                        <User2 size={20} />
                    </IconButton>
                </div>
            </div>

            {error && (
                <span className="flex-start gap-1 text-sm text-red-400">
                    <CircleAlert size={15} />
                    <span>{error}</span>
                </span>
            )}
        </div>
    );
}

export function TaskItemCompo(props: TaskItemCompoProps) {
    const { areaId, areaName, setAreaInput, setAreaDisplay } = props;
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        await deleteArea(areaId);
        dispatch(removeAreaById(areaId));
        router.push("/areas/create");
    };

    return (
        <>
            <h2 className="text-2xl truncate max-w-[80%]">{areaName}</h2>
            <IconButton
                variant="ghost"
                circle={true}
                className="opacity-0 group-hover:opacity-100"
                onClick={() => {
                    setAreaInput(areaName);
                    setAreaDisplay(true);
                }}
            >
                <Pencil color="white" size={18} />
            </IconButton>
            <ConfirmDialog
                buttonText="Delete"
                messageHeader="Do you want to delete this area?"
                message="This action cannot be undone. This will permanently
    delete this area and remove your all tasks from the area."
                onClick={handleDelete}
            />
        </>
    );
}

export function AreaUpdateIcons({
    updating,
    handleAreaUpdate,
    handleClose,
}: {
    updating: boolean;
    handleAreaUpdate: () => void;
    handleClose: () => void;
}) {
    if (updating) {
        return <LoaderCircle className="animate-spin" />;
    } else {
        return (
            <span className="flex-between gap-2">
                <IconButton onClick={handleAreaUpdate}>
                    <Check size={18} />
                </IconButton>
                <IconButton onClick={handleClose}>
                    <X size={18} />
                </IconButton>
            </span>
        );
    }
}
