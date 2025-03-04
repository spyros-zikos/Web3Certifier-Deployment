// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        (, int256 answer,,,) = priceFeed.latestRoundData();
        uint8 decimals = priceFeed.decimals();
        uint8 decimalsDiff = 18 - decimals;
        // ETH/USD rate in 18 digit
        return uint256(answer) * (10 ** decimalsDiff);
    }

    function getConversionRate(uint256 ethAmount, address priceFeed) internal view returns (uint256) {
        uint256 ethPrice = getPrice(AggregatorV3Interface(priceFeed));
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        // the actual ETH/USD conversation rate, after adjusting the extra 0s.
        return ethAmountInUsd;
    }
}