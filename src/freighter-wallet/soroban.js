import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import {
  isAllowed,
  setAllowed,
  requestAccess,
  getNetwork,
} from "@stellar/freighter-api";

import {
  TransactionBuilder,
  xdr,
  SorobanRpc,
  Networks,
  Contract,
  TimeoutInfinite,
  Address,
  Operation,
  scValToNative,
  Memo,
  nativeToScVal,
  ScInt,
  Keypair,
  StrKey,
  Soroban,
  sign,
} from "@stellar/stellar-sdk";

const secret = "SCLQTNYINVRXY32WDORXTD2JMM6YPBIASP7DKHXVEZX47DWEYZPRY2HO";
const contract_file = "contract path here";

export const kp = Keypair.fromSecret(secret);

export const BASE_FEE = "100";
export const FUTURENET_DETAILS = {
  network: "FUTURENET",
  networkUrl: "https://horizon-futurenet.stellar.org",
  networkPassphrase: "Test SDF Future Network ; October 2022",
};

export const RPC_URLS = {
  FUTURENET: "https://rpc-futurenet.stellar.org/",
};

export const accountToScVal = (account) => new Address(account).toScVal();

export const numberToI128 = (value) => nativeToScVal(value);

export const xlmToStroop = (lumens) => {
  // round to nearest stroop
  return new BigNumber(Math.round(Number(lumens) * 1e7));
};

export const stroopToXlm = (stroops) => {
  return new BigNumber(Number(stroops) / 1e7);
};

const getServer = (networkDetails) =>
  new SorobanRpc.Server(RPC_URLS[networkDetails.network], {
    allowHttp: networkDetails.networkUrl.startsWith("http://"),
  });

export const server = getServer(FUTURENET_DETAILS);

export const getTxBuilder = async (pubKey, fee, server, networkPassphrase) => {
  const source = await server.getAccount(pubKey);
  return new TransactionBuilder(source, {
    fee,
    networkPassphrase,
  });
};

export const simulateTx = async (tx, server) => {
  const response = await server.simulateTransaction(tx);

  if (
    SorobanRpc.Api.isSimulationSuccess(response) &&
    response.result !== undefined
  ) {
    return scValToNative(response.result.retval);
  }

  throw new Error("cannot simulate transaction");
};

export async function createContract(txBuilder, contractWasm) {
  const tx = txBuilder.append(contractWasm).setTimeout(TimeoutInfinite).build();
}

export const getTokenInfo = async (tokenId, arg, txBuilder, server) => {
  const contract = new Contract(tokenId);
  const contract3 = new Contract(tokenId);
  const tx = txBuilder
    .addOperation(contract.call(arg))
    .setTimeout(TimeoutInfinite)
    .build();

  const result = await simulateTx(tx, server);
  return result;
};

export const getWalletBalance = async ({
  tokenId,
  userPubKey,
  txBuilderBalance,
  server,
}) => {
  const contract = new Contract(tokenId);

  const tx = txBuilderBalance
    .addOperation(
      contract.call(
        "balance",
        ...[
          accountToScVal(userPubKey), // to
        ]
      )
    )
    .setTimeout(TimeoutInfinite);

  const builtRes = tx.build();
  const walletBal = await simulateTx(builtRes, server);

  // console.log("the balance is", stroopToXlm(walletBal).c.at(0));

  return stroopToXlm(walletBal).c.at(0);
};

export const depositToken = async ({
  poolContract,
  from,
  token_address,
  amount,
  memo,
  txBuilderAdmin,
  server,
}) => {
  const contract = new Contract(poolContract);

  const tx = txBuilderAdmin
    .addOperation(
      contract.call(
        "deposit_token",
        ...[
          accountToScVal(from), // from
          accountToScVal(token_address), //token id
          new ScInt(amount).toI128(), // quantity
        ]
      )
    )
    .setTimeout(TimeoutInfinite);

  if (memo?.length > 0) {
    tx.addMemo(Memo.text(memo));
  }

  const built = tx.build();
  const sim = await server.simulateTransaction(built);

  const preparedTransaction = await server.prepareTransaction(built);
  // console.log("built transaction", sim);

  return preparedTransaction.toXDR();
};

export const transferPayout = async ({
  poolContract,
  to,
  token_address,
  amount,
  memo,
  txBuilderAdmin,
  server,
}) => {
  const oracle = (await server.getAccount(kp.publicKey()))._accountId;

  const contract = new Contract(poolContract);

  const tx = txBuilderAdmin
    .addOperation(
      contract.call(
        "transfer_payout",
        ...[
          accountToScVal(oracle), // from
          accountToScVal(to), // to
          accountToScVal(token_address), //token id
          new ScInt(amount).toI128(), // quantity
        ]
      )
    )
    .setTimeout(TimeoutInfinite);

  if (memo?.length > 0) {
    tx.addMemo(Memo.text(memo));
  }

  const built = tx.build();

  const sim = await server.simulateTransaction(built);

  const preparedTransaction = await server.prepareTransaction(built);
  // console.log("built transaction", sim);

  const signedTx = await preparedTransaction.sign(kp);
  const sendTxOracle = await server.sendTransaction(preparedTransaction);

  // console.log("signed tx", sendTxOracle);

  return preparedTransaction.toXDR();
};

export const transferToEVM = async ({
  poolContract,
  from,
  to,
  token_address,
  amount,
  memo,
  txBuilderAdmin,
  server,
}) => {
  const contract = new Contract(poolContract);

  const tx = txBuilderAdmin
    .addOperation(
      contract.call(
        "transfer_to_evm",
        ...[
          accountToScVal(from), // from
          nativeToScVal(to), // to
          accountToScVal(token_address), //token id
          new ScInt(amount).toI128(), // quantity
        ]
      )
    )
    .setTimeout(TimeoutInfinite);

  if (memo?.length > 0) {
    tx.addMemo(Memo.text(memo));
  }

  const built = tx.build();
  const sim = await server.simulateTransaction(built);

  const preparedTransaction = await server.prepareTransaction(built);
  // console.log("built transaction", sim);

  return preparedTransaction.toXDR();
};

export const mintTokens = async ({
  tokenId,
  quantity,
  destinationPubKey,
  memo,
  txBuilderAdmin,
  server,
}) => {
  const contract = new Contract(tokenId);

  const tx = txBuilderAdmin
    .addOperation(
      contract.call(
        "mint",
        ...[
          accountToScVal(destinationPubKey), // to
          new ScInt(quantity).toI128(), // quantity
        ]
      )
    )
    .setTimeout(TimeoutInfinite);

  if (memo?.length > 0) {
    tx.addMemo(Memo.text(memo));
  }

  const built = tx.build();
  const sim = await server.simulateTransaction(built);

  const preparedTransaction = await server.prepareTransaction(built);
  // console.log("built transaction", sim);

  return preparedTransaction.toXDR();
};

export const getEstimatedFee = async (
  tokenId,
  quantity,
  destinationPubKey,
  memo,
  txBuilder,
  server
) => {
  const contract = new Contract(tokenId);

  const tx = txBuilder
    .addOperation(
      contract.call(
        "mint",
        ...[
          accountToScVal(destinationPubKey), // to
          numberToI128(quantity), // quantity
        ]
      )
    )
    .setTimeout(TimeoutInfinite);

  if (memo.length > 0) {
    tx.addMemo(Memo.text(memo));
  }

  const raw = tx.build();

  const simResponse = await server.simulateTransaction(raw);

  // console.log("sim response", simResponse);

  if (SorobanRpc.Api.isSimulationError(simResponse)) {
    throw simResponse.error;
  }
};

export const submitTx = async (signedXDR, networkPassphrase, server) => {
  const tx = TransactionBuilder.fromXDR(signedXDR, networkPassphrase);

  const sendResponse = await server.sendTransaction(tx);

  // console.log("transaction result", sendResponse);

  if (sendResponse.status === "PENDING") {
    let txResponse = await server.getTransaction(sendResponse.hash);

    // Poll this until the status is not "NOT_FOUND"
    while (
      txResponse.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND
    ) {
      // See if the transaction is complete
      // eslint-disable-next-line no-await-in-loop
      txResponse = await server.getTransaction(sendResponse.hash);
      // Wait a second
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (txResponse.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
      return txResponse.resultXdr.toXDR("base64");
    }
  }
  throw new Error(
    `Unabled to submit transaction, status: ${sendResponse.status}`
  );
};

export const ConnectWallet = async (setUserKey, setNetwork) => {
  let publicKey = "";
  let error = "";

  try {
    const isAllowed = await setAllowed();
    publicKey = await requestAccess();

    // console.log("user key is", publicKey);

    const nt = await getNetwork();

    setUserKey(() => publicKey);
    setNetwork(() => nt);
  } catch (e) {
    error = e;
  }

  if (error) {
    return error;
  }

  return publicKey;
};
