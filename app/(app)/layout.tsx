import Sidebar from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="flex flex-col min-h-svh">{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
