import { FC } from "react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const Header: FC<HeaderProps> = ({ title, description, children, className }) => {
  return (
    <header
      className={cn("flex h-14 shrink-0 items-center gap-3 border-b border-border px-4", className)}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />

      <div className="flex flex-1 items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold leading-none text-foreground">{title}</h1>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>

        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </header>
  );
};

export default Header;
