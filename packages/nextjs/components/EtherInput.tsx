import { useMemo, useState, ReactNode } from "react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { CommonInputProps } from "~~/components/scaffold-eth";
import { useDisplayUsdMode } from "~~/hooks/scaffold-eth/useDisplayUsdMode";
import { useGlobalState } from "~~/services/store/store";

const MAX_DECIMALS_USD = 2;

function etherValueToDisplayValue(usdMode: boolean, etherValue: string, nativeCurrencyPrice: number) {
  if (usdMode && nativeCurrencyPrice) {
    const parsedEthValue = parseFloat(etherValue);
    if (Number.isNaN(parsedEthValue)) {
      return etherValue;
    } else {
      // We need to round the value rather than use toFixed,
      // since otherwise a user would not be able to modify the decimal value
      return (
        Math.round(parsedEthValue * nativeCurrencyPrice * 10 ** MAX_DECIMALS_USD) /
        10 ** MAX_DECIMALS_USD
      ).toString();
    }
  } else {
    return etherValue;
  }
}

const InputBase = ({ value, prefix, suffix, }:
  {value: string; prefix?: ReactNode; suffix?: ReactNode}) => {
  return (
    <div className={`flex mr-8`}>
      {prefix}
      <input
        className="input bg-transparent h-[1.5rem] min-h-[1.5rem] pl-2 pr-0 w-full"
        value={value?.toString()}
      />
      {suffix}
    </div>
  );
};


export const EtherInput = ({
  value,
  usdMode,
}: CommonInputProps & { usdMode?: boolean }) => {
  const [transitoryDisplayValue, setTransitoryDisplayValue] = useState<string>();
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const isNativeCurrencyPriceFetching = useGlobalState(state => state.nativeCurrency.isFetching);

  const { displayUsdMode, toggleDisplayUsdMode } = useDisplayUsdMode({ defaultUsdMode: usdMode });

  // The displayValue is derived from the ether value that is controlled outside of the component
  // In usdMode, it is converted to its usd value, in regular mode it is unaltered
  const displayValue = useMemo(() => {
    const newDisplayValue = etherValueToDisplayValue(displayUsdMode, value, nativeCurrencyPrice || 0);
    if (transitoryDisplayValue && parseFloat(newDisplayValue) === parseFloat(transitoryDisplayValue)) {
      return transitoryDisplayValue;
    }
    // Clear any transitory display values that might be set
    setTransitoryDisplayValue(undefined);
    return newDisplayValue;
  }, [nativeCurrencyPrice, transitoryDisplayValue, displayUsdMode, value]);

  return (
    <InputBase
      value={displayValue}
      prefix={<span className="-mr-2">{displayUsdMode ? "$" : "Ξ"}</span>}
      suffix={
        <div
          className={`${
            nativeCurrencyPrice > 0
              ? ""
              : "tooltip tooltip-secondary before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
          }`}
          data-tip={isNativeCurrencyPriceFetching ? "Fetching price" : "Unable to fetch price"}
        >
          <button
            className="btn btn-primary h-[1rem] min-h-[1rem]"
            onClick={toggleDisplayUsdMode}
            disabled={!displayUsdMode && !nativeCurrencyPrice}
          >
            <ArrowsRightLeftIcon className="h-3 w-3 cursor-pointer" aria-hidden="true" />
          </button>
        </div>
      }
    />
  );
};
