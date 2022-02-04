import { useState, useEffect } from "react";
import Button from "../components/Button";
import CurrencyButton from "../components/CurrencyBtn";
import MainCard from "../components/MainCard";
import LiquidityInput from "../components/LiquidityInput";
import Link from "next/link";

import { ethers } from "ethers";
import Registry from "../contracts/Registry.json"
import Exchange from "../contracts/Exchange.json"
import Erc20 from "../contracts/Erc20.json"
import { useEthers } from "../context/EthersContext";

import dynamic from 'next/dynamic'

const Modal = dynamic(
  () => import('../components/Modal'),
  { ssr: false }
)

const registryAddress = "0xDEa3108cdeeC65712606bc692A173A983435223e"

export default function Liquidity() {

  const [tokenModalOpen, setTokenModalOpen] = useState(false)
  const [pool, setPool] = useState({ address: null, symbol: "Select a currency" }) // token
  const [tokenAmount, setTokenAmount] = useState("")
  const [bnbAmount, setBnbAmount] = useState("")
  const [lpAmount, setLpAmount] = useState("")
  const [liquidityRate, setLiquidityRate] = useState(0) // 0 = no existing pool
  const [poolAddress, setPoolAddress] = useState() // exchange
  const [loading, setLoading] = useState(false)

  const { account, isValidChain, requestAccount, setNotificationStatus } = useEthers()

  const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");

  useEffect(async () => {
    if (!pool.address)
      return

    const registry = new ethers.Contract(registryAddress, Registry.abi, provider)
    let exchangeAddress
    try {
      exchangeAddress = await registry.getExchange(pool.address)
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

  async function addLpTokenToMetamask(lpAddress) {
    const tokenAddress = lpAddress;
    const tokenSymbol = `LP${pool.symbol}`;
    const tokenDecimals = 18;
    // const tokenImage = 'http://placekitten.com/200/300';

    try {
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            // image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log('LP token added to your wallet');
      } else {
        console.log('Could not add LP token to your wallet');
      }
    } catch (e) {
      console.log(e);
    }
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
      addLpTokenToMetamask(exchangeAddress)
      setTokenAmount(0)
      setBnbAmount(0)
      setNotificationStatus({ show: true, error: false })
    } catch (e) {
      console.log(e)
      setNotificationStatus({ show: true, error: true })
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
      setNotificationStatus({ show: true, error: false })
    } catch(e) {
      console.log(e);
      setNotificationStatus({ show: true, error: true })
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

        <div>
          <LiquidityInput onChange={handleTokenInput} value={tokenAmount} tokenAddress={pool.address}>{pool.symbol}</LiquidityInput>
          <LiquidityInput disabled={poolAddress > 0} onChange={handleBnbInput} value={bnbAmount} tokenAddress={0}>BNB</LiquidityInput>
          {poolAddress && poolAddress != 0 ?
            <Button loading={loading} disabled={checkLiquidityEnabled()} onClick={() => addLiquidity(false)}>Add liquidity</Button>
            :
            <Button loading={loading} onClick={() => addLiquidity(true)} disabled={checkLiquidityEnabled()}>Create pool</Button>
          }
        </div>

        <div>
          <LiquidityInput onChange={handleLpInput} value={lpAmount} disabled={!poolAddress || poolAddress == 0} tokenAddress={poolAddress}>LP tokens</LiquidityInput>
          <Button loading={loading} disabled={!poolAddress || lpAmount == "" || loading} onClick={removeLiquidity}>Remove liquidity</Button>
        </div>
      </MainCard>

      <Link className="absolute bottom-0 left-0" href="/get-token">
        <span className='hidden md:block cursor-pointer absolute bottom-4 left-4 text-purple-800 underline underline-offset-1 text-sm'>
          Get DAI/BUSD/BNB to test the AMM
        </span>
      </Link>

      <Modal open={tokenModalOpen} setOpen={setTokenModalOpen} setSelectedToken={setPool} liquidity />
    </>
  )

}