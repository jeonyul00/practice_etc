import {createSlice} from '@reduxjs/toolkit';

interface CounterState {
  valuesssssssss: number;
}

const initialState: CounterState = {
  valuesssssssss: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      state.valuesssssssss += 1;
    },
    decrement: state => {
      state.valuesssssssss -= 1;
    },
    reset: state => {
      state.valuesssssssss = 0;
    },
  },
});

export const {increment, decrement, reset} = counterSlice.actions;
export default counterSlice.reducer;
