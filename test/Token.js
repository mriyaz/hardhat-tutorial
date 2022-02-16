const { expect } = require("chai");

describe("Token contract", function () {
  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    Token = await ethers.getContractFactory("Token");
    hardhatToken = await Token.deploy();
  });

  describe("Deployment", function () {
    it("should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("should assign the total supply of tokens to the owner", async function () {
      const totalSupply = await hardhatToken.totalSupply();
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(totalSupply);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 100 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, 100);
      // Check that addr1 has 100 tokens
      let addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      // Check that addr1 has 50 tokens
      addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);
      // Check that addr2 has 50 tokens
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // This should fail.
      expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");
    });

    it("Should update balances after transfers", async function () {
      // Transfer 100 tokens from owner to addr1.
      await hardhatToken.transfer(addr1.address, 100);
      // Transfer another 50 tokens from owner to addr2
      await hardhatToken.transfer(addr2.address, 50);

      // Check balances.
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);

      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(999850);
    });
  });
});
