import { Show, UserButton } from "@clerk/tanstack-react-start";
import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";

export default function Navbar() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenu>
					<NavigationMenuList className="min-w-screen justify-between px-5">
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
						<NavigationMenuItem>
							<Show when="signed-in">
								<NavigationMenuLink>
									<UserButton />
								</NavigationMenuLink>
							</Show>
							<NavigationMenuLink asChild>
								<Show when="signed-out">
									<Button>
										<Link
											to="/sign-in/$"
											className="flex items-center justify-between gap-2"
										>
											<LogIn /> Sign in
										</Link>
									</Button>
								</Show>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
