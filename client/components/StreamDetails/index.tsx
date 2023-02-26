import { Castr, CastrContractAttributes } from "types/general";
import { formatEther } from "ethers/lib/utils";
import { useBalance, Address } from "wagmi";
import WithdrawalButton from "components/Buttons/WithdrawalButton";

const DetailBox = ({
  title,
  text,
  children,
}: {
  title: string;
  text: string | number;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col mx-auto space-y-2">
      <div className="stat-title">{title}</div>
      <div className="text-2xl font-medium">{text}</div>
      {children}
    </div>
  );
};

const StreamDetails = ({
  details,
  address,
  subscriptions,
}: {
  details: Castr;
  address: string;
  subscriptions: CastrContractAttributes;
}) => {
  const { data = { formatted: "", symbol: "" } } = useBalance({
    address: address as Address,
    watch: true,
  });
  return (
    <div className="flex flex-col w-full rounded-xl">
      <div className="flex flex-col space-y-4 text-center">
        <div className="flex flex-row lg:flex-col xl:flex-row w-full max-w-full text-white justify-center">
          <DetailBox
            title="Subscription price"
            text={formatEther(details.price) + " MATIC"}
          />
          <DetailBox title="Subscribers" text={subscriptions.currentTokenId} />
          <DetailBox title="Earned" text={data.formatted + " " + data.symbol}>
            <WithdrawalButton address={address} />
          </DetailBox>
        </div>
      </div>
    </div>
  );
};

export default StreamDetails;
