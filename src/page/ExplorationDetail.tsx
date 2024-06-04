import { useEffect, useState } from "react";
import { StreamRepository } from "../feature/stream/repository/StreamRepository";
import { IGetObjectDetectionArgDto, IGetObjectDetectionByIdRetDto } from "../feature/stream/model/VideoStream";
import { Container } from "react-bootstrap";
import { Loading } from "../core/Loading";
import { useParams } from "react-router-dom";

const ExplorationDetail = () => {
    const { id } = useParams();
    const queryParams = new URLSearchParams(window.location.search);
    const explorationName = queryParams.get('name');

    console.log(id);
    console.log(explorationName);

    const [allObjectDetections, setAllObjectDetections] = useState<IGetObjectDetectionByIdRetDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id === undefined || explorationName === null) {
            alert(`'id' param and 'name' query params cannot be null. Redirecting to /explorations`);
            window.location.href = "/explorations";
        }

        setIsLoading(true);

        const getObjectDetectionArgDto: IGetObjectDetectionArgDto = {
            exploration_id: id!,
        };

        StreamRepository.getInstance()
            .getObjectDetection(getObjectDetectionArgDto)
            .then((res) => {
                setAllObjectDetections(res.explorationsImage);
            })
            .catch((err) => {
                alert("Detected objects failed to be retrieved. Redirecting to /explorations.");
                window.location.href = "/explorations";
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <Container className="py-2">
            {isLoading ? (
                <Loading />
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col" className="d-flex justify-content-center">
                                <h1>{explorationName}</h1>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {allObjectDetections.length === 0 ? (
                            <div className="d-flex justify-content-center">
                                <h5>No object detection has been caught.</h5>
                            </div>
                        ) : (
                            <>
                                {allObjectDetections.map((objectDetection, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <img src={`data:image/jpeg;base64, ${objectDetection.image_blob}`} alt="Blob Image Detection" />
                                            </div> 
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            )}
        </Container>
    );
};

export default ExplorationDetail;