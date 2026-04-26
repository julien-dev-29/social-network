import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Field } from "./ui/field";
import { Input } from "./ui/input";

const SearchBar = () => {
	return (
		<div className="flex-1 flex justify-center">
			<Field className="w-1/2">
				<ButtonGroup>
					<Input id="input-button-group" placeholder="Type to search..." />
					<Button variant="outline">Search</Button>
				</ButtonGroup>
			</Field>
		</div>
	);
};

export default SearchBar;
