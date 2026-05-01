import { useNavigate } from "@tanstack/react-router";
import { Home, Settings, User } from "lucide-react";
import type { UserDTO } from "type";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { ProfileButton } from "./ProfileButton";
import CreatePostDialog from "./posts/CreatePostDialog";

export function AppSidebar({ user }: { user: UserDTO }) {
	const navigate = useNavigate();

	const navItems = [
		{ icon: Home, label: "Home", to: "/dashboard" },
		{ icon: User, label: "Profile", to: "/profile" },
		{ icon: Settings, label: "Settings", to: "/settings" },
	];

	return (
		<Sidebar>
			<SidebarHeader />
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{navItems.map((item) => (
							<SidebarMenuItem key={item.label}>
								<SidebarMenuButton onClick={() => navigate({ to: item.to })}>
									<item.icon className="w-5 h-5" />
									<span>{item.label}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				<SidebarGroup>
					<CreatePostDialog />
				</SidebarGroup>
				<SidebarSeparator />
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<ProfileButton user={user} />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
