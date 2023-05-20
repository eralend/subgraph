import {
  Mint,
  Borrow,
  Redeem,
  RepayBorrow
} from '../generated/nUSDC/CErc20';
import { addTransaction, createUser } from './helpers';
import { Transaction } from '../generated/schema';

export function handleMint(event: Mint): void {
  let id = event.transaction.hash.toHexString();
  let transaction = Transaction.load(id);

  if (transaction == null) {
    transaction = new Transaction(id);
    transaction.action = "Supply";
    transaction.block = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.user = event.params.minter.toHexString();
    transaction.amount = event.params.mintAmount;
    transaction.token = event.transaction.to;
    transaction.save();
    createUser(event.params.minter, event.block.timestamp);
    addTransaction();
  }
}

export function handleRedeem(event: Redeem): void {
  let id = event.transaction.hash.toHexString();
  let transaction = Transaction.load(id);

  if (transaction == null) {
    transaction = new Transaction(id);
    transaction.action = "Withdraw";
    transaction.block = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.user = event.params.redeemer.toHexString();
    transaction.amount = event.params.redeemAmount;
    transaction.token = event.transaction.to;
    transaction.save();
    addTransaction();
  }
}

export function handleBorrow(event: Borrow): void {
  let id = event.transaction.hash.toHexString();
  let transaction = Transaction.load(id);

  if (transaction == null) {
    transaction = new Transaction(id);
    transaction.action = "Borrow";
    transaction.block = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.user = event.params.borrower.toHexString();
    transaction.amount = event.params.borrowAmount;
    transaction.token = event.transaction.to;
    transaction.save();
    createUser(event.params.borrower, event.block.timestamp);
    addTransaction();
  }
}

export function handleRepayBorrow(event: RepayBorrow): void {
  let id = event.transaction.hash.toHexString();
  let transaction = Transaction.load(id);

  if (transaction == null) {
    transaction = new Transaction(id);
    transaction.action = "Repay";
    transaction.block = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.user = event.params.borrower.toHexString();
    transaction.amount = event.params.repayAmount;
    transaction.token = event.transaction.to;
    transaction.save();
    addTransaction();
  }
}
