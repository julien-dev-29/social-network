import { createFileRoute } from "@tanstack/react-router";
import PostCard from "#/components/PostCard";

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

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="p-8">
			{posts.length > 0 ? (
				<div className="">
					{posts.map((post) => (
						<div className="mb-2" key={post.id}>
							<PostCard {...post} />
						</div>
					))}
				</div>
			) : (
				<div>No posts have been published yet</div>
			)}
		</div>
	);
}
