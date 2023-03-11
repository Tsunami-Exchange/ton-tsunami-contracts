import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { VaultWallet } from '../wrappers/VaultWallet';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('VaultWallet', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('VaultWallet');
    });

    let blockchain: Blockchain;
    let vaultWallet: SandboxContract<VaultWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        vaultWallet = blockchain.openContract(
            VaultWallet.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await vaultWallet.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: vaultWallet.address,
            deploy: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and vaultWallet are ready to use
    });

    it('should increase counter', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await vaultWallet.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = Math.floor(Math.random() * 100);

            console.log('increasing by', increaseBy);

            const increaseResult = await vaultWallet.sendIncrease(increaser.getSender(), {
                increaseBy,
                value: toNano('0.05'),
            });

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: vaultWallet.address,
                success: true,
            });

            const counterAfter = await vaultWallet.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });
});
