import { ClerkProvider } from "@clerk/tanstack-react-start";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Navbar from "#/components/Navbar";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Social Network",
			},
			{
				name: "description",
				content: "Meet Some People",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="font-sans antialiased dark">
				<ClerkProvider>
					<div id="root-layout">
						{/* <header className="flex justify-center px-2 py-4">
							<Navbar />
						</header> */}
						<main>{children}</main>
						<footer></footer>
					</div>
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
						]}
					/>
				</ClerkProvider>
				<Scripts />
			</body>
		</html>
	);
}
