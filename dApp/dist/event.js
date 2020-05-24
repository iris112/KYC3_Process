"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dbManager = __importStar(require("./db/dbManager"));
const web3Http = new web3_1.default(new web3_1.default.providers.HttpProvider('https://ropsten.infura.io'));
const web3 = new web3_1.default(new web3_1.default.providers.WebsocketProvider('wss://ropsten.infura.io/ws'));
const minABI = [
    {
        anonymous: false,
        inputs: [{ indexed: true, name: "_from", type: "address" },
            { indexed: true, name: "_to", type: "address" },
            { indexed: false, name: "_value", type: "uint256" }],
        name: "Transfer",
        type: 'event'
    }
];
const WEI = 1000000000000000000;
const ethToWei = (amount) => new decimal_js_1.default(amount).times(WEI);
var transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SERVICE_EMAIL,
        pass: process.env.SERVICE_EMAIL_PASS
    }
});
function validateTransaction(trx) {
    const toValid = trx.to !== null;
    if (!toValid)
        return false;
    const walletToValid = trx.to.toLowerCase() === process.env.WALLET_TO.toLowerCase();
    const walletFromValid = trx.from.toLowerCase() === process.env.WALLET_FROM.toLowerCase();
    const amountValid = ethToWei(process.env.AMOUNT).equals(trx.value);
    return toValid && walletToValid && walletFromValid && amountValid;
}
function send_email(email_address, balance) {
    var mailOptions = {
        from: process.env.SERVICE_EMAIL,
        to: email_address,
        subject: process.env.EMAIL_SUBJECT,
        text: balance + ' Tokens are transfered'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}
function getConfirmations(txHash) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trx = yield web3Http.eth.getTransaction(txHash);
            const currentBlock = yield web3.eth.getBlockNumber();
            return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber;
        }
        catch (error) {
            console.log(error);
        }
    });
}
function confirmEtherTransaction(txHash, confirmations = 10) {
    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        // Get current number of confirmations and compare it with sought-for value
        const trxConfirmations = yield getConfirmations(txHash);
        console.log('Transaction with hash ' + txHash + ' has ' + trxConfirmations + ' confirmation(s)');
        if (trxConfirmations >= confirmations) {
            console.log('Transaction with hash ' + txHash + ' has been successfully confirmed');
            return;
        }
        return confirmEtherTransaction(txHash, confirmations);
    }), 30 * 1000);
}
function watchEtherTransfers() {
    const subscription = web3.eth.subscribe('pendingTransactions');
    // Subscribe to pending transactions
    subscription.subscribe((error, result) => {
        if (error)
            console.log(error);
    })
        .on('data', (txHash) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Get transaction details
            const trx = yield web3Http.eth.getTransaction(txHash);
            // if (!validateTransaction(trx))
            // 	return;
            console.log('Found incoming Ether transaction from ' + trx.from + ' to ' + trx.to);
            ;
            console.log('Transaction value is: ' + trx.value);
            console.log('Transaction hash is: ' + trx.hash);
            console.log('Transaction data is: ' + trx.input);
        }
        catch (error) {
            console.log(error);
        }
    }));
}
function watchTokenTransfers() {
    const tokenContract = new web3.eth.Contract(minABI, process.env.TOKEN_ADDR);
    const options = {
        filter: {
            _to: process.env.SERVER_WALLET,
        },
        fromBlock: 'latest'
    };
    var exampleEvent = tokenContract.Transfer({ _to: process.env.SERVER_WALLET });
    tokenContract.events.Transfer(options, (error, event) => __awaiter(this, void 0, void 0, function* () {
        if (error) {
            console.log(error);
            return;
        }
        process.env.SERVER_WALLET;
        console.log('Found incoming token transaction from ' + event.returnValues._from);
        console.log(event.returnValues._to);
        console.log('Transaction value is: ' + event.returnValues._value);
        console.log('Transaction hash is: ' + event.transactionHash + '\n');
        try {
            var userWallet = yield dbManager.get_user_wallet(event.returnValues._from);
            if (userWallet == undefined)
                console.log('There is no user wallet on database');
            else
                send_email(userWallet.email_address, event.returnValues._value);
        }
        catch (err) {
            console.log(err);
        }
    }));
}
function listenEvent() {
    console.log('Listening token transfer event');
    watchTokenTransfers();
}
exports.listenEvent = listenEvent;
//# sourceMappingURL=event.js.map