export default function ErrorState({ message = 'Something went wrong.' }) {
	return <p className="state-block state-error">{message}</p>;
}
