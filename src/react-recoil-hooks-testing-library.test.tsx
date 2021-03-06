import React, { useContext } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import { act, renderRecoilHook } from './react-recoil-hooks-testing-library';

const atomA = atom({
  key: 'setMockRecoilState__a',
  default: 0,
});

const atomB = atom({
  key: 'setMockRecoilState__b',
  default: 'test',
});

const useRecoilTestHook = (initialProps: string) => {
  const [valueA, setValueA] = useRecoilState(atomA);
  const [valueB, setValueB] = useRecoilState(atomB);

  const update = () => {
    setValueA(123);
    setValueB('Wow!');
  };

  return { update, valueA, valueB, initialProps };
};

describe('react-recoil-hooks-testing-library', () => {
  it('reads default values and updates values', () => {
    const { result } = renderRecoilHook(useRecoilTestHook);

    expect(result.current.valueA).toBe(0);
    expect(result.current.valueB).toBe('test');

    act(() => {
      result.current.update();
    });

    expect(result.current.valueA).toBe(123);
    expect(result.current.valueB).toBe('Wow!');
  });

  it('gets state set from options', () => {
    const { result } = renderRecoilHook(useRecoilTestHook, {
      states: [
        { recoilState: atomA, initialValue: 42 },
        { recoilState: atomB, initialValue: 'Calculated' },
      ],
    });

    expect(result.current.valueA).toBe(42);
    expect(result.current.valueB).toBe('Calculated');

    act(() => {
      result.current.update();
    });

    expect(result.current.valueA).toBe(123);
    expect(result.current.valueB).toBe('Wow!');
  });

  it('sets initialProps', () => {
    const { result } = renderRecoilHook(useRecoilTestHook, {
      initialProps: 'initialProps',
    });

    expect(result.current.initialProps).toBe('initialProps');
  });

  it('sets wrapper', () => {
    const MockContext = React.createContext('');

    const useRecoilTestHookWithContext = () => {
      const valueA = useRecoilValue(atomA);
      const contextValue = useContext(MockContext);

      return { valueA, contextValue };
    };

    const { result } = renderRecoilHook(useRecoilTestHookWithContext, {
      wrapper: ({ children }) => (
        <MockContext.Provider value="context!">{children}</MockContext.Provider>
      ),
      states: [{ recoilState: atomA, initialValue: 9 }],
    });

    expect(result.current.contextValue).toBe('context!');
    expect(result.current.valueA).toBe(9);
  });

  it('sets initialProps with wrapper', () => {
    const MockContext = React.createContext('');

    const useRecoilTestHookWithContext = () => {
      const valueA = useRecoilValue(atomA);
      const contextValue = useContext(MockContext);

      return { valueA, contextValue };
    };

    const WrapperWithProviderValue: React.FC<{
      providerValue: string;
    }> = ({ children, providerValue }) => (
      <MockContext.Provider value={providerValue}>
        {children}
      </MockContext.Provider>
    );
    const { result } = renderRecoilHook(useRecoilTestHookWithContext, {
      wrapper: WrapperWithProviderValue,
      states: [{ recoilState: atomA, initialValue: 123 }],
      initialProps: {
        providerValue: 'context!',
      },
    });

    expect(result.current.contextValue).toBe('context!');
    expect(result.current.valueA).toBe(123);
  });

  it('updates wrapper props on rerender', () => {
    const MockContext = React.createContext('');

    const useRecoilTestHookWithContext = () => {
      const valueA = useRecoilValue(atomA);
      const contextValue = useContext(MockContext);

      return { valueA, contextValue };
    };

    const WrapperWithProviderValue: React.FC<{
      providerValue: string;
    }> = ({ children, providerValue }) => (
      <MockContext.Provider value={providerValue}>
        {children}
      </MockContext.Provider>
    );
    const { result, rerender } = renderRecoilHook(
      useRecoilTestHookWithContext,
      {
        wrapper: WrapperWithProviderValue,
        states: [{ recoilState: atomA, initialValue: 123 }],
        initialProps: {
          providerValue: 'context 1',
        },
      },
    );

    expect(result.current.contextValue).toBe('context 1');
    expect(result.current.valueA).toBe(123);

    rerender({
      providerValue: 'context 2',
    });

    expect(result.current.contextValue).toBe('context 2');
    expect(result.current.valueA).toBe(123);
  });
});
