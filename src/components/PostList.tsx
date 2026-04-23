import { UserAvatar } from "@clerk/tanstack-react-start";
import PostCard from "./PostCard";

const PostList = ({ posts }: { posts: Post[] }) => {
	return (
		<div className="">
			{posts.map((post) => (
				<div className="flex" key={post.id}>
					<div className="py-4 pl-4">
						<UserAvatar />
					</div>
					<PostCard {...post} />
				</div>
			))}
		</div>
	);
};

export default PostList;
