import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import './SpotCard.css'
import { useSelector } from "react-redux";

const SpotCard = () => {
    const { id } = useParams();
    const spotCard = useSelector(state => state.spotState.entries[id]);

    return (
        <div className="spot-card">
            <h1>{spotCard.name}</h1>
            {/* <img
                src={spotCard?.imageUrl}
            /> */}
            <p>{spotCard?.price}</p>
        </div>
    )
}

export default SpotCard
