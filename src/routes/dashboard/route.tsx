import {
	createFileRoute,
	Outlet,
	useRouteContext,
} from "@tanstack/react-router";
import { AppSidebar } from "#/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = useRouteContext({ from: "/dashboard/" });
	return (
		<SidebarProvider className="">
			<AppSidebar user={user} />
			<main className="w-full">
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
