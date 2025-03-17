import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  CancelExam,
  ClaimNFT,
  ClaimRefund,
  CorrectExam,
  CreateExam,
  OwnershipTransferred,
  SetExamCreationFee,
  SetFeeCollector,
  SetSubmissionFee,
  SetTimeToCorrectExam,
  SetUsername,
  SubmitAnswersFree,
  SubmitAnswersPaid,
  Transfer
} from "../generated/Certifier/Certifier"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createCancelExamEvent(examId: BigInt): CancelExam {
  let cancelExamEvent = changetype<CancelExam>(newMockEvent())

  cancelExamEvent.parameters = new Array()

  cancelExamEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )

  return cancelExamEvent
}

export function createClaimNFTEvent(
  user: Address,
  examId: BigInt,
  tokenId: BigInt
): ClaimNFT {
  let claimNftEvent = changetype<ClaimNFT>(newMockEvent())

  claimNftEvent.parameters = new Array()

  claimNftEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  claimNftEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )
  claimNftEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return claimNftEvent
}

export function createClaimRefundEvent(
  user: Address,
  examId: BigInt
): ClaimRefund {
  let claimRefundEvent = changetype<ClaimRefund>(newMockEvent())

  claimRefundEvent.parameters = new Array()

  claimRefundEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  claimRefundEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )

  return claimRefundEvent
}

export function createCorrectExamEvent(
  examId: BigInt,
  answers: Array<BigInt>
): CorrectExam {
  let correctExamEvent = changetype<CorrectExam>(newMockEvent())

  correctExamEvent.parameters = new Array()

  correctExamEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )
  correctExamEvent.parameters.push(
    new ethereum.EventParam(
      "answers",
      ethereum.Value.fromUnsignedBigIntArray(answers)
    )
  )

  return correctExamEvent
}

export function createCreateExamEvent(
  id: BigInt,
  name: string,
  description: string,
  endTime: BigInt,
  status: i32,
  questions: Array<string>,
  answers: Array<BigInt>,
  price: BigInt,
  baseScore: BigInt,
  imageUrl: string,
  users: Array<Address>,
  etherAccumulated: BigInt,
  certifier: Address
): CreateExam {
  let createExamEvent = changetype<CreateExam>(newMockEvent())

  createExamEvent.parameters = new Array()

  createExamEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "questions",
      ethereum.Value.fromStringArray(questions)
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "answers",
      ethereum.Value.fromUnsignedBigIntArray(answers)
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "baseScore",
      ethereum.Value.fromUnsignedBigInt(baseScore)
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam("imageUrl", ethereum.Value.fromString(imageUrl))
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam("users", ethereum.Value.fromAddressArray(users))
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "etherAccumulated",
      ethereum.Value.fromUnsignedBigInt(etherAccumulated)
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam("certifier", ethereum.Value.fromAddress(certifier))
  )

  return createExamEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSetExamCreationFeeEvent(fee: BigInt): SetExamCreationFee {
  let setExamCreationFeeEvent = changetype<SetExamCreationFee>(newMockEvent())

  setExamCreationFeeEvent.parameters = new Array()

  setExamCreationFeeEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return setExamCreationFeeEvent
}

export function createSetFeeCollectorEvent(
  feeCollector: Address
): SetFeeCollector {
  let setFeeCollectorEvent = changetype<SetFeeCollector>(newMockEvent())

  setFeeCollectorEvent.parameters = new Array()

  setFeeCollectorEvent.parameters.push(
    new ethereum.EventParam(
      "feeCollector",
      ethereum.Value.fromAddress(feeCollector)
    )
  )

  return setFeeCollectorEvent
}

export function createSetSubmissionFeeEvent(fee: BigInt): SetSubmissionFee {
  let setSubmissionFeeEvent = changetype<SetSubmissionFee>(newMockEvent())

  setSubmissionFeeEvent.parameters = new Array()

  setSubmissionFeeEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return setSubmissionFeeEvent
}

export function createSetTimeToCorrectExamEvent(
  time: BigInt
): SetTimeToCorrectExam {
  let setTimeToCorrectExamEvent =
    changetype<SetTimeToCorrectExam>(newMockEvent())

  setTimeToCorrectExamEvent.parameters = new Array()

  setTimeToCorrectExamEvent.parameters.push(
    new ethereum.EventParam("time", ethereum.Value.fromUnsignedBigInt(time))
  )

  return setTimeToCorrectExamEvent
}

export function createSetUsernameEvent(
  user: Address,
  username: string
): SetUsername {
  let setUsernameEvent = changetype<SetUsername>(newMockEvent())

  setUsernameEvent.parameters = new Array()

  setUsernameEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  setUsernameEvent.parameters.push(
    new ethereum.EventParam("username", ethereum.Value.fromString(username))
  )

  return setUsernameEvent
}

export function createSubmitAnswersFreeEvent(
  user: Address,
  examId: BigInt,
  hashedAnswer: Bytes
): SubmitAnswersFree {
  let submitAnswersFreeEvent = changetype<SubmitAnswersFree>(newMockEvent())

  submitAnswersFreeEvent.parameters = new Array()

  submitAnswersFreeEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  submitAnswersFreeEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )
  submitAnswersFreeEvent.parameters.push(
    new ethereum.EventParam(
      "hashedAnswer",
      ethereum.Value.fromFixedBytes(hashedAnswer)
    )
  )

  return submitAnswersFreeEvent
}

export function createSubmitAnswersPaidEvent(
  user: Address,
  examId: BigInt,
  hashedAnswer: Bytes
): SubmitAnswersPaid {
  let submitAnswersPaidEvent = changetype<SubmitAnswersPaid>(newMockEvent())

  submitAnswersPaidEvent.parameters = new Array()

  submitAnswersPaidEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  submitAnswersPaidEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )
  submitAnswersPaidEvent.parameters.push(
    new ethereum.EventParam(
      "hashedAnswer",
      ethereum.Value.fromFixedBytes(hashedAnswer)
    )
  )

  return submitAnswersPaidEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
