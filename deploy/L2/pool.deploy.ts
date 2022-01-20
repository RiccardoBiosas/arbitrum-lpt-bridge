import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/dist/types';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('DelegatorPool', {
    from: deployer,
    args: [],
    log: true,
  });
};

func.tags = ['L2_DELEGATOR_POOL'];
export default func;
