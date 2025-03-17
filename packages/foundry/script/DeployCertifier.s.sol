//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Certifier} from "../contracts/Certifier.sol";
import "./DeployHelpers.s.sol";

contract DeployCertifier is ScaffoldETHDeploy {
    address private constant PRICE_FEED = address(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    // use `deployer` from `ScaffoldETHDeploy`

    function run() external ScaffoldEthDeployerRunner {
        Certifier certifier = new Certifier(PRICE_FEED);
        console.logString(string.concat("YourContract deployed at: ", vm.toString(address(certifier))));
    }
}
