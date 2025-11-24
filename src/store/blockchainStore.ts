import { create } from "zustand";
import { Blockchain } from "@/lib/blockchain/Blockchain";
import { Transaction } from "@/lib/blockchain/Transaction";
import { Block } from "@/lib/blockchain/Block";
import { Wallet } from "@/lib/wallet/Wallet";

interface BlockchainState {
  blockchain: Blockchain;
  loading: boolean;
  error: string | null;
  updateTrigger: number;
  mine: (minerAddress: string) => Promise<Block>;
  addTransaction: (tx: Transaction) => void;
  createWallet: () => {
    address: string;
    publicKey: string;
    privateKey: string;
  };
  getBalance: (address: string) => number;
  getTransactions: (address: string) => Transaction[];
  getStats: () => {
    blockCount: number;
    difficulty: number;
    pendingTransactions: number;
    miningReward: number;
    isValid: boolean;
  };
  getPendingTransactions: () => Transaction[];
  validateChain: () => boolean;
  reset: () => void;
}

const initializeBlockchain = (): Blockchain => {
  const blockchain = new Blockchain();
  const wallet1 = new Wallet();
  const wallet2 = new Wallet();
  const wallet3 = new Wallet();

  blockchain.minePendingTransactions(wallet1.getAddress());

  const tx1 = new Transaction(wallet1.getAddress(), wallet2.getAddress(), 30);
  tx1.signTransaction(wallet1.getKeyPair());
  blockchain.addTransaction(tx1);
  blockchain.minePendingTransactions(wallet2.getAddress());

  const tx2 = new Transaction(wallet2.getAddress(), wallet3.getAddress(), 20);
  tx2.signTransaction(wallet2.getKeyPair());
  blockchain.addTransaction(tx2);
  blockchain.minePendingTransactions(wallet3.getAddress());

  return blockchain;
};

export const useBlockchainStore = create<BlockchainState>()((set, get) => ({
  blockchain: initializeBlockchain(),
  loading: false,
  error: null,
  updateTrigger: 0,

  mine: async (minerAddress: string) => {
    set({ loading: true, error: null });
    try {
      const state = get();
      const block = state.blockchain.minePendingTransactions(minerAddress);
      set({
        blockchain: state.blockchain,
        loading: false,
        updateTrigger: state.updateTrigger + 1,
      });
      return block;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  addTransaction: (tx: Transaction) => {
    try {
      const state = get();
      state.blockchain.addTransaction(tx);
      set({
        blockchain: state.blockchain,
        error: null,
        updateTrigger: state.updateTrigger + 1,
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  createWallet: () => {
    const wallet = new Wallet();
    return wallet.export();
  },

  getBalance: (address: string) => {
    const { blockchain } = get();
    return blockchain.getBalanceOfAddress(address);
  },

  getTransactions: (address: string) => {
    const { blockchain } = get();
    return blockchain.getAllTransactionsForAddress(address);
  },

  getStats: () => {
    const { blockchain } = get();
    return blockchain.getStats();
  },

  getPendingTransactions: () => {
    const { blockchain } = get();
    return blockchain.pendingTransactions;
  },

  validateChain: () => {
    const { blockchain } = get();
    return blockchain.isChainValid();
  },

  reset: () => {
    set({ blockchain: initializeBlockchain(), error: null });
  },
}));
