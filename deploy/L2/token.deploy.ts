import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/dist/types';
import {getAddress, getController, getGitHeadCommitHash} from '../helpers';
import {ethers} from 'hardhat';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, execute} = deployments;

  const {deployer} = await getNamedAccounts();

  const token = await deploy('LivepeerToken', {
    from: deployer,
    args: [],
    log: true,
  });

  await deployments.save('L2_LPT', token);

  const minter = await getAddress(ethers.provider, 'Minter', 'L2');

  await execute(
      'L2_LPT',
      {from: deployer, log: true},
      'grantRole',
      ethers.utils.solidityKeccak256(['string'], ['MINTER_ROLE']),
      minter,
  );

  const signer = await ethers.getSigners();

  const controller = await getController(signer[0], 'L2');
  await controller.setContractInfo(
      ethers.utils.solidityKeccak256(['string'], ['LivepeerToken']),
      token.address,
      await getGitHeadCommitHash(),
  );
};

func.tags = ['L2_LPT'];
export default func;
