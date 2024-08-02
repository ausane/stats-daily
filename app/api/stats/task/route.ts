import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Task } from "@/models/task.model";
import { Stats } from "@/models/stats.model";
import type { TStat, TTask } from "@/lib/types";
import mongoose, { ObjectId } from "mongoose";

// GET REQUEST HANDLER
export async function GET() {
    await connectToDatabase();

    try {
        const findTasks = await Task.find({})
            .then((data) => data)
            .catch((error) => console.error(error));

        return NextResponse.json(findTasks);
    } catch (error) {
        console.log(error);
    }
}

// POST REQUEST HANDLER
export async function POST(request: NextRequest) {
    // console.log(req);
    await connectToDatabase();

    try {
        const data: any = await request.json();
        console.log(data);

        if (!data.area.trim() || !data.tasks.length) {
            return NextResponse.json(
                {
                    message:
                        "Required fields 'area' and 'tasks' cannot be empty.",
                },
                { status: 400 }
            );
        }

        const prevArea = await Task.findOne({ area: data.area });

        if (prevArea) {
            // console.log(area);
            return NextResponse.json(
                {
                    duplicate: true,
                    message: `An area with the name '${prevArea.area}' already exists.`,
                },
                { status: 409 }
            );
        }

        const newTask = await Task.create(data);
        console.log("newTask:", newTask);

        return NextResponse.json({ _id: newTask._id, area: newTask.area });
    } catch (error) {
        console.error("error:", error);
        return NextResponse.json(
            { error: "Please enter valid stats" },
            { status: 400 }
        );
    }
}

// PATCH REQUEST HANDLER
export async function PATCH(request: NextRequest) {
    await connectToDatabase();

    try {
        const { id, taskId, task, note, area } = await request.json();
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

        console.log(id, isValidObjectId);

        if (!isValidObjectId) {
            return NextResponse.json(
                {
                    message: "Invalid ID. Please check and try again.",
                },
                { status: 400 }
            );
        }

        if (id && area) {
            const prevArea = await Task.findOne({ area });

            if (prevArea) {
                return NextResponse.json(
                    {
                        duplicate: true,
                        message: `An area with the name '${prevArea.area}' already exists.`,
                    },
                    { status: 409 }
                );
            }

            const updatedArea = await Task.findByIdAndUpdate(
                id,
                { $set: { area } },
                { new: true }
            );

            if (!updatedArea) {
                return NextResponse.json(
                    { message: "No such area exists in the database." },
                    { status: 400 }
                );
            }
        }

        // console.log(taskId, task);
        if (id && task && taskId) {
            const updatedStats = await Task.findByIdAndUpdate(
                id,
                // Task's items should not be empty
                { $set: { "tasks.$[elem]": task } },
                {
                    new: true,
                    arrayFilters: [{ "elem._id": taskId }],
                    runValidators: true,
                }
            );

            // console.log(updatedStats);

            if (!updatedStats) {
                return NextResponse.json(
                    { message: "No such area exists in the database." },
                    { status: 400 }
                );
            }
        }

        if (id && note) {
            const updatedStats = await Task.findByIdAndUpdate(
                id,
                { $set: { note } },
                { new: true }
            );

            // console.log(updatedStats);

            if (!updatedStats) {
                return NextResponse.json(
                    { message: "No such area exists in the database." },
                    { status: 400 }
                );
            }
        }

        if (id && task && !taskId) {
            const updatedTask: TStat | null = await Task.findByIdAndUpdate(
                id,
                { $push: { tasks: task } },
                { new: true }
            );

            if (!updatedTask) {
                return NextResponse.json(
                    { message: "No such area exists in the database." },
                    { status: 400 }
                );
            } else {
                const newIncompleteTasks = updatedTask.tasks?.filter(
                    (task) => task.completed === false
                );

                return NextResponse.json(
                    { newIncompleteTasks },
                    { status: 200 }
                );
            }
        }

        // console.log(preStats);
        return NextResponse.json(
            { id: id, message: "Data updated" },
            { status: 200 }
        );
    } catch (error) {
        // return console.log(error);
        return NextResponse.json(
            { message: "Some error occured" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id, taskId } = await request.json();
        // console.log(id);

        if (id && taskId) {
            const result = await Task.findByIdAndUpdate(
                id,
                { $pull: { tasks: { _id: taskId } } },
                { new: true }
            );

            console.log(result);
            return NextResponse.json(
                // { message: `Task deleted` },
                { status: 204 }
            );
        } else if (id) {
            const area = await Task.findByIdAndDelete(id);

            return NextResponse.json({
                message: `Area '${area.area}' deleted`,
                area: area,
            });
        } else {
            return NextResponse.json({
                error: `No such item exists in the database.`,
            });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error: "Some error occured",
        });
    }
}
