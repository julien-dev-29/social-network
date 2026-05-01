import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import PostList from "#/components/PostList";
import SearchBar from "#/components/SearchBar";
import TabsComponent from "#/components/Tabs";
import { getSession } from "#/lib/auth.functions";
import { getAllPosts } from "#/lib/posts.functions";

export const Route = createFileRoute("/dashboard/")({
	beforeLoad: async () => {
		const session = await getSession();
		if (!session) {
			throw redirect({ to: "/auth/login" });
		}
		return { user: session.user };
	},
	component: Home,
	loader: () => getAllPosts(),
});

function Home() {
	const posts = Route.useLoaderData();
	const { user } = Route.useRouteContext();
	const [postType, setPostType] = useState("foryou");
	return (
		<div className="relative">
			<div className="sticky flex gap-5 top-0 z-50 items-center bg-background/60 border-b">
				<div className="w-1/2">
					<TabsComponent posts={posts} setPostType={setPostType} />
				</div>
				<div className="w-1/3">
					<SearchBar />
				</div>
			</div>
			{posts.length > 0 ? (
				postType === "foryou" ? (
					<PostList posts={posts} userId={user.id} />
				) : (
					<div>No Post Yet</div>
				)
			) : (
				<div>No Post yet</div>
			)}
		</div>
	);
}
