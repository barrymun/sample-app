import Image from "next/image";
import React from "react";

import loading from "assets/loading.svg";

const Loading = () => <Image src={loading.src} width={loading.width} height={loading.height} alt="Loading" priority />;

export { Loading };
