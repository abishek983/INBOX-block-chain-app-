/*
Mocha functions:
    it :- run a test and make an assertion
    describe :- Groups together 'it' functions
    beforeEach :- Execute some genral setup code
*/

const assert = require('assert');
const gancahe = require('ganache-cli');
const Web3 = require('web3');
const {interface , bytecode} = require('../compile.js');

const web3 = new Web3(gancahe.provider()); //provider changes over time

let accounts;
let inbox;

beforeEach(async ()=>{
    //get a lsit of all accounts
    accounts  = await web3.eth.getAccounts();

    //use onr of the account 
    // to deploy
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data : bytecode , arguments : ['hi there']})
        .send({from : accounts[0] ,gas : '1000000'})
});

describe('Inbox' , ()=>{
    /* this function is to check if the deployment works correctly or not*/
    it('deploy smart contracts' , ()=>{
        assert.ok(inbox.options.address); // "ok" is used to check if the values exists or not 
        // console.log(inbox);
    })
    it('has default meassage' , async ()=>{
        const message = await inbox.methods.message().call();
        assert.equal(message, 'hi there');
    })

    it('can change the message' , async()=>{
        await inbox.methods.setMessage('bye').send({from : accounts[0] , gas : '1000000'});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    })
})


