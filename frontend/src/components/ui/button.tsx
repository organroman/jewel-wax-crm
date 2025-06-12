import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-brand-default text-white shadow-xs hover:opacity-80 cursor-pointer",
        destructive:
          "bg-action-alert text-text-regular shadow-xs hover:bg-action-alert/80 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 ",
        outline:
          "border bg-ui-sidebar text-xs text-text-muted rounded-xs shadow-xs hover:opacity-90 hover:text-text-regular  dark:border-ui-border",
        secondary:
          "bg-ui-sidebar border rounded-xs border-brand-default text-text-regular shadow-xs hover:bg-ui-sidebar/30 hover:border-accent-lightgreen ",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/20",
        link: "text-primary underline-offset-4 hover:underline px-0",
        ghostDestructive:
          "text-text-light hover:bg-accent hover:text-action-minus dark:hover:bg-accent/50",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-xs gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
