
import { LoaderCircle } from "lucide-react";

function Loading() {
  return (
    <div className="loading-page">

      <div className="loading-content">

        <div className="loading-spinner">
          <LoaderCircle size={42} />
        </div>

        <h2>Loading...</h2>

        <p>
          Please wait while we load your content.
        </p>

      </div>

    </div>
  );
}

export default Loading;
