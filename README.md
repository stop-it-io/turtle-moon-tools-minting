# Turtle Moon Tools (TMT) - Minting

Turtle Moon is the team behind NFT projects like HGraph Punks 

We want to help build the future of NFTS on Hedera so we've created these tools for our own project, but are open sourcing them to the community to help expedite the growth and speed of NFTs on Hedera. 

# WARNING
# THIS IS IN BETA
This codebase is in BETA, meaning there are a lot of bugs that are still needing to be fixed and enhancements to be integrated. USE AT YOUR OWN RISK. This software is provided as is and Turtle Moon is not responsible for any issues using the software.


## How to run
Prerequisites: 
 - NPM
 - Proper IDE (intelliJ, Eclipse)

1. `npm i @craco/craco`
3. `npm run build`
4. `npm start`

## Testnet data
Minted token ID: `0.0.48298041`<br/>
Minted token supply key: `302e020100300506032b657004220420968f2b60dd2d7b57da44fbd0156ab1fb9a5da286713b742d03a388d6e81a440e`<br/>

Treasury, recovery and login account ID: `0.0.46034441`<br/>
Login PK: `302e020100300506032b65700422042038aea55a8fe895cf19c70d24c58d716ffb81847f9627601cd560103fcd8e409a`<br/>
Login API key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDUyNDc1ZDAzOTQ3Q2E3ODNENDU4OTg5NzJFMzYyZUM2NDBEYWUxMjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzUxNjQ4NzgxMywibmFtZSI6InVwbG9hZCBrZXkifQ.vDuG-cLgM5OPZQ3x9TYvU5MdEf6UOV9X_e5_oi3R1JA`

_metadata.json example content:
`
[{
    "name": "Test #1",
    "creator": "creator",
    "description": "desc",
    "image": "To be replaced",
    "type": "image/png",
    "format": "opensea",
    "attributes": [
        {
            "trait_type": "weather",
            "value": "Sunny"
        },
        {
            "trait_type": "handheld item",
            "value": "Heavy machine gun"
        },
        {
            "trait_type": "clothing",
            "value": "Combat uniform green"
        },
        {
            "trait_type": "headwear",
            "value": "Baseball cap"
        },
        {
            "trait_type": "footwear",
            "value": "Army boots"
        },
        {
            "trait_type": "ship",
            "value": "Jet and ship"
        },
        {
            "trait_type": "daytime",
            "value": "Noon"
        }
    ]
},
{
    "name": "Test #2",
    "creator": "creator",
    "description": "desc",
    "image": "To be replaced",
    "type": "image/png",
    "format": "opensea",
    "attributes": [
        {
            "trait_type": "weather",
            "value": "f"
        },
        {
            "trait_type": "handheld item",
            "value": "a"
        },
        {
            "trait_type": "clothing",
            "value": "b"
        },
        {
            "trait_type": "headwear",
            "value": "d"
        },
        {
            "trait_type": "footwear",
            "value": "a"
        },
        {
            "trait_type": "ship",
            "value": "d"
        },
        {
            "trait_type": "daytime",
            "value": "e"
        }
    ]
}
]
`
## Known issues
### Cannot find module ipfs-car/pack
https://stackoverflow.com/questions/70063600/cant-resolve-ipfs-car-blockstore-memory-when-importing-nft-storage

### window.require is not a function
Replace `const fs = window.require('fs');` with `const fs = require('fs');` in `tokenService.js`
https://stackoverflow.com/questions/56091343/typeerror-window-require-is-not-a-function



## Getting Started
You will need three accounts to create NFTs with TMT.

1. Hedera Portal Account:
https://portal.hedera.com/

2. NFT Storage Account:
https://nft.storage/

## Setting Up The Project Locally

Download the tools at:
https://tool.turtlemoon.io

Windows, Mac, and Linux are supported platforms

## Donations
We appreciate your support
Donation HBAR Wallet Address:

## 0.0.591814

### Share your creations on twitter with the hashtag #TMTNFT @TurtleMoonCC

## Change Log

### 0.9.3
Changes:
- Add in ability to add ADMIN key ad FREEZE key to single mints and bulk minting
- Add ability to upload array of metadata JSON files already uploaded to IPFS
- Add ability to hide token logs to reduce lag after giant mints
- Increase file format support for single minting to all image files, videos, filetypes. TEST THIS ON TESTNET FIRST TO MAKE SURE FILETYPE IS SUPPORTED
- Update Readme
