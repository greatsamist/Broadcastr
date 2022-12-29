import React from "react";
import { useStream, useStreamSessions } from "@livepeer/react";
import { useContractRead } from "wagmi";
import LNFTcontractABI from "contracts/factory-abi";
import { get } from "utils/requests";
import { parseParams } from "utils/helpers";
import { LiveNFT } from "types/general";

const useLiveNFT = (address: string) => {
  const contractAddress =
    process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS ?? "";

  const [lnftData, setLnftData] = React.useState<LiveNFT | null>(null);
  const [properties, setProperties] = React.useState({
    streamId: "",
    ownerAddress: "",
  });
  const { data } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: LNFTcontractABI,
    functionName: "getMetadata",
    args: [address],
  });

  React.useEffect(() => {
    if (data) {
      const item = parseParams(data as Array<string>);
      setLnftData(item);

      if (!item.baseUri) {
        return;
      }
      get(item.baseUri).then((response) => {
        console.log(response);
        if (response?.properties) {
          setProperties({
            streamId: response.properties.LNFTId,
            ownerAddress: response.properties.creator_address,
          });
        }
      });
    }
  }, [data]);

  const { data: stream } = useStream({
    streamId: properties.streamId,
    // refetchInterval: (stream) => (!stream?.isActive ? 5000 : false),
  });

  const { data: sessions } = useStreamSessions({
    streamId: properties.streamId,
  });

  return {
    sessions,
    stream,
    lnftData,
  };
};

export default useLiveNFT;
