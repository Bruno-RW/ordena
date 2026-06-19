"use client";

import {
  IconCalendar,
  IconChartBar,
  IconHome,
  IconLayoutSidebar,
  IconListCheck,
  IconSchool,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useStore } from "@/context/store";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "./ui/sidebar";

const navItems = [
  { href: "/", label: "Dashboard", icon: IconHome },
  { href: "/disciplinas", label: "Disciplinas", icon: IconSchool },
  { href: "/tarefas", label: "Tarefas", icon: IconListCheck },
  { href: "/calendario", label: "Calendário", icon: IconCalendar },
  { href: "/desempenho", label: "Desempenho", icon: IconChartBar },
  { href: "/perfil", label: "Perfil", icon: IconUser },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { perfil, tarefas } = useStore();

  const pendentes = tarefas.filter((t) => t.status !== "concluida").length;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <IconLayoutSidebar className="size-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sidebar-foreground">
                  Ordena
                </span>
                <span className="text-xs text-muted-foreground">
                  {perfil.curso}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.href === "/tarefas" && pendentes > 0 && (
                      <SidebarMenuBadge>{pendentes}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/perfil" />} tooltip={perfil.nome} size="lg">
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                    {perfil.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none text-sm">
                  <span className="font-medium text-sidebar-foreground">
                    {perfil.nome}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {perfil.semestre}º semestre
                  </span>
                </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
