import { useState } from "react";
import { Image } from "antd";

type Props = {
  url: string;
};

const LoadedImage = ({ url }: Props) => {
  const [imgNotLoaded, setImgNotLoaded] = useState(false);

  return (
    <div className="image">
      {url && !imgNotLoaded ? (
        <Image
          width={48}
          height={48}
          src={url}
          fallback={url}
          onError={() => setImgNotLoaded(true)}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default LoadedImage;
