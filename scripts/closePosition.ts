import { Address, toNano } from 'ton-core';
import { NetworkProvider } from '@ton-community/blueprint';
import { Router } from '../wrappers/Router/Router';
import { TraderPositionWallet } from '../wrappers/PositionWallet';
import { Vamm } from '../wrappers/Vamm';

export async function run(provider: NetworkProvider) {
  const vammAddress = Address.parse('EQBfaXnAF14tqb3WJdbjlSNhb5Z0qkxUzEyLKiioRrBimi2s');
  const openedVamm = provider.open(Vamm.createFromAddress(vammAddress));

  const tpwAddress = await openedVamm.getTraderPositionAddress(provider.sender().address!);
  const tpw = TraderPositionWallet.createFromAddress(tpwAddress);
  const openedTPW = provider.open(tpw);

  const data = await openedTPW.getPositionData();

  console.log('positionData', data);

  await openedVamm.sendClosePosition(provider.sender(), {
    value: toNano('0.3'),
    size: data.positionData.size,
    minQuoteAssetAmount: 0n,
    addToMargin: false,
  });
}
