import React, { ReactNode } from "react";

export function TaskState({ children }: { children: ReactNode }) {
    return <span className="w-12 flex-center">{children}</span>;
}

export function TaskContent({ children }: { children: ReactNode }) {
    return (
        <span className="relative flex-start w-[calc(100%-8rem)] h-auto">
            {children}
        </span>
    );
}

export function TaskOptions({ children }: { children: ReactNode }) {
    return <span className="flex-around w-20">{children}</span>;
}
