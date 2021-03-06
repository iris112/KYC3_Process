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
const express_1 = __importDefault(require("express"));
const dbManager = __importStar(require("../db/dbManager"));
const router = express_1.default.Router();
var preAction = function (req, res, next) {
    next();
};
router.post('/userwallet', preAction, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var wallet_addr = req.body.wallet_address;
        var email_addr = req.body.email_address;
        var json_data = {
            "status": 'ok',
        };
        try {
            var userWallet = yield dbManager.get_user_wallet(wallet_addr);
            if (userWallet == undefined)
                yield dbManager.insert_user_wallet(wallet_addr, email_addr);
            else
                yield dbManager.update_user_wallet(userWallet.id, email_addr);
        }
        catch (err) {
            console.log(err);
            json_data["status"] = 'fail';
        }
        res.send(json_data);
    });
});
// Error handler
router.use(function (err, req, res, next) {
    if (err) {
        res.status(500).send(err);
    }
});
exports.userWalletRouter = router;
//# sourceMappingURL=userwallet.js.map