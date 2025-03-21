import "./Title.scss";

interface TiteProps {
	small?: boolean;
	landing?: boolean;
}

export default function Title({ small = false, landing = false }: TiteProps) {
	return (
		<div className={"title" + (small ? " small" : "") + (landing ? " landing" : "")}>
			<h1>Chat</h1>
			<h2>Bouscule</h2>
		</div>
	);
}
