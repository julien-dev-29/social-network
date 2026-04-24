import { Show, UserButton, useUser } from "@clerk/tanstack-react-start";
import { createRef } from "react";
import { SidebarMenu } from "./ui/sidebar";

const NavUser = () => {
	const { user } = useUser();
	const userButtonRef = createRef<HTMLDivElement>();

	if (!user) return;

	const handleButtonClick = () => {
		const button = userButtonRef.current?.querySelector("button");
		button?.click();
	};

	return (
		<SidebarMenu className="mb-2">
			<Show when="signed-in">
				<button
					type="button"
					onClick={handleButtonClick}
					className="flex items-center justify-start gap-2 cursor-pointer hover:bg-accent rounded-md px-2 py-1.5 transition-colors"
				>
					<div className="flex" ref={userButtonRef}>
						<UserButton />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{user.firstName}</span>
						<span className="truncate text-xs">
							{user.primaryEmailAddress?.emailAddress}
						</span>
					</div>
				</button>
			</Show>
		</SidebarMenu>
	);
};

export default NavUser;
