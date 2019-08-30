var dataManagerApiRoutes = require('express').Router();

var Web3 = require('web3');
var config = require('../config/config')
var request = require('request');

var web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    console.log(web3.net.peerCount);
}

web3.eth.defaultAccount = web3.eth.coinbase;

var dataManagerContractAddress = config.dataManagerContractAddress;


// now contract interface
var dataManagerContractABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_userName",
				"type": "string"
			},
			{
				"name": "_userDataJson",
				"type": "string"
			}
		],
		"name": "addUser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_amountToIncrease",
				"type": "uint256"
			}
		],
		"name": "increaseTotalSupply",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_withdrawerUserName",
				"type": "string"
			},
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "approveWithdrawOrder",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_userName",
				"type": "string"
			}
		],
		"name": "getUserAddress",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_userName",
				"type": "string"
			}
		],
		"name": "getUserWalletBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_userName",
				"type": "string"
			}
		],
		"name": "getUserData",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_receiverUserName",
				"type": "string"
			},
			{
				"name": "_senderUserName",
				"type": "string"
			},
			{
				"name": "_amount",
				"type": "uint256"
			},
			{
				"name": "_remarks",
				"type": "string"
			}
		],
		"name": "sendTokens",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_amountToDecrease",
				"type": "uint256"
			}
		],
		"name": "decreaseTotalSupply",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_receiverUserName",
				"type": "string"
			},
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "approveBuyOrder",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "getTotalTokensSold",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_userName",
				"type": "string"
			},
			{
				"name": "_userAddress",
				"type": "string"
			}
		],
		"name": "mapUserAddress",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_userName",
				"type": "string"
			},
			{
				"name": "_userDataJson",
				"type": "string"
			}
		],
		"name": "updateUserData",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "getAvailableTotalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_userName",
				"type": "string"
			}
		],
		"name": "getUserTotalTransfers",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_totalSupply",
				"type": "uint256"
			}
		],
		"name": "setTotalSupply",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_actionPerformed",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_userName",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_userAddress",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_walletBalance",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_totalTransfers",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_userDataJson",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_timestamp",
				"type": "uint256"
			}
		],
		"name": "UserEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_actionPerformed",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_senderUserName",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_receiverUserName",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_remarks",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_timestamp",
				"type": "uint256"
			}
		],
		"name": "TransferEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_actionPerformed",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_userName",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_timestamp",
				"type": "uint256"
			}
		],
		"name": "BuyAndWithdrawEvent",
		"type": "event"
	}
];

//now contract initiation
var dataManagerContract = web3.eth.contract(dataManagerContractABI).at(dataManagerContractAddress);

dataManagerApiRoutes.get('/', function(req, res) {

    res.send("BrazilPay API server");

});

dataManagerApiRoutes.post('/set/totalSupply', function(req, res) {

    var totalSupply = req.body._totalSupply;


    dataManagerContract.setTotalSupply.sendTransaction(totalSupply, {
        from: web3.eth.defaultAccount,
        gas: 6000000
    }, function(err, result) {
        console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            res.status(401).json("Error" + err);
    });
});

dataManagerApiRoutes.post('/increase/totalSupply', function(req, res) {

    var amountToIncrease = req.body._amountToIncrease;


    dataManagerContract.increaseTotalSupply.sendTransaction(amountToIncrease, {
        from: web3.eth.defaultAccount,
        gas: 6000000
    }, function(err, result) {
        console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            res.status(401).json("Error" + err);
    });
});

dataManagerApiRoutes.post('/decrease/totalSupply', function(req, res) {

    var amountToDecrease = req.body._amountToDecrease;


    dataManagerContract.decreaseTotalSupply.sendTransaction(amountToDecrease, {
        from: web3.eth.defaultAccount,
        gas: 6000000
    }, function(err, result) {
        console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            res.status(401).json("Error" + err);
    });
});

dataManagerApiRoutes.post('/add/user', function(req, res) {

    var userName = req.body._userName;
    var userDataJson = req.body._userDataJson;


    dataManagerContract.addUser.sendTransaction(userName, JSON.stringify(userDataJson), {
        from: web3.eth.defaultAccount,
        gas: 6000000
    }, function(err, result) {
        console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            res.status(401).json("Error" + err);
    });
});


dataManagerApiRoutes.post('/update/userData', function(req, res) {

    var userName = req.body._userName;
    var userDataJson = req.body._userDataJson;


    dataManagerContract.updateUserData.sendTransaction(userName, JSON.stringify(userDataJson), {
        from: web3.eth.defaultAccount,
        gas: 6000000
    }, function(err, result) {
        console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            res.status(401).json("Error" + err);
    });
});


dataManagerApiRoutes.post('/get/userData', function(req, res) {

    var userName = req.body._userName;

    dataManagerContract.getUserData.call(userName, function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            res.json({
                "userDataJson" : JSON.parse(result)
            });
            // res.json(JSON.parse(result));
        } else
            res.status(401).json("Error" + err);
    });

})

dataManagerApiRoutes.post('/map/userAddress', function(req, res) {

    var userName = req.body._userName;
    var userAddress = req.body._userAddress;


    dataManagerContract.mapUserAddress.sendTransaction(userName, userAddress, {
        from: web3.eth.defaultAccount,
        gas: 6000000
    }, function(err, result) {
        console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            res.status(401).json("Error" + err);
    });
});

dataManagerApiRoutes.post('/sendTokens', function(req, res) {

    var receiverUserName = req.body._receiverUserName;
    var senderUserName = req.body._senderUserName;
    var amount = req.body._amount;
    var remarks = req.body._remarks;


    dataManagerContract.sendTokens.sendTransaction(receiverUserName, senderUserName, amount, remarks, {
        from: web3.eth.defaultAccount,
        gas: 6000000
    }, function(err, result) {
        console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            res.status(401).json("Error" + err);
    });
});

dataManagerApiRoutes.post('/approve/withdrawOrder', function(req, res) {

    var withdrawerUserName = req.body._withdrawerUserName;
    var amount = req.body._amount;


    dataManagerContract.approveWithdrawOrder.sendTransaction(withdrawerUserName, amount, {
        from: web3.eth.defaultAccount,
        gas: 6000000
    }, function(err, result) {
        console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            res.status(401).json("Error" + err);
    });
});

dataManagerApiRoutes.post('/approve/buyOrder', function(req, res) {

    var receiverUserName = req.body._receiverUserName;
    var amount = req.body._amount;


    dataManagerContract.approveBuyOrder.sendTransaction(receiverUserName, amount, {
        from: web3.eth.defaultAccount,
        gas: 6000000
    }, function(err, result) {
        console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            res.status(401).json("Error" + err);
    });
});

dataManagerApiRoutes.post('/get/userAddress', function(req, res) {

    var userName = req.body._userName;

    dataManagerContract.getUserAddress.call(userName, function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            res.json({
                "userAddress" : result
            });
            // res.json(JSON.parse(result));
        } else
            res.status(401).json("Error" + err);
    });

})

dataManagerApiRoutes.post('/get/userWalletBalance', function(req, res) {

    var userName = req.body._userName;

    dataManagerContract.getUserWalletBalance.call(userName, function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            res.json({
                "walletBalance" : result
            });
            // res.json(JSON.parse(result));
        } else
            res.status(401).json("Error" + err);
    });

})

dataManagerApiRoutes.post('/get/userTotalTransfers', function(req, res) {

    var userName = req.body._userName;

    dataManagerContract.getUserTotalTransfers.call(userName, function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            res.json({
                "userTotalTransfers" : result
            });
            // res.json(JSON.parse(result));
        } else
            res.status(401).json("Error" + err);
    });

})

dataManagerApiRoutes.post('/get/remainingSupply', function(req, res) {

    dataManagerContract.getAvailableTotalSupply.call(function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            res.json({
                "remainingSupply" : result
            });
        } else
            res.status(401).json("Error" + err);
    });

})

dataManagerApiRoutes.post('/get/totalTokensSold', function(req, res) {

    dataManagerContract.getTotalTokensSold.call(function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            res.json({
                "totalTokensSold" : result
            });
            // res.json(JSON.parse(result));
        } else
            res.status(401).json("Error" + err);
    });

})

dataManagerApiRoutes.get('/get/userLogs', function(req, res) {

    var userEvent = dataManagerContract.UserEvent({
        from: web3.eth.defaultAccount
    }, {
        fromBlock: 0,
        toBlock: 'latest'
    });

    userEvent.get(function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            return res.json("Error" + err);
    });

})

dataManagerApiRoutes.get('/get/transferLogs', function(req, res) {

    var transferEvent = dataManagerContract.TransferEvent({
        from: web3.eth.defaultAccount
    }, {
        fromBlock: 0,
        toBlock: 'latest'
    });

    transferEvent.get(function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            return res.json("Error" + err);
    });

})

dataManagerApiRoutes.get('/get/buyAndWithdrawLogs', function(req, res) {

    var buyAndWithdrawEvent = dataManagerContract.BuyAndWithdrawEvent({
        from: web3.eth.defaultAccount
    }, {
        fromBlock: 0,
        toBlock: 'latest'
    });

    buyAndWithdrawEvent.get(function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            return res.json("Error" + err);
    });

})

dataManagerApiRoutes.post('/generate/userAddress', function(req, res) {


    var options = { method: 'POST',
  url: 'http://localhost:8545',
  headers: 
   { 'Postman-Token': 'd68c75a7-85d4-446b-8b15-0eade6b5e3ad',
     'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body: 
   { id: '1',
     jsonrpc: '2.0',
     method: 'personal_newAccount',
     params: [ req.body._password ] },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  //console.log(body);
  res.json({"userAddress" : body.result});
  // res.json({
  //               "token" : result
  //           });
});
	//res.send(body);
});



dataManagerApiRoutes.post('/get/transactionDetails', function(req, res) {


    var options = { method: 'POST',
  url: 'http://localhost:8545',
  headers: 
   { 
     'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body: 
   { jsonrpc: '2.0',
     method: 'eth_getTransactionReceipt',
     params: [ req.body._txhash ],
     id: 1 },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  //console.log(body);
  res.json(body);
});
	//res.send(body);
});




module.exports = dataManagerApiRoutes;
