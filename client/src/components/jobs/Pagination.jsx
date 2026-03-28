export function Pagination({ query, updateQuery, pagination }) {
    const currentPage = Number(query.page || pagination?.currentPage || 1);

    const goPrev = () => {
        if (currentPage > 1) {
            updateQuery({ page: String(currentPage - 1) });
        }
    };

    const goNext = () => {
        if (pagination?.hasNextPage) {
            updateQuery({ page: String(currentPage + 1) });
        }
    };

    return (
        <div className="jobs-pagination">
            <button className="jobs-page-btn" type="button" onClick={goPrev} disabled={!pagination?.hasPrevPage}>
                Previous
            </button>
            <span className="jobs-page-label">Page {currentPage}</span>
            <button className="jobs-page-btn" type="button" onClick={goNext} disabled={!pagination?.hasNextPage}>
                Next
            </button>
        </div>
    );
}