import { Handler } from '@netlify/functions'
import axios from 'axios'
import redis from '../libs/redis'

const handler: Handler = async event => {
  const { code, wallet } = JSON.parse(event.body)
  const discordToken = event.headers.authorization.split(' ')[1]
  const part = event.headers.cookie.split('twitter_token=')
  if (part.length < 2) {
    return {
      statusCode: 401,
      body: 'Missing twitter token',
    }
  }
  const access_token_key = event.headers.cookie.split('twitter_token=')[1].split(';')[0]
  const access_token_secret = await redis.get(access_token_key)
  try {
    const res = await axios.post(
      'https://api-testnet.otterclam.finance/giveaway/wallets',
      {
        code,
        wallet,
      },
      {
        headers: {
          cookie: 'discord_token=' + discordToken,
          'X-DISCORD-ACCESS-TOKEN': discordToken,
          'X-TWITTER-ACCESS-TOKEN-KEY': access_token_key,
          'X-TWITTER-ACCESS-TOKEN-SECRET': access_token_secret,
        },
      }
    )
    return {
      statusCode: 200,
      body: JSON.stringify(res.data),
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
    return {
      statusCode: 400,
      body: JSON.stringify(error.message),
    }
  }
}

export { handler }
