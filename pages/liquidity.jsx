import { useState, useEffect } from "react";
import Button from "../components/Button";
import CurrencyButton from "../components/CurrencyBtn";
import MainCard from "../components/MainCard";
import Modal from "../components/Modal";
import LiquidityInput from "../components/LiquidityInput";

import { ethers } from "ethers";
import Registry from "../contracts/Registry.json"
import Exchange from "../contracts/Exchange.json"
import Erc20 from "../contracts/Erc20.json"
import { useEthers } from "../context/EthersContext";

const registryAddress = "0xDEa3108cdeeC65712606bc692A173A983435223e"

export default function Liquidity() {

  const [tokenModalOpen, setTokenModalOpen] = useState(false)
  const [pool, setPool] = useState({ address: null, symbol: "Select a currency" }) // token
  const [tokenAmount, setTokenAmount] = useState("")
  const [bnbAmount, setBnbAmount] = useState("")
  const [lpAmount, setLpAmount] = useState("")
  const [liquidityRate, setLiquidityRate] = useState(0) // 0 = no existing pool
  const [poolAddress, setPoolAddress] = useState(0) // exchange
  const [loading, setLoading] = useState(false)

  const { account, isValidChain, requestAccount } = useEthers()

  const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");

  useEffect(async () => {
    if (!pool.address)
      return

    const registry = new ethers.Contract(registryAddress, Registry.abi, provider)
    let exchangeAddress
    try {
      exchangeAddress = await registry.getExchange(pool.address)
      console.log(`Exchange for ${pool.symbol}: ${exchangeAddress}`)
      setPoolAddress(exchangeAddress)
    } catch (e) {
      console.log(e)
    }
    if (exchangeAddress == 0) {
      setLiquidityRate(0)
      return
    }

    const exchange = new ethers.Contract(exchangeAddress, Exchange.abi, provider)
    try {
      const rate = ethers.utils.formatUnits(await exchange.addLiquidityRate())
      setLiquidityRate(rate)
    } catch (e) {
      console.log(e)
    }
  }, [pool])

  useEffect(() => {
    liquidityRate !== 0 && setBnbAmount((tokenAmount / liquidityRate).toString())
  }, [tokenAmount])

  async function refreshRate() {
    const exchange = new ethers.Contract(poolAddress, Exchange.abi, provider)
    try {
      const rate = ethers.utils.formatUnits(await exchange.addLiquidityRate())
      setLiquidityRate(rate)
    } catch (e) {
      console.log(e)
    }
  }

  function isValidInput(input) {
    const regex = /^[0-9\b,.]+$/
    return input === '' || regex.test(input)
  }

  function handleTokenInput(e) {
    isValidInput(e.target.value) && setTokenAmount(e.target.value)
  }

  function handleBnbInput(e) {
    isValidInput(e.target.value) && setBnbAmount(e.target.value)
  }

  function handleLpInput(e) {
    isValidInput(e.target.value) && setLpAmount(e.target.value)
  }

  async function addLiquidity(createPool) {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    setLoading(true)
    try {
      if (!account || !isValidChain())
        requestAccount()

      let exchangeAddress, tx

      if (createPool) {
        const registry = new ethers.Contract(registryAddress, Registry.abi, signer)
        tx = await registry.createExchange(pool.address)
        await tx.wait()
        exchangeAddress = await registry.getExchange(pool.address)
      } else {
        exchangeAddress = poolAddress
      }

      const tokenAmt = ethers.utils.parseEther(tokenAmount)
      const bnbAmt = ethers.utils.parseEther(bnbAmount)

      const token = new ethers.Contract(pool.address, Erc20.abi, signer)
      tx = await token.approve(exchangeAddress, tokenAmt)
      await tx.wait()

      const exchange = new ethers.Contract(exchangeAddress, Exchange.abi, signer)
      await exchange.addLiquidity(tokenAmt, { value: bnbAmt })
      setTokenAmount(0)
      setBnbAmount(0)
    } catch (e) {
      console.log(e)
    }
    refreshRate()
    setLoading(false)
  }

  async function removeLiquidity() {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    setLoading(true)
    try {
      if (!account || !isValidChain())
        requestAccount()

      const lps = ethers.utils.parseEther(lpAmount)
      const exchange = new ethers.Contract(poolAddress, Exchange.abi, signer)
      await exchange.removeLiquidity(lps)
      setLpAmount(0)
    } catch(e) {
      console.log(e);
    }
    setLoading(false)
  }

  function checkLiquidityEnabled() {
    return loading || !pool.address || tokenAmount === "" || bnbAmount === ""
  }

  return (
    <>
      <MainCard title="Liquidity" description="Add or remove liquidity from a pool">
        <div className="flex justify-between w-full">
          <span className="text-purple-700 font-semibold">Pool</span>
          <CurrencyButton tokenName={pool.symbol} setTokenModalOpen={setTokenModalOpen} />
        </div>

        <div className="mb-4 mt-2 space-y-4">
          <LiquidityInput onChange={handleTokenInput} value={tokenAmount}>{pool.symbol}</LiquidityInput>
          <LiquidityInput disabled={poolAddress != 0} onChange={handleBnbInput} value={bnbAmount}>BNB</LiquidityInput>
          {poolAddress != 0 ?
            <Button disabled={checkLiquidityEnabled()} onClick={() => addLiquidity(false)}>Add liquidity</Button>
            :
            <Button onClick={() => addLiquidity(true)} disabled={checkLiquidityEnabled()}>Create pool</Button>
          }
        </div>

        <LiquidityInput onChange={handleLpInput} value={lpAmount} disabled={poolAddress == 0}>LP tokens</LiquidityInput>
        <Button disabled={poolAddress == 0 || lpAmount == "" || loading} onClick={removeLiquidity}>Remove liquidity</Button>
      </MainCard>

      <Modal open={tokenModalOpen} setOpen={setTokenModalOpen} setSelectedToken={setPool} liquidity />
    </>
  )

}