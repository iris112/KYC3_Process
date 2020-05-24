import express from 'express';
import * as dbManager from '../db/dbManager';

const router:express.Router = express.Router();

var preAction = function(req, res, next) {
	next();
};

router.post('/userwallet', preAction, async function(req, res) {
	var wallet_addr = req.body.wallet_address.toLowerCase();
	var email_addr = req.body.email_address;
	var json_data = {
		"status":'ok',
	};

	try {
		var userWallet = await dbManager.get_user_wallet(wallet_addr);
		if (userWallet == undefined)
			await dbManager.insert_user_wallet(wallet_addr, email_addr);
		else
			await dbManager.update_user_wallet(userWallet.id, email_addr);
	} catch (err) {
		console.log(err);
		json_data["status"] = 'fail';
	}

	res.send(json_data);
});

// Error handler
router.use(function(err, req, res, next) {
	if (err) {
		res.status(500).send(err);
	}
});

export const userWalletRouter: express.Router = router;
