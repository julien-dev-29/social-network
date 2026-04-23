import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const SearchBar = () => {
	return (
		<Field className="max-w-1/2">
			<ButtonGroup>
				<Input id="input-button-group" placeholder="Type to search..." />
				<Button variant="outline">Search</Button>
			</ButtonGroup>
		</Field>
	);
};

export default SearchBar;
