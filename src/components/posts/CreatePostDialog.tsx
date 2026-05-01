import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { CalendarClock, Image } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { createPost } from "#/lib/posts.functions";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Textarea } from "../ui/textarea";

const postSchema = z.object({
	content: z
		.string()
		.min(5, "Description must be at least 5 characters.")
		.max(100, "Description must be at most 100 characters."),
});

const CreatePostDialog = () => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const form = useForm({
		defaultValues: {
			content: "",
		},
		validators: {
			onSubmit: postSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await createPost({ data: value });
				form.reset();
				setOpen(false);
				router.invalidate();
			} catch (err) {
				console.error(err);
			}
		},
	});
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="lg">Post</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="h-2">
					<DialogTitle />
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field
							name="content"
							// biome-ignore lint/correctness/noChildrenProp: yolo
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="What's happenning?"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
					<DialogFooter className="flex items-center justify-between mt-2">
						<div className="flex flex-1 gap-2">
							<Image color="#0090FF" className="hover:cursor-pointer" />
							<CalendarClock color="#0090FF" className="hover:cursor-pointer" />
						</div>
						<form.Subscribe
							selector={(state) => ({
								content: state.values.content,
							})}
						>
							{({ content }) => (
								<Button type="submit" disabled={content.length < 1}>
									Post
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreatePostDialog;
