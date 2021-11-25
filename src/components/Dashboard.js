import {useEffect, useState, useContext} from 'react'
import {
  Paper,
  TextField, 
  Button,
  Box,
  Tab,
  Grid,
  Select,
  InputLabel,
  MenuItem,
  Typography,
  Checkbox
} from '@mui/material'

import {
  TabContext,
  TabList,
  TabPanel,
} from '@mui/lab'

import {
  HederaEnviroment,
  ClientNFT,
  DebugLevel,
  CategoryNFT
} from '@xact-wallet-sdk/nft'

import {
  xactCreateToken,
  tokenGetInfo,
  associateToken,
  sellNFT,
  getNFTQRCode,
  removeNFTFromSale,
  createNFTs,
  mintHashlips,
  readJson,
} from '../scripts/tokenService'

import {TokenView} from './TokenView'        
import {QRView} from './QRView'        
import {uploadFile} from '../scripts/fileService'
import TMTContext from '../context/tmt-context'


export const Dashboard = () => {
    /* Create State for Tabs */
    const [tab, setTab] = useState('1');

    /* Set Account ID Based on ENV */
    /* ONLY USE IF BYPASSING QR CODE LOGIN */
    // const [accountId, setAccountId] = useState(process.env.REACT_APP_MY_ACCOUNT_ID_TESTNET);
    // const [xactPrivateKey, setXactPrivateKey] = useState(process.env.REACT_APP_XACT_PRIVATE_KEY_TESTNET);
    
    // Read context of signed in Xact wallet creds
    const context = useContext(TMTContext)
    const user = context?.user
    const accountId = user?.accountId
    const hederaMainnetEnv = context?.hederaMainnetEnv
    const setLoading = context?.setLoading
    const xactClient = context?.xactClient

    /* Init Tokeen State */
    const [token, setToken] = useState(
      {
        name: '',
        tokenId: '',
        description: '',
        creator: '',
        supply: '',
        category: 'Collectible',
        royalty: '',
        imageUrl: '',
        imageData: undefined,
        imageType: 'image/jpg',
        photoSize: 1,
      }
    );

    /* Init NFTForSale State */
    const [NFTForSale, setNFTForSale] = useState(
      {
        fromAccountId: accountId,
        hbarAmount: '',
        quantity: '',
        tokenId: '',
      }
    );

    /* Init Hashlips Token  State */
    const [hashlipsToken, setHashlipsToken] = useState(
      {
        name: '',
        symbol: '',
        maxSupply: '',
        royalty: '',
        treasuryAccountId: accountId,
        renewAccountId: accountId,
        previousTokenId: ''
      }
    );

    const [tokenIdInfo, setTokenIdInfo] = useState('');
    const [tokenIDQR, setTokenIdQR] = useState('');

    const [alreadyMintedToken, setAlreadyMintedToken] = useState(false);
    const handleAMTChange = (event) => {
      setAlreadyMintedToken(event.target.checked);
    };

    const handleTabSelection = (event, newValue) => {
      setTab(newValue);
    };

    const clearLogs = () => {
      /* TODO: refactor to make DRY */
      if (tab==="7") {
        const r = confirm("All HASHLIPS TOKEN DATA will be cleaered from logs, do you want to proceed?");
        if (r !== true) {
          return alert('Canceled Logs Clear')
        }
        localStorage.setItem('hashlipsMintData', []);
      } else {
        const r = confirm("All Tokens will be cleaered from logs, do you want to proceed?");
        if (r !== true) {
          return alert('Canceled Logs Clear')
        }
        localStorage.setItem('tmt_tokens', []);
      }
    }

    const downloadLogs = () => {
      const tokens = tab === "7" ? localStorage.getItem('hashlipsMintData') : localStorage.getItem('tmt_tokens');
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(tokens);
      const dlAnchorElem = document.getElementById('downloadAnchorElem');
      dlAnchorElem.setAttribute("href", dataStr);
      if (tab === "7") {
        dlAnchorElem.setAttribute("download", "hashlipsMintData_logs.json")
      } else {
        dlAnchorElem.setAttribute("download", "tmt_token_logs.json")
      }
      dlAnchorElem.click();
    }

    
    return( 
      <div>
        <Box md={{ width: '100%', typography: 'body1' }}>
          <TabContext value={tab}>
            <Box lg={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList variant="fullWidth" onChange={handleTabSelection} aria-label="lab API tabs example">
                <Tab label="Create Token" value="1" />
                <Tab label="Sell NFT" value="5" />
                <Tab label="Remove Sale" value="6" />
                <Tab label="Hashlips Minting" value="7" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
                <Grid item md={6}>
                  <Grid item xs={12}>
                    { 
                      token.imageData ? 
                        <img style={{width:'300px'}} src={token.imageData} /> : 
                        <div style={{width: '300px', height: '300px', background: '#1C1C1C'}}> 
                        </div>
                    }
                  </Grid>
                  <Grid item xs={12}>
                      <Button
                        style={{float:"left", width:"300px", margin: "15px 0"}}
                        variant="contained"
                        component="label"
                        >
                          Upload File
                        <input
                          type="file"
                          onChange={(e) => uploadFile(e, token, setToken)}
                          hidden
                        />
                      </Button>
                  </Grid>
                </Grid>
                <Grid item md={6}>
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12}>
                      <TextField         
                          label="Name" 
                          style={{width:'100%'}} 
                          placeholder={"Name"}
                          value={token.name}
                          onInput={ e=>setToken({...token, name: e.target.value})}
                      />
                      <br />
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField    
                          label="Description" 
                          style={{width:'100%'}}      
                          placeholder={"Description"}
                          value={token.description}
                          onInput={ e=>setToken({...token, description: e.target.value})}
                      />
                      <br />
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                          label="Creator" 
                          style={{width:'100%'}}         
                          placeholder={"Creator"}
                          value={token.creator}
                          onInput={ e=>setToken({...token, creator: e.target.value})}
                      />
                      <br />
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                          label="Quantity" 
                          style={{width:'100%'}}
                          placeholder={"Quantity"}
                          type="number"
                          value={token.supply}
                          onInput={ e=>setToken({...token, supply: e.target.value})}
                      />
                      <br />
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                          label="Royalty Fee (%)" 
                          style={{width:'100%'}}
                          placeholder={"Royalty Fee(%)"}
                          type="number"
                          value={token?.royalty}
                          onInput={ e=>setToken({...token, royalty: e.target.value})}
                      />
                      <br />
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel id="tmt-nft-category-selection-label">Category</InputLabel>
                      <Select
                          style={{width:'100%'}}
                          labelId="tmt-nft-category-selection-label"
                          id="tmt-nft-category-selection"
                          value={token.category}
                          label="Category"
                          placeholder={"Category"}
                          onChange={e=>setToken({...token, category: e.target.value})}
                        >
                        <MenuItem value={CategoryNFT.COLLECTIBLE}>Collectible</MenuItem>
                        <MenuItem value={CategoryNFT.ART}>Art</MenuItem>
                        <MenuItem value={CategoryNFT.DIGITAL_ART}>Digital art</MenuItem>
                        <MenuItem value={CategoryNFT.DOCUMENT}>Document</MenuItem>
                        <MenuItem value={CategoryNFT.MUSIC}>Music</MenuItem>
                        <MenuItem value={CategoryNFT.OTHER}>Other</MenuItem>
                      </Select>
                      <br />
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        style={{width:'100%'}}
                        variant="contained"
                        component="label"
                        onClick={() => {xactCreateToken(accountId, xactClient, hederaMainnetEnv, token, setLoading)}}
                        // onClick={() => {xactCreateToken(client,hederaMainnetEnv, token, setLoading)}}
                        disabled={
                          !token?.imageData || 
                          !token?.name || 
                          !token?.description || 
                          !token?.supply || 
                          !token?.royalty || 
                          !token?.category
                        }
                      >
                        Create & Mint
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
                
            </TabPanel>
            <TabPanel value="2">
                <TextField          
                    placeholder={"Token ID"}
                    value={tokenIdInfo}
                    onInput={ e=>setTokenIdInfo(e.target.value)}
                /> 
                <br/>
                <Button
                    variant="contained"
                    component="label"
                    onClick={() => {tokenGetInfo(tokenIdInfo, accountId)}}
                >
                    Get Token Info
                </Button>
            </TabPanel>
            <TabPanel value="4">
              <Paper>
                  <TextField          
                    placeholder={"Token ID"}
                    value={tokenIDQR}
                    onInput={ e=>setTokenIdQR(e.target.value)}
                  /> 
                  <br/>
                  <Button
                    variant="contained"
                    component="label"
                    onClick={() => {associateToken(xactPrivateKey)}}
                  >
                    Associate Token
                  </Button>
              </Paper>
            </TabPanel>
            <TabPanel value="5">
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
                <h1>APLHA: THIS FUCNTION IS UNSTABLE, MIGHT NOT WORK</h1>
                <Grid item md={6}>
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12}>
                      <TextField          
                        style={{width:'100%'}}
                        placeholder={"Token ID"}
                        value={NFTForSale.tokenId}
                        onInput={ e=>setNFTForSale({...NFTForSale, tokenId: e.target.value})}
                      /> 
                    </Grid>
                    <Grid item xs={12}>
                      <TextField          
                        style={{width:'100%'}}
                        placeholder={"NFT ID"}
                        value={NFTForSale.nftId}
                        onInput={ e=>setNFTForSale({...NFTForSale, nftId: e.target.value})}
                      /> 
                    </Grid>
                    <br/>
                    <Grid item xs={12}>
                      <TextField          
                        style={{width:'100%'}}
                        placeholder={"From Account ID"}
                        value={NFTForSale.fromAccountId}
                        onInput={ e=>setNFTForSale({...NFTForSale, fromAccountId: e.target.value})}
                      /> 
                    </Grid>
                    <br/>
                    <Grid item xs={12}>
                      <TextField          
                        style={{width:'100%'}}
                        placeholder={"HBAR Sale Amount"}
                        type="number"
                        value={NFTForSale.hbarAmount}
                        onInput={ e=>setNFTForSale({...NFTForSale, hbarAmount: e.target.value})}
                      /> 
                    </Grid>
                    <br/>
                    <Grid item xs={12}>
                      <TextField          
                        style={{width:'100%'}} 
                        placeholder={"Quantity"}
                        type="number"
                        value={NFTForSale.quantity}
                        onInput={ e=>setNFTForSale({...NFTForSale, quantity: e.target.value})}
                      /> 
                    </Grid>
                    <br/>
                    <Grid item xs={12}>
                      <Button
                        style={{float:"left", width:"100%", margin: "15px 0"}}
                        variant="contained"
                        component="label"
                        onClick={() => {sellNFT(NFTForSale, xactClient)}}
                      >
                          Sell Token
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={6}>
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12}>
                      <TextField
                          style={{float:"right", width:'70%'}}           
                          placeholder={"Token ID"}
                          value={tokenIDQR}
                          onInput={ e=>setTokenIdQR(e.target.value)}
                      /> 
                      <br/>
                      <Button
                          variant="contained"
                          style={{float:"right", width:"70%", margin: "15px 0"}}
                          component="label"
                          onClick={() => {getNFTQRCode(tokenIDQR, xactClient, hederaMainnetEnv)}}
                      >
                        Create QR Code
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="6">
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
                <h1>APLHA: THIS FUCNTION IS UNSTABLE, MIGHT NOT WORK</h1>
                <Grid item xs={12}>
                  <TextField          
                      style={{width:'50%'}}
                      placeholder={"Token ID"}
                      value={tokenIdInfo}
                      onInput={ e=>setTokenIdInfo(e.target.value)}
                  /> 
                </Grid>
                <br/>
                <Grid item xs={12}>
                  <Button
                        style={{width:'50%'}}
                      variant="contained"
                      component="label"
                      onClick={() => {removeNFTFromSale(tokenIdInfo, xactPrivateKey)}}
                  >
                      Remove From Sale
                  </Button>
                </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value="7">
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
                <Grid item md={6}>
                  <Grid item xs={12}>
                    <TextField          
                        style={{width:'100%'}}
                        placeholder={"Previous Token Id"}
                        value={hashlipsToken.previousTokenId}
                        disabled={!alreadyMintedToken}
                        onInput={ e=>setHashlipsToken({...hashlipsToken, previousTokenId: e.target.value})}
                    /> 

                    <Checkbox
                      checked={alreadyMintedToken}
                      onChange={handleAMTChange}
                      disabled={true}
                      inputProps={{ 'aria-label': 'controlled' }}
                    /> I am minting more on a tokenID already created
                    <br />
                    <p>Disabled: Functionality coming soon ^</p>
                    <br />
                    <TextField          
                        style={{width:'100%'}}
                        placeholder={"Token Name"}
                        value={hashlipsToken.name}
                        disabled={alreadyMintedToken}
                        onInput={ e=>setHashlipsToken({...hashlipsToken, name: e.target.value})}
                    /> 
                    <br />
                    <br />
                    <TextField          
                        style={{width:'100%'}}
                        placeholder={"Token Symbol"}
                        value={hashlipsToken.symbol}
                        disabled={alreadyMintedToken}
                        onInput={ e=>setHashlipsToken({...hashlipsToken, symbol: e.target.value})}
                    /> 
                    <br />
                    <br />
                    <TextField          
                        style={{width:'100%'}}
                        placeholder={"Max Supply"}
                        type="number"
                        value={hashlipsToken.maxSupply}
                        disabled={alreadyMintedToken}
                        onInput={ e=>setHashlipsToken({...hashlipsToken, maxSupply: e.target.value})}
                    /> 
                    <br />
                    <br />
                    <TextField          
                        style={{width:'100%'}}
                        type="number"
                        placeholder={"Royalty %"}
                        value={hashlipsToken.royalty}
                        disabled={alreadyMintedToken}
                        onInput={ e=>setHashlipsToken({...hashlipsToken, royalty: e.target.value})}
                    /> 
                    <br />
                    <br />
                    <TextField          
                        style={{width:'100%'}}
                        placeholder={"Treasury Account ID"}
                        value={hashlipsToken.treasuryAccountId}
                        disabled={alreadyMintedToken}
                        onInput={ e=>setHashlipsToken({...hashlipsToken, treasuryAccountId: e.target.value})}
                    /> 
                    <br />
                    <br />
                    <TextField          
                        style={{width:'100%'}}
                        placeholder={"Auto Renew"}
                        value={hashlipsToken.renewAccountId}
                        disabled={alreadyMintedToken}
                        onInput={ e=>setHashlipsToken({...hashlipsToken, renewAccountId: e.target.value})}
                    /> 
                    <br />
                    <br />
                    <span>
                      Select the directory that has all of your hashlips images generated by Hashlips:
                    </span>
                    <br />
                    <input type="file" id="hl-images" webkitdirectory="true" />
                    <br />
                    <br />
                    <span>
                      Select the directory that has all of your JSON files generated by Hashlips:
                    </span>
                    <br />
                    <input type="file" id="hl-json" />
                  </Grid>
                </Grid>
                <br/>
                <Grid item xs={12}>
                  <br/>
                  <br/>
                  <Button
                        style={{width:'50%'}}
                      variant="contained"
                      component="label"
                      onClick={() => {mintHashlips(hashlipsToken, hederaMainnetEnv)}}
                  >
                      Mint Collection
                  </Button>
                </Grid>
                </Grid>
            </TabPanel>
          </TabContext>
        </Box>
        <br />
        <Box>
          {tab === "5" ?  <QRView /> : <></> }
          <a id="downloadAnchorElem" style={{display:"none"}}></a>
            <>
              <Button
                style={{float: 'right', background:'#0f0f0f'}}
                variant="contained"
                component="label"
                onClick={clearLogs}
              >
                Clear Logs
              </Button>
              <Button
                style={{float: 'right', background:'#0f0f0f'}}
                variant="contained"
                component="label"
                onClick={downloadLogs}
              >
                Download Logs
              </Button>
              <TokenView /> 
            </>
        </Box>
      </div>
    );
}