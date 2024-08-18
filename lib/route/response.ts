import { NextResponse } from "next/server";
import { TStat, TTask } from "../types";
import { z } from "zod";

// Response utility functions

export function invalidStatsResponse() {
    return NextResponse.json(
        { error: "Please enter valid stats." },
        { status: 400 }
    );
}

export function invalidIdResponse() {
    return NextResponse.json(
        { error: "Invalid ID. Please check and try again." },
        { status: 400 }
    );
}

export function noAreaFoundResponse() {
    return NextResponse.json(
        { error: "No such area exists in the database." },
        { status: 400 }
    );
}

export function zodErrorResponse(error: z.ZodError) {
    return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
    );
}

export function duplicateAreaResponse(areaName: string) {
    return NextResponse.json(
        { duplicate: true, message: `'${areaName}' already exists!` },
        { status: 409 }
    );
}

export function newAreaCreatedResponse(newArea: TStat) {
    const { _id: areaId, area: areaName } = newArea;
    return NextResponse.json({ areaId, areaName }, { status: 201 });
}

export function areaRenamedResponse(id: string, area: string) {
    return NextResponse.json(
        { id, message: `Area renamed to '${area}'!` },
        { status: 200 }
    );
}

export function taskUpdatedResponse(id: string) {
    return NextResponse.json({ id, message: "Task updated!" }, { status: 200 });
}

export function noteUpdatedResponse(id: string) {
    return NextResponse.json({ id, message: "Note updated!" }, { status: 200 });
}

export function newIncompleteTasksResponse(newTasks: TTask[] | undefined) {
    return NextResponse.json({ newTasks }, { status: 200 });
}

export function incompleteDataResponse(id: string) {
    return NextResponse.json(
        { id, message: "Some data you may have missed!" },
        { status: 200 }
    );
}

export function errorResponse() {
    return NextResponse.json(
        { message: "Some error occurred!" },
        { status: 500 }
    );
}

export function areaDeletionResponse(area: TStat) {
    return NextResponse.json({
        message: `Area '${area?.area}' deleted!`,
        area,
    });
}
