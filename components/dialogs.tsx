import React from "react";
import { CircleCheck, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CompletionDialogProps,
  ConfirmDialogProps,
  RenameAreaDialogProps,
  ValidationAlertDialogProps,
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

export function ConfirmDeletionDialog(props: ConfirmDialogProps) {
  const { onClick, deleteDialog, setDeleteDialog } = props;

  return (
    <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
      <AlertDialogTrigger className="hidden">Open</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to delete this area?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this area
            and remove your all tasks from the area.
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

export function TaskCompletionDialog(props: CompletionDialogProps) {
  const { task, children, onClick, openDialog, setOpenDialog } = props;
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          role="button"
          tabIndex={0}
          className="status-button border-primary bg-transparent hover:border-yellow-400 hover:bg-yellow-400"
          aria-label="Mark as Done"
        ></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex-start mb-2">
            <CircleCheck size={24} color="#3DD68C" aria-hidden="true" />
            <span className="ml-2">Task Completed!</span>
          </DialogTitle>
          <DialogDescription className="text-inherit">
            How much of this task have you completed?
          </DialogDescription>
          <DialogDescription>{task}</DialogDescription>
        </DialogHeader>
        <div className="items-center gap-4 py-4">{children}</div>
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
  const { onClick, updating, dialog, openDialog, children } = props;
  return (
    <Dialog open={dialog} onOpenChange={openDialog}>
      <DialogTrigger className="hidden" asChild>
        <Button variant="outline">Rename Area</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Area</DialogTitle>
          <DialogDescription>
            Rename the area and then click the 'Save' button when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-end w-full">{children}</div>
        <DialogFooter>
          <Button type="submit" onClick={onClick} disabled={updating}>
            {updating ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ValidationAlertDialog(props: ValidationAlertDialogProps) {
  const { category, alertDialog, setAlertDialog } = props;
  return (
    <AlertDialog open={alertDialog} onOpenChange={setAlertDialog}>
      <AlertDialogTrigger className="hidden" asChild>
        <Button variant="outline">Open</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex-start gap-1">
            <CircleAlert aria-hidden="true" />
            {category === "task"
              ? `Task Character Limit Exceeded!`
              : `Note Character Limit Exceeded!`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {category === "task"
              ? `Your task description is too long. Please shorten it to 40 characters or fewer to proceed. This limit helps maintain clarity and consistency across all tasks.`
              : `Your note is too long. Please shorten it to 400 characters or fewer to proceed. This limit helps maintain clarity and consistency across the note.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction id="okay-button">Okay</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
