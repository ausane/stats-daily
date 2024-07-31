import { InputProps } from "@/lib/types";
import { forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, children, labelClasses, ...otherProps }, ref) => {
        return (
            <label className={labelClasses}>
                {label}
                <input {...otherProps} ref={ref} />
                {children}
            </label>
        );
    }
);

export default Input;
