import React,{ useEffect, useState} from "react";
import Dropbox from "../contracts/Dropbox.json";
import getWeb3 from "../getWeb3";
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

const App=()=>{

  const [contract, setConract] = useState(undefined)
  //const [web3, setWeb3] = useState(undefined)
  const [address, setAddress] = useState('')
  const [fileCount, setFileCount] = useState(0)
  const [files, setFile] = useState([])
  //const [buffer, setBuffer] = useState(undefined)
  const [type, setType] = useState(undefined)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [captureFile, setCaptureFile] = useState()

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3()
      //setWeb3(web3)
      const networkId = await web3.eth.net.getId()
      const addresses = await web3.eth.getAccounts();
      setAddress(addresses[0])
      const deployedNetwork = Dropbox.networks[networkId]
      const instance = new web3.eth.Contract(
        Dropbox.abi,
        deployedNetwork.address,
      )
      setConract(instance)

      const fc = await instance.methods.fileCount().call();
      setFileCount(fc);


      for (var i = fileCount; i >= 1; i--) {
        const file = await instance.methods.files(i).call()
        setFile([...files, file]);
      }
    }
    init()
  },[])

  const captureFile=e=>{
    e.preventDefault();

    const file = e.target.file[0];
    const reader = new window.FileReader();

    reader.readAsArrayBuffer(file);
    reader.onloadend = () =>{
      setBuffer(Buffer(reader.result))
      setType(file.type)
      setFileName(file.name)
    }
  }

  const uploadFile = desc =>{
    console.log('submitting file to IPFS...')
    ipfs.add(this.state.buffer, (error, result) => {
    if(error) {
      console.error(error)
      return
    }
    setLoading(true)
    if(type == ''){
      setType('none')
    }
      contract.methds.uploadFile(result[0].hash, result[0].size, type, fileName,  desc).send({
      from: address
    }).on('transactionHash',(hash)=>{
      setLoading(false)
        setType(null)
        setFileName(null)
      window.location.reload()
    }
    ).on('error',e=>{
      window.alert('Error')
      setLoading(false)
    })
    })
  }

  return(
    <div>
      <Navbar account={address} />
      { loading
        ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
        : <Main
          files={files}
          captureFile={captureFile}
          uploadFile={uploadFile}
        />
      }
    </div>
  )
}

export default App;
