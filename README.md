# SCAB_blockchainFramework

<img src="images/logo.jpg" class="align-right">

Self Compressing Activity Based Blockchain!




---

## Introduction 

This framework was inspired by the intriguing experiences and the various shortcomings that we faced while building a Decentralized Application (D-app) through the use of public blockchains, more specifically a combination of React with Ethereum(web3). 

The whole premise of even thinking of making this framework was to address certain issues, if not completely but partially such as:

* Speed
* Compatibility
* Reliance on web3
* Size

This framework utilizes technologies like Node.js, solidity, ethereum test-net, IPFS and web3.

<p float="left">
<img src="images/js.png" width="170"  class="align-center" >
<img src="images/eth.png" width="110" class="align-center">
<img src="images/solidity.png" width="180" class="align-right" >
<img src="images/ipfs.png" width="180" class="align-left">
<img src="images/web3.jpeg" width="180" class="align-left">
</p>


## The problem with web3 and Smart-Contracts

When working on a React project with web3 as its sole provider of carrying out user interactions on each button click, it soon becomes cumbersome to a user who is using the app and gives a wrong impression to the user about the perceived speed of blockchain transactions versus the actual speed of their transactions going through the test-net, in our case the Rinkeby test-net, and the result showing on the page.

Dealing with page load times right after or before a transaction, the user is often  expecting a small amount of waiting time since even in traditional transactions it takes a few seconds to process them when using VISA or MasterCard portals. The real issue is when the user experiences delays in doing basic tasks which majorly involve executing CRUD operations on their data. This delay can be attributed to the fact that when user's data is stored on the Smart-contract, every operation other than READ is processed as a transaction as it modifies the state of the blockchain and will be sent to the test-net to get processed in a block. The wait time for the block to get processed averages around 10-15 sec depending on block difficulty and number of nodes in the test-net.

<img src="images/traditional.jpg" class="align-center">

User's nowadays are used to performing multitude of CRUD operations within a small amount of time since that data is stored in a centralized space but with blockchain, anything other than waiting for some ether or bitcoin to get transferred seems like unreasonable due to how we have gotten used to traditional systems.


## Decoupling components and Load Sharing

It is clear to anyone using web3 that not all operations should be executed by it, specially the ones that take more than 5 seconds as it really hampers the user experience.

Our approach to this problem was decoupling the time-consuming operations to proprietary blockchain that is specialized to handle CRUD operations rather than relying entirely on web3 and Smart-contracts to store and update its state.

For example, we have used this framework to design a decentralized blockchain store from which people can buy and sell products using Ethereum as its currency. To achieve this goal, we designed a state based transaction system through which every user interaction is recorded as a transaction and once the pending transactions are mined in a block, the state changes and issues updates to our API Server which hosts the database as well as informs web3 of any user updates that are required.

<img src="images/scabWay.jpg" class="align-center">

The Load Sharing aspect of this project comes from the fact that the majority of the transactions which relate to changing state of the user's or the store's database are done via our framework which cuts down the average time to process these transactions by 3 times when compared to the traditional way of executing them using web3 and Smart-Contracts.


