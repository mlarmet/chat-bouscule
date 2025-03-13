import "./Title.scss";

interface TiteProps {
	small?: boolean;
}

export default function Title({ small = false }: TiteProps) {
	return (
		<div className={"title" + (small ? " small" : "")}>
			<h1>Chat</h1>
			<h2>Bouscule</h2>
		</div>
	);
}
