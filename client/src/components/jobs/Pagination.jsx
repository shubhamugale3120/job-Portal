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
            <button className="jobs-page-btn" type="button" onClick={goPrev} disabled={!pagination?.hasPrevPage && currentPage <= 1}>
                Prev
            </button>
            <span className="jobs-page-label">Page {currentPage}</span>
            <button className="jobs-page-btn" type="button" onClick={goNext} disabled={!pagination?.hasNextPage}>
                Next
            </button>
        </div>
    );
}

//this component is responsible for rendering pagination controls (Prev/Next buttons and current page number) based on the pagination information received from the backend. It updates the page number in the query parameters when the user clicks on the Prev or Next buttons, which in turn triggers the useJobs hook to fetch the corresponding page of job listings.