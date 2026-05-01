import { createServerFn } from "@tanstack/react-start";
import type { Prisma } from "generated/prisma/client";
import { prisma } from "lib/prisma";
import type { PostDTO } from "type";
import { ensureSession } from "./auth.functions";

export const createPost = createServerFn({ method: "POST" })
	.inputValidator((data: { content: string }) => data)
	.handler(async ({ data }) => {
		const session = await ensureSession();
		const post = await prisma.post.create({
			data: {
				title: "",
				content: data.content,
				authorId: session.user.id,
			},
		});
		return post;
	});

export const getAllPosts = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await ensureSession();
		const posts = await prisma.post.findMany({
			where: {
				OR: [{ authorId: session.user.id }, { originalPostId: { not: null } }],
			},
			include: {
				likes: true,
				comments: {
					include: {
						user: true,
					},
				},
				originalPost: {
					include: {
						author: true,
						likes: true,
					},
				},
				reposts: {
					include: {
						author: true,
					},
				},
				author: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return posts.map(mapPostToDTO);
	},
);

export const toggleLike = createServerFn({ method: "POST" })
	.inputValidator((data: { postId: string }) => data)
	.handler(async ({ data }) => {
		const session = await ensureSession();
		const like = await prisma.like.findFirst({
			where: {
				postId: data.postId,
				userId: session.user.id,
			},
		});

		if (like) {
			await prisma.like.delete({
				where: { id: like.id },
			});
		} else {
			await prisma.like.create({
				data: {
					postId: data.postId,
					userId: session.user.id,
				},
			});
		}
	});

export const isLikedByTheUser = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await ensureSession();
		return prisma.like.findFirst({
			where: {
				userId: session.user.id,
			},
		});
	},
);

export const createComment = createServerFn({ method: "POST" })
	.inputValidator((data: { postId: string; content: string }) => data)
	.handler(async ({ data }) => {
		const session = await ensureSession();
		const comment = await prisma.comment.create({
			data: {
				content: data.content,
				postId: data.postId,
				userId: session.user.id,
			},
		});
		return comment;
	});

export const getCommentsByPost = createServerFn({ method: "GET" })
	.inputValidator((data: { postId: string }) => data)
	.handler(async ({ data }) => {
		const comments = await prisma.comment.findMany({
			where: {
				postId: data.postId,
			},
			include: {
				user: true,
			},
		});
		return comments;
	});

export const createRepost = createServerFn({ method: "POST" })
	.inputValidator((data: { postId: string }) => data)
	.handler(async ({ data }) => {
		const session = await ensureSession();

		const originalPost = await prisma.post.findUnique({
			where: { id: data.postId },
			include: { author: true },
		});

		if (!originalPost) {
			throw new Error("Original post not found");
		}

		const repostContent = `RT @${originalPost.author?.name || "user"}: ${originalPost.content}`;

		const repost = await prisma.post.create({
			data: {
				title: "",
				content: repostContent,
				authorId: session.user.id,
				originalPostId: data.postId,
			},
		});

		return repost;
	});

export const deleteRepost = createServerFn({ method: "POST" })
	.inputValidator((data: { postId: string }) => data)
	.handler(async ({ data }) => {
		const session = await ensureSession();

		await prisma.post.deleteMany({
			where: {
				originalPostId: data.postId,
				authorId: session.user.id,
			},
		});
	});
type PostFromDB = Prisma.PostGetPayload<{
	include: {
		likes: true;
		author: true;
		comments: {
			include: {
				user: true;
			};
		};
		originalPost: {
			include: {
				author: true;
				likes: true;
			};
		};
		reposts: {
			include: {
				author: true;
			};
		};
	};
}>;

function mapPostToDTO(post: PostFromDB): PostDTO {
	return {
		id: post.id,
		content: post.content,
		createdAt: post.createdAt.toLocaleDateString(),
		author: post.author,
		comments: post.comments.map((c) => ({
			id: c.id,
			content: c.content,
			createdAt: c.createdAt.toLocaleDateString(),
			user: c.user
				? {
						id: c.user.id,
						name: c.user.name,
						image: c.user.image,
					}
				: null,
		})),
		likes: post.likes.map((l) => ({
			userId: l.userId,
		})),
		reposts: post.reposts.map((r) => ({
			id: r.id,
			userId: r.authorId,
		})),
		authorId: post.authorId,
	};
}
