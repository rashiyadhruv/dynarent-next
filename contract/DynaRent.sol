// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract NFTRent {

    // Events

    event ListToMarketplace(string indexed nftHash, address owner, string chainName);
    event Rented(string indexed nftHash, address lender, address renter);
    event Returned(string indexed nftHash, address renter);

    address payable owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    receive() external payable {}
    fallback() external payable {}

    // NFT struct
    struct NftData {
        string nftHash;
        address nftAddress;
        string nftId;
        string nftName;
        string tokenUri;
        address owner;
        uint256 initFlowrate;
        uint256 typeOfIncrease;
        uint256 attribute;
        string chainName;
        bool isListed;
        bool isRented;
    }

    NftData[] public marketplaceNfts;

    // Mapping 
    mapping (address => mapping(string => bool)) public isRented;

    // My NFTs that I rented to others
    mapping (string => NftData[]) public myNfts;

    mapping (address => NftData[]) public myRentedNfts;
    mapping (string => NftData) public nftDetails;

    

    // List NFT to marketplace
    function listToMarketplace(string memory _nftHash, address _nftAddress, string memory _nftId, string memory _nftName, string memory _tokenUri,  uint256 _flowrate, uint16 _typeOfIncrease, uint256 _attribute, string memory _chainName) external {
        NftData memory newListing = NftData(_nftHash, _nftAddress, _nftId, _nftName,  _tokenUri, msg.sender, _flowrate, _typeOfIncrease, _attribute, _chainName, true, false);

        marketplaceNfts.push(newListing);
        nftDetails[_nftHash] = newListing;

        emit ListToMarketplace(_nftHash, msg.sender, _chainName);
    }

    function getMarketplaceNfts() external view returns (NftData[] memory) {
        uint totalItemCount = marketplaceNfts.length;
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (nftDetails[marketplaceNfts[i].nftHash].isListed == true) {
                itemCount += 1;
            }    
        }

        NftData[] memory items = new NftData[](itemCount);

        for (uint i = 0; i < totalItemCount; i++) {
            if (nftDetails[marketplaceNfts[i].nftHash].isListed == true) {

                NftData storage currentItem = nftDetails[marketplaceNfts[i].nftHash];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }

        return items;
    }

    function rent(string memory _nftHash, address _user) external {
        myRentedNfts[_user].push(nftDetails[_nftHash]); // will be used to fetch all the NFTs rented by the user
        isRented[_user][_nftHash] = true; // will be used in verification
        nftDetails[_nftHash].isRented = true;
        nftDetails[_nftHash].isListed = false;

        emit Rented(_nftHash, nftDetails[_nftHash].owner, _user);
    }

    // rented nfts return an array of all the NFTs rented by an address
    function getMyRentedNfts(address _user) external view returns (NftData[] memory) {
        uint totalItemCount = myRentedNfts[_user].length;
        uint itemCount = 0;
        uint currentIndex = 0;

        // Get all the NFTs in the myRentedNfts array

        // Get the hashes and check if they are rented or not

        // If not rented add to the array and then return

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (nftDetails[myRentedNfts[_user][i].nftHash].isRented == true) {
                itemCount += 1;
            }    
        }

        NftData[] memory items = new NftData[](itemCount);

        for (uint i = 0; i < totalItemCount; i++) {
            if (nftDetails[myRentedNfts[_user][i].nftHash].isRented == true) {

                NftData storage currentItem = nftDetails[myRentedNfts[_user][i].nftHash];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }

        return items;
    }

    function getNftDetailsByHash(string memory _nftHash) external view returns(NftData memory) {
        return nftDetails[_nftHash];  // returns the details of the nfts using the hash
    }

    // Chainlink automation

    function returnNft(string memory _nftHash, address _user) external {
        isRented[_user][_nftHash] = false;
        nftDetails[_nftHash].isRented = false;

        emit Returned(_nftHash, _user);
    }


    // Verify NFT
    function verify(string memory _nftHash, address _user) view external returns(bool) {
        return isRented[_user][_nftHash];  // returns true or false to verify if the nft is rented or not
    }

    function getOwner() view external returns(address) {
        return owner;
    }

}