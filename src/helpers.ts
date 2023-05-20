import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { DailyUser, State, User } from "../generated/schema";

export function createUser(address: Bytes, timestamp: BigInt): void {
    let userAddress = address.toHexString();

    let user = User.load(userAddress);

    if (user == null) {
        user = new User(userAddress);
        user.address = address;
        user.save();

        let state = State.load("state");
        if (state == null) {
            state = initalizeState();
        }
        state.totalAddresses = state.totalAddresses
            .plus(BigInt.fromI32(1));
        state.save();

        let date = getDate(timestamp);
        let dailyUser = DailyUser.load(date);
        if (!dailyUser) {
            dailyUser = new DailyUser(date);
            dailyUser.totalUsers = BigInt.fromI32(0);
        }
        dailyUser.totalUsers = dailyUser.totalUsers
            .plus(BigInt.fromI32(1));
        dailyUser.save();
    }
}

export function addTransaction(): void {
    let state = State.load("state");
    if (state == null) {
        state = initalizeState();
    }
    state.totalTransactions = state.totalTransactions
        .plus(BigInt.fromI32(1));
    state.save();
}

function initalizeState(): State {
    let state = new State("state");
    state.totalAddresses = BigInt.fromI32(0);
    state.totalTransactions = BigInt.fromI32(0);
    return state;
}

function getDate(timestamp: BigInt): string {
    let date = new Date(timestamp.times(BigInt.fromI32(1000)).toI64());
    return date.toISOString().split('T')[0];
}
