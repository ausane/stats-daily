"use client";

import { useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { deleteArea } from "@/lib/services/handle-delete";
import { useAppDispatch } from "@/store/hooks";
import { removeAreaById, setCurrentArea } from "@/features/area-slice";
import Input from "@/components/ui/input";
import { updateAreaName } from "@/lib/services/handle-update";
import { ConfirmDeletionDialog } from "@/components/dialogs";
import {
  AreaHeaderProps,
  InputChangeEvent,
  TaskItemCompoProps,
  TUser,
} from "@/lib/types";
import { ModeToggle } from "@/components/theme-provider";
import { handleKeyDownEnter } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CircleAlert,
  Pencil,
  Trash,
  ChevronDown,
  StickyNote,
  List,
} from "lucide-react";
import { RenameAreaDialog } from "@/components/dialogs";
import UserProfile from "@/components/user-icon";
import { areaNameLength } from "@/lib/constants";

export default function AreaHeader(props: AreaHeaderProps) {
  const { areaId, area, user } = props;

  const areaRef = useRef<HTMLInputElement>(null);

  const [inputError, setInputError] = useState("");
  const [areaName, setAreaName] = useState(area);
  const [prevAreaInput, setPrevAreaInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [areaInput, setAreaInput] = useState(areaName);
  const [dialog, openDialog] = useState(false);

  const tAreaInput = areaInput.trim();

  const dispatch = useAppDispatch();

  const handleAreaChange = (event: InputChangeEvent) => {
    setAreaInput(event.target.value);
    setInputError("");
  };

  const openRenameAreaDialog = () => {
    openDialog(true);
    setAreaInput(areaName);
    setInputError("");
  };

  const handleAreaUpdate = async () => {
    // Validate input area name
    if (!validateAreaName()) return;

    setUpdating(true);

    const response = await updateAreaName(areaId, areaInput);

    if (response && response.duplicate) {
      setPrevAreaInput(tAreaInput);
      setInputError(`'${tAreaInput}' already exists!`);
    } else {
      setInputError("");
      setAreaName(areaInput);
      dispatch(setCurrentArea({ areaId, area: tAreaInput }));
      openDialog(false);
    }

    setUpdating(false);
  };

  const validateAreaName = () => {
    if (inputError) return false;

    if (!tAreaInput) {
      setAreaInput("");
      setInputError("Area cannot be empty!");
      return false;
    }

    if (tAreaInput.length > areaNameLength) {
      setInputError(`Only ${areaNameLength} characters allowed!`);
      return false;
    }

    if (prevAreaInput === tAreaInput) {
      setInputError(`'${tAreaInput}' already exists!`);
      return false;
    }

    return true;
  };

  return (
    <div className="w-full max-sm:px-4">
      <div className="flex-between relative w-full gap-4 overflow-x-hidden py-4 max-md:pl-14 max-sm:pl-10">
        <div className="flex-start max-w-[80%] max-sm:max-w-[60%]">
          <TaskItemCompo
            areaId={areaId}
            areaName={areaName}
            openRenameAreaDialog={openRenameAreaDialog}
          />
        </div>

        <div className="z-20 flex gap-4">
          <ModeToggle />
          <UserProfile user={user} />
        </div>
      </div>

      <RenameAreaDialog
        dialog={dialog}
        updating={updating}
        onClick={handleAreaUpdate}
        openDialog={openDialog}
      >
        <div className="flex w-full flex-col items-end justify-center gap-2">
          <Input
            label="Area"
            ref={areaRef}
            name="area"
            value={areaInput}
            onChange={handleAreaChange}
            className="h-10 w-3/4"
            labelClasses="w-full flex-end gap-4"
            onKeyDown={(e) => handleKeyDownEnter(e, handleAreaUpdate)}
          />
          {inputError && (
            <span
              role="alert"
              aria-live="assertive"
              className="flex-start gap-1 text-sm text-[#f93a37] opacity-80"
            >
              <CircleAlert size={15} aria-hidden="true" />
              <span>{inputError}</span>
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
  const pathname = usePathname();

  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDelete = async () => {
    await deleteArea(areaId);
    dispatch(removeAreaById(areaId));
    router.push("/areas/create");
  };

  const matcher = /^\/areas\/[0-9a-f]{24}\/note$/;
  const showTask = matcher.test(pathname);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex-center z-10 w-full gap-1 border-0 outline-0"
          >
            <h2 className="truncate text-xl opacity-80 max-md:text-lg">
              {areaName}
            </h2>
            <ChevronDown
              size={18}
              className="w-5 opacity-50"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32">
          {showTask ? (
            <DropdownMenuItem
              onClick={() => router.push(`/areas/${areaId}`)}
              className="max-md:hidden max-sm:flex max-sm:p-2 lg:hidden"
            >
              <List className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Tasks</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => router.push(`/areas/${areaId}/note`)}
              className="max-md:hidden max-sm:flex max-sm:p-2 lg:hidden"
            >
              <StickyNote className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Note</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="max-md:hidden max-sm:flex lg:hidden" />
          <DropdownMenuItem
            onClick={openRenameAreaDialog}
            className="max-sm:p-2"
          >
            <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteDialog(true)}
            className="max-sm:p-2"
          >
            <Trash className="mr-2 h-4 w-4 text-red-500" aria-hidden="true" />
            <span className="text-red-500">Delete</span>
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
