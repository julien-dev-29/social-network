import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "#/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SidebarProvider className="">
			<AppSidebar />
			<main className="w-full">
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
