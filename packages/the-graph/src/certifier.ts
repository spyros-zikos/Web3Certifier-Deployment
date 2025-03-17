import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  CancelExam as CancelExamEvent,
  ClaimNFT as ClaimNFTEvent,
  ClaimRefund as ClaimRefundEvent,
  CorrectExam as CorrectExamEvent,
  CreateExam as CreateExamEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  SetExamCreationFee as SetExamCreationFeeEvent,
  SetFeeCollector as SetFeeCollectorEvent,
  SetSubmissionFee as SetSubmissionFeeEvent,
  SetTimeToCorrectExam as SetTimeToCorrectExamEvent,
  SetUsername as SetUsernameEvent,
  SubmitAnswersFree as SubmitAnswersFreeEvent,
  SubmitAnswersPaid as SubmitAnswersPaidEvent,
  Transfer as TransferEvent
} from "../generated/Certifier/Certifier"
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
} from "../generated/schema"
import { Bytes } from "@graphprotocol/graph-ts"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelExam(event: CancelExamEvent): void {
  let entity = new CancelExam(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.examId = event.params.examId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleClaimNFT(event: ClaimNFTEvent): void {
  let entity = new ClaimNFT(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.examId = event.params.examId
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleClaimRefund(event: ClaimRefundEvent): void {
  let entity = new ClaimRefund(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.examId = event.params.examId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCorrectExam(event: CorrectExamEvent): void {
  let entity = new CorrectExam(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.examId = event.params.examId
  entity.answers = event.params.answers

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCreateExam(event: CreateExamEvent): void {
  let entity = new CreateExam(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.name = event.params.name
  entity.description = event.params.description
  entity.endTime = event.params.endTime
  entity.status = event.params.status
  entity.questions = event.params.questions
  entity.answers = event.params.answers
  entity.price = event.params.price
  entity.baseScore = event.params.baseScore
  entity.imageUrl = event.params.imageUrl
  entity.users = changetype<Bytes[]>(event.params.users)
  entity.etherAccumulated = event.params.etherAccumulated
  entity.certifier = event.params.certifier

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetExamCreationFee(event: SetExamCreationFeeEvent): void {
  let entity = new SetExamCreationFee(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetFeeCollector(event: SetFeeCollectorEvent): void {
  let entity = new SetFeeCollector(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.feeCollector = event.params.feeCollector

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetSubmissionFee(event: SetSubmissionFeeEvent): void {
  let entity = new SetSubmissionFee(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetTimeToCorrectExam(
  event: SetTimeToCorrectExamEvent
): void {
  let entity = new SetTimeToCorrectExam(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.time = event.params.time

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetUsername(event: SetUsernameEvent): void {
  let entity = new SetUsername(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.username = event.params.username

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubmitAnswersFree(event: SubmitAnswersFreeEvent): void {
  let entity = new SubmitAnswersFree(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.examId = event.params.examId
  entity.hashedAnswer = event.params.hashedAnswer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubmitAnswersPaid(event: SubmitAnswersPaidEvent): void {
  let entity = new SubmitAnswersPaid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.examId = event.params.examId
  entity.hashedAnswer = event.params.hashedAnswer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
