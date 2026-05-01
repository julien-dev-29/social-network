import { useNavigate } from "@tanstack/react-router";
import { LogOut, UserPen } from "lucide-react";
import type { UserDTO } from "type";
import { signOut } from "#/lib/auth.functions";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenuButton } from "./ui/sidebar";

export function ProfileButton({ user }: { user: UserDTO }) {
	const navigate = useNavigate();

	const displayName = user.name || "Anonymous";
	const handle = user.name
		? `@${user.name.toLowerCase().replace(/\s+/g, "_")}`
		: "@user";

	const handleLogout = async () => {
		await signOut();
		navigate({ to: "/auth/login" });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarImage src={user.image} alt={user.name} />
						<AvatarFallback className="rounded-lg">CN</AvatarFallback>
					</Avatar>
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-56">
				<DropdownMenuItem
					onClick={() => navigate({ to: "/profile" })}
					className="flex items-center gap-2 cursor-pointer"
				>
					<UserPen className="w-4 h-4" />
					Edit profile
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={handleLogout}
					className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500"
				>
					<LogOut className="w-4 h-4" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
