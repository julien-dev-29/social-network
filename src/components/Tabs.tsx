import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabsComponent = ({
	setPostType,
}: {
	posts: Post[];
	setPostType: React.Dispatch<React.SetStateAction<string>>;
}) => {
	return (
		<div className="w-6/12">
			<Tabs defaultValue="foryou" className="w-full py-3 bg-black/70">
				<TabsList variant="line" className="w-full flex justify-between">
					<TabsTrigger value="foryou" onClick={() => setPostType("foryou")}>
						For you
					</TabsTrigger>
					<TabsTrigger
						value="following"
						onClick={() => setPostType("following")}
					>
						Following
					</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);
};

export default TabsComponent;
