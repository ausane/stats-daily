import { InputProps } from "@/lib/types";
import { forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props: InputProps, ref) {
    const { label, children, labelClasses, ...otherProps } = props;
    return (
        <label className={labelClasses}>
            {label}
            <input {...otherProps} ref={ref} />
            {children}
        </label>
    );
});

export default Input;
