import { Ellipsis } from "lucide-react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";

const PostCard = ({ title, content, createdAt }: Post) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{createdAt}</CardDescription>
				<CardAction>
					<Button
						variant="ghost"
						type="button"
						onClick={() => console.log("yolo les kikis")}
					>
						<Ellipsis />
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<img src="https://picsum.photos/300/200" alt="pics" />
				<p>{content}</p>
			</CardContent>
		</Card>
	);
};

export default PostCard;
