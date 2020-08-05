import { act, cleanup, renderHook } from '@testing-library/react-hooks';
import React, { useEffect } from 'react';
import { RecoilRoot, RecoilState, useSetRecoilState } from 'recoil';

interface MockRecoilState {
  recoilState: RecoilState<any>;
  initialValue: any;
}

interface RenderHookOptions {
  states?: MockRecoilState[];
  wrapper?: React.ComponentType<any>;
}

function recoilStateWrapper(options?: RenderHookOptions) {
  const StateComponent: React.FC<MockRecoilState> = (
    props: MockRecoilState,
  ) => {
    const setState = useSetRecoilState(props.recoilState);
    useEffect(() => {
      setState(props.initialValue);
    }, []);

    return null;
  };

  const renderStateComponents = () => {
    return options?.states?.map(state => (
      <StateComponent key={state.recoilState.key} {...state} />
    ));
  };

  const Wrapper: React.FC = props => {
    const renderChildren = options?.wrapper ? (
      <options.wrapper {...props} />
    ) : (
      props.children
    );

    return (
      <RecoilRoot>
        {renderStateComponents()}
        {renderChildren}
      </RecoilRoot>
    );
  };
  return Wrapper;
}

function renderRecoilHook<P, R>(
  callback: (props: P) => R,
  options?: RenderHookOptions & {
    initialProps?: P;
    wrapper?: React.ComponentType<any>;
  },
): {
  readonly result: {
    readonly current: R;
    readonly error: Error;
  };
  readonly waitForNextUpdate: () => Promise<void>;
  readonly unmount: () => boolean;
  readonly rerender: (hookProps?: P) => void;
} {
  return renderHook(callback, {
    ...options,
    wrapper: recoilStateWrapper({
      states: options?.states,
      wrapper: options?.wrapper,
    }),
  });
}

export { renderRecoilHook, act, cleanup };
