import { useRouter } from "@tanstack/react-router";
import {
	Ellipsis,
	Heart,
	MessageCircle,
	Repeat2,
	Send,
	User,
} from "lucide-react";
import { useState } from "react";
import type { PostDTO } from "type";
import { createComment, createRepost, toggleLike } from "#/lib/posts.functions";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

const PostCard = ({
	content,
	createdAt,
	id,
	userId,
	likes,
	comments,
	reposts,
	author,
}: PostDTO & { userId: string }) => {
	const router = useRouter();
	const [replyContent, setReplyContent] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const isLikedByUser = (): boolean => {
		return likes.some((like) => like.userId === userId);
	};

	const isRepliedByUser = (): boolean => {
		return comments.some((comment) => comment.user?.id === userId);
	};

	const isRepostedByUser = (): boolean => {
		return (reposts || []).some((repost) => repost.userId === userId);
	};

	const handleReply = async () => {
		if (!replyContent.trim()) return;
		await createComment({ data: { postId: id, content: replyContent } });
		setReplyContent("");
		router.invalidate();
	};

	const handleRepost = async () => {
		await createRepost({ data: { postId: id } });
		router.invalidate();
	};

	const replyCount = comments?.length || 0;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center gap-3 pb-2">
				<div className="flex items-center gap-3 flex-1">
					<div className="shrink-0">
						{author?.image ? (
							<img
								src={author.image}
								alt={author.name || "User"}
								className="w-10 h-10 rounded-full object-cover"
							/>
						) : (
							<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
								<User className="w-5 h-5" />
							</div>
						)}
					</div>
					<div className="flex flex-col">
						<CardTitle className="text-base">
							{author?.name || "Anonymous"}
						</CardTitle>
						<CardDescription className="text-xs">
							@{author?.name?.toLowerCase().replace(/\s+/g, "_") || "user"} ·{" "}
							{createdAt}
						</CardDescription>
					</div>
				</div>
				<CardAction>
					<Button
						variant="ghost"
						type="button"
						className="hover:ring-2 hover:ring-primary/50 hover:ring-offset-2"
						onClick={() => console.log("yolo les kikis")}
					>
						<Ellipsis />
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<img src="https://picsum.photos/300/200" alt="pics" />
				<p className="text-primary/70">{content}</p>
			</CardContent>
			<CardFooter className="flex flex-col gap-2">
				<div className="flex gap-2">
					<Button
						variant="ghost"
						className="hover:text-red-500 hover:bg-red-500/10"
						onClick={() => {
							console.log("yolo les kikis");
							toggleLike({ data: { postId: id } });
							router.invalidate();
						}}
					>
						<Heart
							className={isLikedByUser() ? "text-pink-500" : ""}
							fill={isLikedByUser() ? "currentColor" : "none"}
						/>
						<span className={isLikedByUser() ? "text-pink-500" : ""}>
							{likes.length}
						</span>
					</Button>
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<Button
								variant="ghost"
								className={`hover:text-blue-500 hover:bg-blue-500/10 ${isRepliedByUser() ? "text-blue-500" : ""}`}
							>
								<MessageCircle />
								<span className={isRepliedByUser() ? "text-blue-500" : ""}>
									{replyCount}
								</span>
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-md w-full max-h-[80vh] flex flex-col">
							<DialogHeader>
								<DialogTitle>Replies</DialogTitle>
							</DialogHeader>
							<div className="flex-1 overflow-y-auto space-y-4 py-4">
								{replyCount === 0 ? (
									<p className="text-center text-muted-foreground">
										No replies yet. Be the first to reply!
									</p>
								) : (
									comments.map((comment) => (
										<div
											key={comment.id}
											className="flex gap-3 p-3 rounded-lg bg-muted/50"
										>
											<div className="shrink-0">
												{comment.user?.image ? (
													<img
														src={comment.user.image}
														alt={comment.user.name || "User"}
														className="w-10 h-10 rounded-full"
													/>
												) : (
													<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
														<User className="w-5 h-5" />
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<span className="font-semibold truncate">
														{comment.user?.name || "Anonymous"}
													</span>
													<span className="text-xs text-muted-foreground">
														{comment.createdAt}
													</span>
												</div>
												<p className="text-sm mt-1 wrap-break-word">
													{comment.content}
												</p>
											</div>
										</div>
									))
								)}
							</div>
							<div className="flex gap-2 pt-4 border-t">
								<Input
									placeholder="Post your reply..."
									value={replyContent}
									onChange={(e) => setReplyContent(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleReply()}
								/>
								<Button size="icon" onClick={handleReply}>
									<Send className="size-4" />
								</Button>
							</div>
						</DialogContent>
					</Dialog>
					<Button
						variant="ghost"
						className={`hover:text-green-500 hover:bg-green-500/10 ${isRepostedByUser() ? "text-green-500" : ""}`}
						onClick={handleRepost}
					>
						<Repeat2 className={isRepostedByUser() ? "text-green-500" : ""} />
						<span className={isRepostedByUser() ? "text-green-500" : ""}>
							{reposts?.length || 0}
						</span>
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};

export default PostCard;
