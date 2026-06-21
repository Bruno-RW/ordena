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

import { useData } from "@/hooks/useData";
import { StatusEnum } from "@/types/task";

import { Avatar, AvatarFallback } from "./ui/avatar";
import {
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
  Sidebar as UISidebar,
} from "./ui/sidebar";

const navItems = [
  { href: "/", label: "Relatório", icon: IconHome },
  { href: "/subjects", label: "Disciplinas", icon: IconSchool },
  { href: "/tasks", label: "Tarefas", icon: IconListCheck },
  { href: "/calendar", label: "Calendário", icon: IconCalendar },
  { href: "/performance", label: "Performance", icon: IconChartBar },
  { href: "/profile", label: "Perfil", icon: IconUser },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { profile, tasks } = useData();

  const pendingTasks = tasks.filter((t) => t.status !== StatusEnum.COMPLETED).length;

  return (
    <UISidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <IconLayoutSidebar className="size-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sidebar-foreground">Ordena</span>
                <span className="text-xs text-muted-foreground">{profile.course}</span>
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
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
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
                    {item.href === "/tasks" && pendingTasks > 0 && (
                      <SidebarMenuBadge>{pendingTasks}</SidebarMenuBadge>
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
            <SidebarMenuButton render={<Link href="/profile" />} tooltip={profile.name} size="lg">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                  {profile.avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none text-sm">
                <span className="font-medium text-sidebar-foreground">{profile.name}</span>
                <span className="text-xs text-muted-foreground">{profile.semester}º semestre</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </UISidebar>
  );
};

export default Sidebar;
