import { Show, UserButton } from "@clerk/tanstack-react-start";
import { Link } from "@tanstack/react-router";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
	return (
		<div className="flex w-10/12 justify-between items-center">
			<Link to="/" className="text-2xl font-bold text-teal-500">Social Network</Link>
			<NavigationMenu>
				<NavigationMenuList className="w-full justify-between">
					<NavigationMenuItem>
						<NavigationMenuTrigger>Menu</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink asChild>
								<Link to="/">Home</Link>
							</NavigationMenuLink>
							<NavigationMenuLink asChild>
								<Link to="/about">About</Link>
							</NavigationMenuLink>
							<NavigationMenuLink asChild>
								<Link to="/profile">Profile</Link>
							</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<Show when="signed-in">
							<NavigationMenuLink>
								<UserButton />
							</NavigationMenuLink>
						</Show>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
