import { forwardRef } from "react";
// import { ButtonProps, IconButtonProps } from "@/lib/types";
import Image, { ImageProps } from "next/image";
import { imagePropsKeys } from "@/lib/constants";
import { Button } from "./button";
import clsx from "clsx";
import { ButtonProps } from "./button";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    variant?: "outline" | "ghost";
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

// const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
//     props: ButtonProps,
//     ref
// ) {
//     const { children, className, variant, ...otherProps } = props;
//     return (
//         <button
//             ref={ref}
//             type="button"
//             className={`${variant}-button ${className}`}
//             {...otherProps}
//         >
//             {children}
//         </button>
//     );
// });

// export default Button;

// import Button from "./ui/button";
// import { IconButtonProps } from "@/lib/types";
// import { forwardRef } from "react";

// export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
//     function IconButton(props: IconButtonProps, ref) {
//         const imageAttributes = {} as ImageProps;
//         const buttonAttributes = {} as ButtonProps;

//         Object.keys(props).forEach((key) => {
//             if (imagePropsKeys.includes(key as keyof ImageProps)) {
//                 // @ts-ignore
//                 imageAttributes[key] = props[key];
//             } else {
//                 // @ts-ignore
//                 buttonAttributes[key] = props[key];
//             }
//         });

//         const {
//             width = 12,
//             height = 12,
//             ...otherImageAttributes
//         } = imageAttributes;

//         return (
//             <Button ref={ref} {...buttonAttributes}>
//                 <Image
//                     width={width}
//                     height={height}
//                     {...otherImageAttributes}
//                 />
//             </Button>
//         );
//     }
// );
