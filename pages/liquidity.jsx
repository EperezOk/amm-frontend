import { useState, useEffect } from "react";
import Button from "../components/Button";
import CurrencyButton from "../components/CurrencyBtn";
import MainCard from "../components/MainCard";
import Modal from "../components/Modal";
import LiquidityInput from "../components/LiquidityInput";

import { ethers } from "ethers";
import Registry from "../contracts/Registry.json"
import Exchange from "../contracts/Exchange.json"
const registryAddress = "0x00331B1a597F4CC93343dD7358C7154F3304fBd4"

export default function Liquidity() {

  const [tokenModalOpen, setTokenModalOpen] = useState(false)
  const [pool, setPool] = useState({ address: null, symbol: "Select a currency" })
  const [tokenAmount, setTokenAmount] = useState("")
  const [bnbAmount, setBnbAmount] = useState("")
  const [liquidityRate, setLiquidityRate] = useState(0) // 0 = no existing pool
  const [poolAddress, setPoolAddress] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(async () => {
    if (!pool.address)
      return

    const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
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
      console.log(`Rate is ${rate}`)
      setLiquidityRate(rate)
    } catch (e) {
      console.log(e)
    }
  }, [pool])

  useEffect(() => {
    liquidityRate !== 0 && setBnbAmount(tokenAmount / liquidityRate)
  }, [tokenAmount])

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

  async function createPool() {
    if (typeof window.ethereum === 'undefined') {
      console.log("Connect your wallet to create a pool")
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setLoading(true)
    const exchange = new ethers.Contract(poolAddress, Exchange.abi, provider.getSigner())
    try {
      // TODO: require connected wallet - useContext()!

      // TODO: create Exchange

      // TODO: make approve

      const token = ethers.utils.parseEther(tokenAmount)
      const bnb = ethers.utils.parseEther(bnbAmount)
      await exchange.addLiquidity(token, { value: bnb })
      console.log(`Liquidity added successfully`)
      setTokenAmount(0)
      setBnbAmount(0)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  function checkCreatePoolEnabled() {
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
          <LiquidityInput disabled={liquidityRate !== 0} onChange={handleBnbInput} value={bnbAmount}>BNB</LiquidityInput>
          {liquidityRate !== 0 ?
            <Button disabled={loading}>Add liquidity</Button>
            :
            <Button onClick={createPool} disabled={checkCreatePoolEnabled()}>Create pool</Button>
          }
        </div>

        <LiquidityInput disabled={liquidityRate === 0}>LP tokens</LiquidityInput>
        <Button disabled={liquidityRate === 0}>Remove liquidity</Button>
      </MainCard>

      <Modal open={tokenModalOpen} setOpen={setTokenModalOpen} setSelectedToken={setPool} liquidity />
    </>
  )

}