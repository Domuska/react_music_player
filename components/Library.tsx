import styles from "./library.module.css";

export const Library = () => {
	return (
		<div className={`${styles.libraryContainer} card`}>
			<p>Your library</p>
		</div>
	);
};
