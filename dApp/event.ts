import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Decimal from 'decimal.js';
import nodemailer from 'nodemailer';
import * as dbManager from './db/dbManager';

const web3Http = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'));
var provider;
var web3 = undefined;

function createProvider() {
    provider = new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws');
    if (web3 == undefined)
    	web3 = new Web3(provider);
   	else
    	web3.setProvider(provider);

    provider.on('error', error_callback);
    provider.on('end', end_callback);
    provider.on('connect', connect_callback);
}

const error_callback = function () {
	console.log('WSS error');
	createProvider();
}

const end_callback = function () {
	console.log('WSS closed');
	createProvider();
}

const connect_callback = function () {
	console.log('WSS connected');
}
createProvider();

const minABI:AbiItem[] = [
    {
	    anonymous: false,
	    inputs: [{indexed: true, name: "_from", type: "address"},
	      			{indexed: true, name: "_to", type: "address"},
	      			{indexed: false, name: "_value", type: "uint256"}],
	    name: "Transfer",
	    type: 'event'
  	}
];

const WEI = 1000000000000000000;
const ethToWei = (amount) => new Decimal(amount).times(WEI);
var transporter = undefined;

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
	if (transporter == undefined) {
		transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.SERVICE_EMAIL,
				pass: process.env.SERVICE_EMAIL_PASS
			}
		});
	}

	var mailOptions = {
		from: process.env.SERVICE_EMAIL,
		to: email_address,
		subject: process.env.EMAIL_SUBJECT,
		text: balance + ' Tokens are transfered'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

async function getConfirmations(txHash) {
	try {

		const trx = await web3Http.eth.getTransaction(txHash);

		const currentBlock = await web3.eth.getBlockNumber();

		return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber;
	}
	catch (error) {
		console.log(error);
	}
}

function confirmEtherTransaction(txHash, confirmations = 10) {
	setTimeout(async () => {
		// Get current number of confirmations and compare it with sought-for value
		const trxConfirmations = await getConfirmations(txHash);
		console.log('Transaction with hash ' + txHash + ' has ' + trxConfirmations + ' confirmation(s)');

		if (trxConfirmations >= confirmations) {
			console.log('Transaction with hash ' + txHash + ' has been successfully confirmed');
			return;
		}

		return confirmEtherTransaction(txHash, confirmations);
	}, 30 * 1000);
}

function watchEtherTransfers() {
	const subscription = web3.eth.subscribe('pendingTransactions')

	// Subscribe to pending transactions
	subscription.subscribe((error, result) => {
		if (error) 
			console.log(error);
	})
	.on('data', async (txHash) => {
		try {
			// Get transaction details
			const trx = await web3Http.eth.getTransaction(txHash)
			// if (!validateTransaction(trx))
			// 	return;

			console.log('Found incoming Ether transaction from ' + trx.from + ' to ' + trx.to);;
			console.log('Transaction value is: ' + trx.value);
			console.log('Transaction hash is: ' + trx.hash);
			console.log('Transaction data is: ' + trx.input);
		}
		catch (error) {
			console.log(error);
		}
	})
}

function watchTokenTransfers() {
	const tokenContract = new web3.eth.Contract(minABI, process.env.TOKEN_ADDR);

	const options = {
		// filter: {
		// 	_to:    process.env.SERVER_WALLET,
		// },
		fromBlock: 'latest'
	};

	tokenContract.events.Transfer(options, async (error, event) => {
		if (error) {
			console.log(error)
			return;
		}

		if (event.returnValues._to.toLowerCase() !== process.env.SERVER_WALLET.toLowerCase())
			return;

		console.log('Found incoming token transaction from ' + event.returnValues._from);
		console.log('Transaction value is: ' + event.returnValues._value);
		console.log('Transaction hash is: ' + event.transactionHash + '\n');

		try {
			var userWallet = await dbManager.get_user_wallet(event.returnValues._from.toLowerCase());
			if (userWallet == undefined)
				console.log('There is no user wallet on database');
			else
				send_email(userWallet.email_address, event.returnValues._value / WEI);
		} catch (err) {
			console.log(err);
		}
	})
}

function listenEvent() {
	console.log('Listening token transfer event');
	watchTokenTransfers();
}

export {
	listenEvent
};