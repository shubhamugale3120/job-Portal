export default function EmptyState({ message = 'No data available.' }) {
	return <p className="state-block state-empty">{message}</p>;
}
