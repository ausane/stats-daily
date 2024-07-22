import { TaskInputProps } from "@/lib/types";
import Input from "../ui/input";
import React, { forwardRef } from "react";

const TaskInput = forwardRef<(HTMLInputElement | null)[], TaskInputProps>(
    function TaskInput(props: TaskInputProps, ref) {
        const { submitBtn, inputAttributes, ...otherProps } = props;
        const refs = ref as React.MutableRefObject<(HTMLInputElement | null)[]>;

        const handleKeyDown =
            (index: number) =>
            (event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    const nextIndex = index + 1;

                    if (nextIndex < refs.current.length) {
                        refs.current[nextIndex]?.focus();
                    } else if (nextIndex === refs.current.length) {
                        submitBtn?.current?.click();
                    }
                }
            };

        return (
            <>
                {inputAttributes.map((input, index) => (
                    <Input
                        ref={(el) => {
                            refs.current[index] = el;
                        }}
                        key={index}
                        onKeyDown={handleKeyDown(index)}
                        {...otherProps}
                        {...input}
                    />
                ))}
            </>
        );
    }
);

export default TaskInput;
