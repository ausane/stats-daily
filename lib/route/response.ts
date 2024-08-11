import { NextResponse } from "next/server";
import { TStat, TTask } from "../types";

// Response utility functions (these should stay here)

export function invalidAreaOrTasksResponse() {
    return NextResponse.json(
        {
            message: "Required fields 'area' and 'tasks' cannot be empty.",
        },
        { status: 400 }
    );
}

export function invalidStatsResponse() {
    return NextResponse.json(
        { error: "Please enter valid stats" },
        { status: 400 }
    );
}

export function invalidIdResponse() {
    return NextResponse.json(
        { message: "Invalid ID. Please check and try again." },
        { status: 400 }
    );
}

export function noAreaFoundResponse() {
    return NextResponse.json(
        { message: "No such area exists in the database." },
        { status: 400 }
    );
}

export function duplicateAreaResponse(area: string) {
    return NextResponse.json(
        { duplicate: true, message: `'${area}' already exists!` },
        { status: 409 }
    );
}

export function taskUpdatedResponse(id: string) {
    return NextResponse.json({ id, message: "Task updated!" }, { status: 200 });
}

export function noteUpdatedResponse(id: string) {
    return NextResponse.json({ id, message: "Note updated!" }, { status: 200 });
}

export function newIncompleteTasksResponse(
    newIncompleteTasks: TTask[] | undefined
) {
    return NextResponse.json({ newIncompleteTasks }, { status: 200 });
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
        message: `Area '${area?.area}' deleted`,
        area: area,
    });
}
