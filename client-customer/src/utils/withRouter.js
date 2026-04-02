// using withRouter in class-component
import { useParams, useNavigate } from "react-router-dom";

function withRouter(Component) {
    return function WrapperComponent(props) {
        return <Component {...props} params={useParams()} navigate={useNavigate()} />;
    };
}

export default withRouter;
