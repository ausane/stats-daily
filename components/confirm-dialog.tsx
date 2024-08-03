import React from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompletionDialogProps, ConfirmDialogProps } from "@/lib/types";
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

export default function ConfirmDialog(props: ConfirmDialogProps) {
    const { message, onClick, buttonText, messageHeader } = props;
    return (
        <AlertDialog>
            <AlertDialogTrigger>{buttonText}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{messageHeader}</AlertDialogTitle>
                    <AlertDialogDescription>{message}</AlertDialogDescription>
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

export function CompletionDialog(props: CompletionDialogProps) {
    const { task, children, onClick, openDialog, setOpenDialog } = props;
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button className="status-button bg-transparent bbn hover:bg-yellow-400"></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex-start">
                        <CircleCheck color="#3DD68C" />
                        <p className="ml-2">Task Completed!</p>
                    </DialogTitle>
                    <DialogDescription className="flex-start flex-col gap-4">
                        <span>How much of this task have you completed?</span>
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
