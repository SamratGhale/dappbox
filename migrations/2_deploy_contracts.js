var Dropbox= artifacts.require("./Dropbox.sol");

module.exports = function(deployer) {
  deployer.deploy(Dropbox);
};
