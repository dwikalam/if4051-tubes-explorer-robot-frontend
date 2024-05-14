import { Container } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IExplorationByIdRetDto, IExplorationsRetDto } from "../feature/exploration/model/Exploration";
import { ExplorationRepository } from "../feature/exploration/exploration";
import { Loading } from "../core/Loading";
import { generateArray } from "../helper/Iterable";

const Exploration = () => {
    const [explorations, setExplorations] = useState<IExplorationByIdRetDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchParams] = useSearchParams();
    const [maxPage, setMaxPage] = useState(1);

    const currentPage = searchParams.get("page");
    const currentPageNum = currentPage ? parseInt(currentPage) : 1;

    const listOfPages = generateArray(
        Math.max(1, currentPageNum - 2),
        Math.min(currentPageNum + 2, maxPage)
    );

    useEffect(() => {
        setIsLoading(true);
        ExplorationRepository.getInstance()
            .getAllExplorations()
            .then((res: IExplorationsRetDto) => {
                setExplorations(res.explorationsData);
                // setMaxPage(res.data.countPages);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [currentPageNum]);

    return (
        <Container className="py-2">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                {explorations.length === 0 ? (
                    <div className="d-flex justify-content-center">
                    <h5>Belum ada eksplorasi yang dilakukan</h5>
                    </div>
                ) : (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Eksplorasi</th>
                                <th scope="col">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {explorations.map((exploration, idx) => (
                                <tr>
                                    <td scope="row">
                                        {idx}
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-start align-items-center gap-2">
                                            <p className="mb-0">{exploration.name}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-start align-items-center gap-2">
                                            <p className="mb-0">{"2024-01-01"}</p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                </>
            )}

            <nav aria-label="user-pagination">
                <ul className="pagination justify-content-center">
                    <li
                        className={`page-item ${currentPageNum === 1 ? "disabled" : null}`}
                    >
                        <Link to={`/explorations?page=${currentPageNum - 1}`} className="page-link">
                        Previous
                        </Link>
                    </li>
                    
                    {listOfPages.map((item) => (
                        <li
                            className={`page-item ${item === currentPageNum ? "active" : ""}`}
                            key={item}
                        >
                        <Link to={`/explorations?page=${item}`} className="page-link">
                            {item}
                        </Link>
                        </li>
                    ))}

                    <li
                        className={`page-item ${currentPageNum === maxPage ? "disabled" : null}`}
                    >
                        <Link to={`/explorations?page=${currentPageNum + 1}`} className="page-link">
                            Next
                        </Link>
                    </li>
                </ul>
            </nav>
        </Container>
    );
};

export default Exploration;