export type Props = {
    page: number;
    pages: number;
    onPageChange: (page: number) => void;
};

const Pagination = ({page, pages, onPageChange}: Props) => {
    const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

    return (
        <nav aria-label="Pagination" className="flex justify-center">
            <ul className="flex border border-slate-300">
                {pageNumbers.map((number) => (
                    <li key={number} className={`px-2 py-1 ${page === number ? "bg-gray-200" : ""}`}>
                        <button 
                            aria-current={page === number ? "page" : undefined} 
                            onClick={() => onPageChange(number)}
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>  
        </nav>
    );
};

export default Pagination;
