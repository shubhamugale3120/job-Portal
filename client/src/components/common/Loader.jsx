export default function Loader({ message = 'Loading...' }) {
	return <p className="state-block state-loading">{message}</p>;
}
