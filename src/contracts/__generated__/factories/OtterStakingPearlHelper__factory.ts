/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  OtterStakingPearlHelper,
  OtterStakingPearlHelperInterface,
} from "../OtterStakingPearlHelper";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_staking",
        type: "address",
      },
      {
        internalType: "address",
        name: "_CLAM",
        type: "address",
      },
      {
        internalType: "address",
        name: "_sCLAM",
        type: "address",
      },
      {
        internalType: "address",
        name: "_PEARL",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CLAM",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PEARL",
    outputs: [
      {
        internalType: "contract IPearlERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sCLAM",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "stake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "staking",
    outputs: [
      {
        internalType: "contract IOtterStaking",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "unstake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class OtterStakingPearlHelper__factory {
  static readonly abi = _abi;
  static createInterface(): OtterStakingPearlHelperInterface {
    return new utils.Interface(_abi) as OtterStakingPearlHelperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OtterStakingPearlHelper {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as OtterStakingPearlHelper;
  }
}
