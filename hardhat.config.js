require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const INFURA_API_KEY = process.env.INFURA_KEY;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`],
    },
  },
};
