import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" &&
            "bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm",
          variant === "secondary" &&
            "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50",
          variant === "ghost" && "text-stone-600 hover:text-stone-900 hover:bg-stone-100",
          variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-2.5 text-sm",
          size === "lg" && "px-8 py-3 text-base",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200",
        variant === "primary" &&
          "bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm",
        variant === "secondary" &&
          "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50",
        variant === "ghost" && "text-stone-600 hover:text-stone-900 hover:bg-stone-100",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-2.5 text-sm",
        size === "lg" && "px-8 py-3 text-base",
        className
      )}
    >
      {children}
    </Link>
  );
}
