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

const PostCard = ({ title, content, createdAt }: Post) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{createdAt}</CardDescription>
				<CardAction>
					<Button type="button" onClick={() => console.log("yolo les kikis")}>
						See more
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p>{content}</p>
			</CardContent>
			<CardFooter>
				<p>Card Footer</p>
			</CardFooter>
		</Card>
	);
};

export default PostCard;
