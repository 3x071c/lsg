import { InfoBoundary } from "~app/boundaries";

export default function Pizza(): JSX.Element {
	return (
		<InfoBoundary
			title="Diese Seite existiert noch nicht 🙅‍♂️"
			message="Pack mit an!"
		/>
	);
}
