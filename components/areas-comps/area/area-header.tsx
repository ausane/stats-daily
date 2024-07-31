"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteArea } from "@/lib/utils/handle-delete";
import { useAppDispatch } from "@/store/hooks";
import { removeAreaById, setCurrentArea } from "@/features/areaSlice";
import IconButton from "@/components/ui/icon-button";
import Input from "@/components/ui/input";
// import IconButton from "@/components/icon-button";
import { updateAreaName } from "@/lib/utils/handle-update";
// import Image from "next/image";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/confirm-dialog";
import {
    Check,
    Trash,
    CircleAlert,
    LoaderCircle,
    Pencil,
    X,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AreaHeader({
    _id,
    area,
}: {
    _id: string;
    area: string;
}) {
    const [error, setError] = useState<boolean>(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [updating, setUpdating] = useState<boolean>(false);
    const [areaInput, setAreaInput] = useState<string>("");
    const [areaDisplay, setAreaDisplay] = useState<boolean>(false);
    const [areaName, setAreaName] = useState<string>(area);

    const areaRef = useRef<HTMLInputElement>(null);

    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (areaDisplay) {
            areaRef.current?.focus();
        }
    }, [areaDisplay]);

    const handleDelete = async () => {
        // setIsLoading(true);
        await deleteArea(_id);
        dispatch(removeAreaById(_id));
        router.push("/areas/create");
        // setIsLoading(false);
    };

    const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAreaName(event.target.value);
        setError(false);
    };

    const handleClose = () => {
        setAreaDisplay(false);
        setAreaName(areaInput);
        // setAreaInput((prev) => ({ ...prev, display: false }));
        // setAreaName(areaInput.value);
        setError(false);
    };

    const handleAreaUpdate = async () => {
        if (error) return;
        if (!areaName) {
            setError(true);
            return;
        }
        setUpdating(true);
        // console.log(_id);
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
        <div className="w-full p-4 bbn rounded-md">
            <div className="w-full flex-between">
                <span className="w-4/5 flex-start gap-4 group">
                    {areaDisplay ? (
                        <>
                            <span className="relative flex-start">
                                <Input
                                    ref={areaRef}
                                    name="area"
                                    value={areaName}
                                    className="h-10 w-64 rounded-md"
                                    onChange={handleAreaChange}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleAreaUpdate();
                                        }
                                    }}
                                />
                                {!areaName && (
                                    <span className="absolute ml-2 flex-start text-sm gap-1 opacity-50 text-red-500 -z-10">
                                        <CircleAlert size={15} />
                                        <span>Area could not be empty!</span>
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
                        <>
                            <h2
                                className="text-xl font-bold truncate max-w-[80%]"
                                // style={{ maxWidth: "80%" }}
                            >
                                {areaName}
                            </h2>
                            <IconButton
                                variant="ghost"
                                circle={true}
                                className="opacity-0 group-hover:opacity-100"
                                onClick={() => {
                                    setAreaInput(areaName);
                                    setAreaDisplay(true);
                                }}
                            >
                                <Pencil color="white" />
                            </IconButton>

                            {/* <IconButton
                                variant="circle"
                                onClick={() =>
                                    setAreaInput({
                                        value: areaName,
                                        display: true,
                                    })
                                }
                                src="/pencil.svg"
                                alt="edit"
                                width={18}
                                height={18}
                            /> */}
                        </>
                    )}
                </span>
                <span className="flex-between">
                    {/* <Button
                        variant="rect"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="hover:border-red-700 hover:text-red-500"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button> */}
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Ellipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <button
                                    className="flex-start"
                                    onClick={() =>
                                        setAreaInput({
                                            value: areaName,
                                            display: true,
                                        })
                                    }
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Rename</span>
                                </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Trash className="mr-2 h-4 w-4" />
                                <ConfirmDialog
                                    buttonText="Delete"
                                    messageHeader="Do you want to delete this area?"
                                    message="This action cannot be undone. This will permanently
                        delete this area and remove your all tasks from the area."
                                    onClick={handleDelete}
                                />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}

                    <ConfirmDialog
                        buttonText="Delete"
                        messageHeader="Do you want to delete this area?"
                        message="This action cannot be undone. This will permanently
                        delete this area and remove your all tasks from the area."
                        onClick={handleDelete}
                    />
                </span>
            </div>
            {error && <p className="text-red-400">{error}</p>}
        </div>
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
        return (
            <LoaderCircle className="animate-spin" />
            // <Image
            //     src="/loading.svg"
            //     alt="updating"
            //     width={18}
            //     height={18}
            //     className="animate-spin"
            // />
        );
    } else {
        return (
            <span className="flex-between gap-2">
                <IconButton
                    // variant="ghost"
                    // circle={true}
                    onClick={handleAreaUpdate}
                    // className="p-1"
                >
                    <Check />
                </IconButton>
                <IconButton
                    // variant="ghost"
                    // circle={true}
                    onClick={handleClose}
                    // className="p-1"
                >
                    <X />
                </IconButton>
                {/* <IconButton
                    variant="circle"
                    onClick={handleAreaUpdate}
                    src="/check.svg"
                    alt="update"
                    width={18}
                    height={18}
                />
                <IconButton
                    variant="circle"
                    onClick={handleClose}
                    src="/cross.svg"
                    alt="close"
                    width={15}
                    height={15}
                /> */}
            </span>
        );
    }
}
