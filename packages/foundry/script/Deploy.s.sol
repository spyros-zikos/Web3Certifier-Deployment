//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import {DeployCertifier} from "./DeployCertifier.s.sol";

contract DeployScript is ScaffoldETHDeploy {
    function run() external {
        // DeployYourContract deployYourContract = new DeployYourContract();
        // deployYourContract.run();

        DeployCertifier deployCertifier = new DeployCertifier();
        deployCertifier.run();

        // deploy more contracts here
        // DeployMyContract deployMyContract = new DeployMyContract();
        // deployMyContract.run();
    }
}
