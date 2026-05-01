import type { Post } from "generated/prisma/client";
import PostCard from "./PostCard";

const PostList = ({ posts, userId }: { posts: Post[]; userId: string }) => {
	return (
		<div className="p-2 flex flex-col gap-2">
			{posts.map((post) => (
				<div className="" key={post.id}>
					<PostCard {...post} userId={userId} />
				</div>
			))}
		</div>
	);
};

export default PostList;
