import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function ConfirmDialog({
    buttonText,
    messageHeader,
    message,
    // children,
    onClick,
}: // buttonType,

{
    buttonText: string;
    messageHeader: string;
    message: string;
    // children: React.ReactNode;
    // buttonType?: string;
    onClick: () => void;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger>{buttonText}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {messageHeader}
                        {/* Are you absolutely sure? */}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                        {/* This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers. */}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={onClick}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

export function DialogDemo({
    task,
    children,
    onClick,
    openDialog,
    setOpenDialog,
}: {
    task: string;
    children: React.ReactNode;
    onClick: () => void;
    openDialog: boolean;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button className="w-4 h-4 bbn rounded-full p-0 bg-yellow-400 hover:bg-yellow-500"></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex-start">
                        <CircleCheck color="#3DD68C" />
                        <p className="ml-2">Task Completed!</p>
                    </DialogTitle>
                    <DialogDescription>
                        {/* Make changes to your profile here. Click save when
                        you're done. */}
                        How much of this task have you completed?
                        <br />
                        <br />
                        <code>{task}</code>
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="items-center gap-4">{children}</div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={onClick}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
