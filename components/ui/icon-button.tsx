import clsx from "clsx";
import { Button } from "./button";
import { ButtonProps } from "./button";

export type IconButtonProps = ButtonProps & {
    children: React.ReactNode;
    circle?: boolean;
};

export default function IconButton({
    children,
    variant = "outline",
    circle,
    className,
    ...btnAttr
}: IconButtonProps) {
    return (
        <Button
            variant={variant}
            size="icon"
            className={clsx("w-8 h-8 p-2", circle && "rounded-full", className)}
            {...btnAttr}
        >
            {children}
        </Button>
    );
}
