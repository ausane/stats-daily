"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Button from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="w-full h-full flex-center">
            <div className="flex-center flex-col">
                <h2 className="mb-4">Something went wrong!</h2>
                <Button
                    variant="rect"
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                >
                    Try again
                </Button>
            </div>
        </div>
    );
}
