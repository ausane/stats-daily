import React, { forwardRef } from "react";
import clsx from "clsx";
import { Button } from "./button";
import { ButtonProps } from "./button";

export type IconButtonProps = ButtonProps & {
  children: React.ReactNode;
  circle?: boolean;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      children,
      variant = "outline",
      circle,
      className,
      ...btnAttr
    }: IconButtonProps,
    ref,
  ) {
    return (
      <Button
        variant={variant}
        size="icon"
        className={clsx(
          "flex-center h-8 w-8",
          circle && "rounded-full",
          className,
        )}
        {...btnAttr}
        ref={ref}
      >
        {children}
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;
