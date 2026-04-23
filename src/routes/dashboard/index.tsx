import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import PostList from "#/components/PostList";
import SearchBar from "#/components/SearchBar";
import TabsComponent from "#/components/Tabs";

const posts: Post[] = [
	{
		id: crypto.randomUUID(),
		title: "My first post",
		slug: "my-first-post",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		category: "General",
		createdAt: new Date().toLocaleDateString(),
		updatedAt: new Date().toLocaleDateString(),
		tags: ["introduction", "welcome"],
	},
	{
		id: crypto.randomUUID(),
		title: "My second post",
		slug: "my-second-post",
		content:
			"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		category: "General",
		createdAt: new Date().toLocaleDateString(),
		updatedAt: new Date().toLocaleDateString(),
		tags: ["update", "news"],
	},
	{
		id: crypto.randomUUID(),
		title: "My third post",
		slug: "my-third-post",
		content:
			"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
		category: "General",
		createdAt: new Date().toLocaleDateString(),
		updatedAt: new Date().toLocaleDateString(),
		tags: ["announcement", "events"],
	},
	{
		id: crypto.randomUUID(),
		title: "My fourth post",
		slug: "my-fourth-post",
		content:
			"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		category: "General",
		createdAt: new Date().toLocaleDateString(),
		updatedAt: new Date().toLocaleDateString(),
		tags: ["tips", "tricks"],
	},
	{
		id: crypto.randomUUID(),
		title: "My fifth post",
		slug: "my-fifth-post",
		content:
			"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
		category: "General",
		createdAt: new Date().toLocaleDateString(),
		updatedAt: new Date().toLocaleDateString(),
		tags: ["insights", "analysis"],
	},
];

export const Route = createFileRoute("/dashboard/")({ component: Home });

function Home() {
	const [postType, setPostType] = useState("foryou");
	return (
		<div className="relative">
			<div className="sticky flex top-0 z-50 items-center justify-start pt-4 gap-5">
				<TabsComponent posts={posts} setPostType={setPostType} />
				<SearchBar />
			</div>

			{posts.length > 0 ? (
				postType === "foryou" ? (
					<PostList posts={posts} />
				) : (
					<div>No Post Yet</div>
				)
			) : (
				<div>No Post yet</div>
			)}
		</div>
	);
}
