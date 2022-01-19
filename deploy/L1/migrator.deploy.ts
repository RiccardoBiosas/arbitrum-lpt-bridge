import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/dist/types';
import {ARBITRUM_NETWORK} from '../constants';
import {ethers} from 'hardhat';
import {getAddress} from '../helpers';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, execute} = deployments;

  const {deployer} = await getNamedAccounts();

  const bondingManager = await getAddress(
      ethers.provider,
      'BondingManager',
      'L1',
  );
  const ticketBroker = await getAddress(ethers.provider, 'TicketBroker', 'L1');
  const minter = await getAddress(ethers.provider, 'Minter', 'L1');
  // TODO - fetch hardcoded values from controller instead

  const l2Migrator = await hre.companionNetworks['l2'].deployments.get(
      'L2Migrator',
  );
  const l1LPTgateway = await deployments.get('L1LPTGateway');

  await deploy('L1Migrator', {
    from: deployer,
    args: [
      ARBITRUM_NETWORK.rinkeby.inbox,
      bondingManager,
      ticketBroker,
      minter,
      l1LPTgateway.address,
      l2Migrator.address,
    ],
    log: true,
  });

  await execute(
      'L1Migrator',
      {from: deployer, log: true},
      'grantRole',
      ethers.utils.solidityKeccak256(['string'], ['GOVERNOR_ROLE']),
      deployer,
  );
};

func.tags = ['L1_MIGRATOR'];
export default func;
