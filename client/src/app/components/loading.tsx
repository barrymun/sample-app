import Image from "next/image";
import React from "react";

import loading from "assets/loading.svg";

const Loading = () => (
  <div className="spinner">
    <Image src={loading.src} alt="Loading" />
  </div>
);

export { Loading };
