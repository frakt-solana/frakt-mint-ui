import { produce } from 'immer';
import { useState } from 'react';
import create from 'zustand';

type UseLoadingModal = () => {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export const useLoadingModal: UseLoadingModal = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  return {
    visible,
    open,
    close,
  };
};

export type TxsLoadingModalState = {
  visible: boolean;
  amountOfTxs: number;
  currentTxNumber: number;
  textStatus: string;
  isConfirmedTxns?: boolean;
};

interface LoadingModalState {
  visible: boolean;
  amountOfTxs: number;
  currentTxNumber: number;
  textStatus: string;
  setVisible: (value: boolean) => void;
  setState: (nextState: TxsLoadingModalState) => void;
  clearState: () => void;
}

export const useLoadingModalState = create<LoadingModalState>((set) => ({
  visible: false,
  amountOfTxs: 0,
  currentTxNumber: 0,
  textStatus: '',
  setVisible: (visible) =>
    set(
      produce((state: LoadingModalState) => {
        state.visible = visible;
      }),
    ),

  setState: ({ visible, amountOfTxs, currentTxNumber, textStatus }) =>
    set(
      produce((state: LoadingModalState) => {
        state.visible = visible;
        state.amountOfTxs = amountOfTxs;
        state.currentTxNumber = currentTxNumber;
        state.textStatus = textStatus;
      }),
    ),
  clearState: () =>
    set(
      produce((state: LoadingModalState) => {
        state.visible = false;
        state.amountOfTxs = 0;
        state.currentTxNumber = 0;
        state.textStatus = '';
      }),
    ),
}));
