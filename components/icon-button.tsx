import Image, { ImageProps } from "next/image";
import Button from "./ui/button";
import { IconButtonProps, ButtonProps } from "@/lib/types";
import { forwardRef } from "react";
import { imagePropsKeys } from "@/lib/constants";

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    function IconButton(props: IconButtonProps, ref) {
        const imageAttributes = {} as ImageProps;
        const buttonAttributes = {} as ButtonProps;

        Object.keys(props).forEach((key) => {
            if (imagePropsKeys.includes(key as keyof ImageProps)) {
                // @ts-ignore
                imageAttributes[key] = props[key];
            } else {
                // @ts-ignore
                buttonAttributes[key] = props[key];
            }
        });

        const {
            width = 12,
            height = 12,
            ...otherImageAttributes
        } = imageAttributes;

        return (
            <Button ref={ref} {...buttonAttributes}>
                <Image
                    width={width}
                    height={height}
                    {...otherImageAttributes}
                />
            </Button>
        );
    }
);

export default IconButton;
