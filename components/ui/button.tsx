import { ButtonProps } from "@/lib/types";
import { forwardRef } from "react";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    props: ButtonProps,
    ref
) {
    const { children, className, variant, ...otherProps } = props;
    return (
        <button
            ref={ref}
            type="button"
            className={`${variant}-button ${className}`}
            {...otherProps}
        >
            {children}
        </button>
    );
});

export default Button;
