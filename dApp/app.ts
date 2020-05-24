import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import {userWalletRouter} from './routers/userwallet';

// Creates and configures an ExpressJS web server.
class App {
  // ref to Express instance
  public express: express.Application;
  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.express.use(bodyParser.urlencoded({
      extended: true
    }));
    this.express.use(bodyParser.json());
    this.routes();

  }
  // Configure Express middleware.
  private middleware(): void {}

  // Configure API endpoints.
  private routes(): void {
    this.express.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    this.express.use('/', userWalletRouter);
  }
}
export default new App().express;
