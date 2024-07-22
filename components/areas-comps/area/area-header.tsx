"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteArea } from "@/lib/utils/handle-delete";
import { useAppDispatch } from "@/store/hooks";
import { removeAreaById, setCurrentArea } from "@/features/areaSlice";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import IconButton from "@/components/icon-button";
import { updateAreaName } from "@/lib/utils/handle-update";
import Image from "next/image";

export default function AreaHeader({ _id, area }: { _id: string; area: string }) {
    const [error, serError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [areaInput, setAreaInput] = useState({ value: "", display: false });
    const [areaName, setAreaName] = useState(area);

    const areaRef = useRef<HTMLInputElement>(null);

    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (areaInput.display) {
            areaRef.current?.focus();
        }
    }, [areaInput.display]);

    const handleDelete = async () => {
        setIsLoading(true);
        await deleteArea(_id);
        dispatch(removeAreaById(_id));
        router.push("/dashboard/create");
        setIsLoading(false);
    };

    const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAreaName(event.target.value);
        serError(false);
    };

    const handleClose = () => {
        setAreaInput((prev) => ({ ...prev, display: false }));
        setAreaName(areaInput.value);
        serError(false);
    };

    const handleAreaUpdate = async () => {
        if (error) return;
        setUpdating(true);
        // console.log(_id);
        const response = await updateAreaName(_id, areaName);

        if (response && response.duplicate) {
            serError(response.message);
        } else {
            setAreaInput({ value: areaName, display: false });
            dispatch(setCurrentArea({ _id, area: areaName }));
        }

        setUpdating(false);
    };

    return (
        <div className="w-full p-4 bbn rounded-md">
            <div className="flex-between">
                <span className="flex-between gap-4">
                    {areaInput.display ? (
                        <>
                            <Input
                                ref={areaRef}
                                name="area"
                                value={areaName}
                                className="w-4/5"
                                onChange={handleAreaChange}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        handleAreaUpdate();
                                    }
                                }}
                            />
                            {updating ? (
                                <Image
                                    src="/loading.svg"
                                    alt="updating"
                                    width={18}
                                    height={18}
                                    className="animate-spin"
                                />
                            ) : (
                                <span className="flex-between gap-2">
                                    <IconButton
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
                                    />
                                </span>
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold">{areaName}</h2>
                            <IconButton
                                variant="circle"
                                onClick={() => setAreaInput({ value: areaName, display: true })}
                                src="/pencil.svg"
                                alt="edit"
                                width={18}
                                height={18}
                            />
                        </>
                    )}
                </span>
                <span className="flex-between">
                    <Button
                        variant="rect"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="hover:border-red-700 hover:text-red-500"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </span>
            </div>
            {error && <p className="text-red-400">{error}</p>}
        </div>
    );
}
