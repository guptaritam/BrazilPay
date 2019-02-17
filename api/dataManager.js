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
				"name": "_email",
				"type": "string"
			}
		],
		"name": "getCityMaker",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
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
				"name": "_postId",
				"type": "string"
			},
			{
				"name": "_cityMakerEmail",
				"type": "string"
			},
			{
				"name": "_URL",
				"type": "string"
			},
			{
				"name": "_postContent",
				"type": "string"
			},
			{
				"name": "_hashtags",
				"type": "string"
			}
		],
		"name": "addPost",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_postId",
				"type": "string"
			},
			{
				"name": "_selfEmail",
				"type": "string"
			}
		],
		"name": "getPost",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
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
				"name": "_email",
				"type": "string"
			}
		],
		"name": "getNoOfPosts",
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
				"name": "_postId",
				"type": "string"
			},
			{
				"name": "_URL",
				"type": "string"
			},
			{
				"name": "_postContent",
				"type": "string"
			},
			{
				"name": "_hashtags",
				"type": "string"
			}
		],
		"name": "updatePost",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_postId",
				"type": "string"
			}
		],
		"name": "validatePost",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_selfEmail",
				"type": "string"
			},
			{
				"name": "_emailToWhitelist",
				"type": "string"
			},
			{
				"name": "_postId",
				"type": "string"
			}
		],
		"name": "whitelistEmailForPost",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_email",
				"type": "string"
			},
			{
				"name": "_cityMakerData",
				"type": "string"
			}
		],
		"name": "updateCityMaker",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_email",
				"type": "string"
			},
			{
				"name": "_cityMakerData",
				"type": "string"
			}
		],
		"name": "addCityMaker",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
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
				"name": "_email",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_cityMakerData",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_noOfPosts",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_timestamp",
				"type": "uint256"
			}
		],
		"name": "CityMakerEvent",
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
				"name": "_cityMakerEmail",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_URL",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_postContent",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_hashtags",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "status",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_timestamp",
				"type": "uint256"
			}
		],
		"name": "PostEvent",
		"type": "event"
	}
];

//now contract initiation
var dataManagerContract = web3.eth.contract(dataManagerContractABI).at(dataManagerContractAddress);

dataManagerApiRoutes.get('/', function(req, res) {

    res.send("Pix.City API server");

});

dataManagerApiRoutes.post('/whitelistEmailForPost', function(req, res) {

    var selfEmail = req.body._selfEmail;
    var emailToWhitelist = req.body._emailToWhitelist;
    var postId = req.body._postId;


    dataManagerContract.whitelistEmailForPost.sendTransaction(selfEmail, emailToWhitelist, postId, {
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

dataManagerApiRoutes.post('/addCityMaker', function(req, res) {

    var email = req.body._email;
    var cityMakerData = req.body._cityMakerData;
    //console.log(JSON.stringify(patientData));


    dataManagerContract.addCityMaker.sendTransaction(email, JSON.stringify(cityMakerData), {
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


dataManagerApiRoutes.post('/updateCityMaker', function(req, res) {

    var email = req.body._email;
    var cityMakerData = req.body._cityMakerData;
    //console.log(JSON.stringify(patientData));


    dataManagerContract.updateCityMaker.sendTransaction(email, JSON.stringify(cityMakerData), {
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


dataManagerApiRoutes.post('/getCityMaker', function(req, res) {

    var email = req.body._email;

    dataManagerContract.getCityMaker.call(email, function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            res.json({
                "cityMakerData" : JSON.parse(result[0]),
                "noOfPosts" : result[1]
            });
            // res.json(JSON.parse(result));
        } else
            res.status(401).json("Error" + err);
    });

})


dataManagerApiRoutes.post('/getNoOfPosts', function(req, res) {

    var email = req.body._email;

    dataManagerContract.getNoOfPosts.call(email, function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            
            res.json(result);
        } else
            res.status(401).json("Error" + err);
    });

})

dataManagerApiRoutes.post('/addPost', function(req, res) {

    var postId = req.body._postId;
    var cityMakerEmail = req.body._cityMakerEmail;
    var URL = req.body._URL;
    var postContent = req.body._postContent;
    var hashtags = req.body._hashtags;


    dataManagerContract.addPost.sendTransaction(postId, cityMakerEmail, URL, JSON.stringify(postContent), hashtags, {
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


dataManagerApiRoutes.post('/updatePost', function(req, res) {

    var postId = req.body._postId;
    var URL = req.body._URL;
    var postContent = req.body._postContent;
    var hashtags = req.body._hashtags;


    dataManagerContract.updatePost.sendTransaction(postId, URL, JSON.stringify(postContent), hashtags, {
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



dataManagerApiRoutes.post('/getPost', function(req, res) {

    var postId = req.body._postId;
    var selfEmail = req.body._selfEmail;

    dataManagerContract.getPost.call(postId, selfEmail, function(err, result) {
        console.log(result);
        if (!err) {

            res.json({
                "cityMakerEmail" : result[0],
                "URL" : result[1],
                "postContent" : JSON.parse(result[2]),
                "hashtags" : result[3],
                "status" : result[4]
            });
            //res.json(JSON.parse(result));
        } else
            res.status(401).json("Error" + err);
    });

})


dataManagerApiRoutes.post('/validatePost', function(req, res) {

    var postId = req.body._postId;


    dataManagerContract.validatePost.sendTransaction(postId, {
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

// dataManagerApiRoutes.get('/get/patients', function(req, res) {

//     var patientEvent = dataManagerContract.PatientEvent({
//         from: web3.eth.defaultAccount
//     }, {
//         fromBlock: 0,
//         toBlock: 'latest'
//     });

//     patientEvent.get(function(err, result) {
//         //console.log(result);
//         if (!err) {

//             //console.log(response);
//             //res.json(result);
//             var arrayLength = result.length;
//             console.log(arrayLength)
//             var processedArray = [];
//             for (var i = 0; i < arrayLength; i++) {
//             	processedArray.push(

//                         {

//                             "blockNumber": result[i].blockNumber,
//                             "event": result[i].event,
//                             "transactionHash": result[i].transactionHash,
//                             "actionPerformed": result[i].args._actionPerformed,
//                             "email": result[i].args._email,
//                             "walletBalance": result[i].args._walletBalance,
//                             "timestamp" : result[i].args._timestamp
//                         }

//                     )

//             }
//             res.json(processedArray);
//         } else
//             return res.json("Error" + err);
//     });

// })

dataManagerApiRoutes.get('/getCityMakerLogs', function(req, res) {

    var cityMakerEvent = dataManagerContract.CityMakerEvent({
        from: web3.eth.defaultAccount
    }, {
        fromBlock: 0,
        toBlock: 'latest'
    });

    cityMakerEvent.get(function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            return res.json("Error" + err);
    });

})

dataManagerApiRoutes.get('/getPostLogs', function(req, res) {

    var postEvent = dataManagerContract.PostEvent({
        from: web3.eth.defaultAccount
    }, {
        fromBlock: 0,
        toBlock: 'latest'
    });

    postEvent.get(function(err, result) {
        //console.log(result);
        if (!err) {

            //console.log(response);
            res.json(result);
        } else
            return res.json("Error" + err);
    });

})

// dataManagerApiRoutes.post('/generate/token/patient', function(req, res) {


//     var options = { method: 'POST',
//   url: 'http://localhost:8545',
//   headers: 
//    { 'Postman-Token': 'd68c75a7-85d4-446b-8b15-0eade6b5e3ad',
//      'cache-control': 'no-cache',
//      'Content-Type': 'application/json' },
//   body: 
//    { id: '1',
//      jsonrpc: '2.0',
//      method: 'personal_newAccount',
//      params: [ req.body._password ] },
//   json: true };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   //console.log(body);
//   res.json({"patientToken" : body.result});
//   // res.json({
//   //               "token" : result
//   //           });
// });
// 	//res.send(body);
// });



dataManagerApiRoutes.post('/getTransactionDetails', function(req, res) {


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
