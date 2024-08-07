import React from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    CompletionDialogProps,
    ConfirmDialogProps,
    RenameAreaDialogProps,
} from "@/lib/types";
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
    const { onClick, deleteDialog, setDeleteDialog } = props;

    return (
        <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
            <AlertDialogTrigger className="hidden">Open</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Do you want to delete this area?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this area and remove your all tasks from the
                        area.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={onClick}
                    >
                        Delete
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
                <Button className="status-button bg-transparent border-primary hover:border-border hover:bg-yellow-400"></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex-start">
                        <CircleCheck color="#3DD68C" />
                        <p className="ml-2">Task Completed!</p>
                    </DialogTitle>
                    <DialogDescription className="flex items-start flex-col gap-2 pl-8">
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

export function RenameAreaDialog(props: RenameAreaDialogProps) {
    const { onClick, renameDialog, setRenameDialog, children } = props;
    return (
        <Dialog open={renameDialog} onOpenChange={setRenameDialog}>
            <DialogTrigger className="hidden" asChild>
                <Button variant="outline">Rename Area</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rename Area</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full flex-end">{children}</div>
                <DialogFooter>
                    <Button type="submit" onClick={onClick}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
