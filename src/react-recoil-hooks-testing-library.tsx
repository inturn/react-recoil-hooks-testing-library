import { act, cleanup, renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { RecoilRoot, RecoilState } from 'recoil';

interface MockRecoilState {
  recoilState: RecoilState<any>;
  initialValue: any;
}

interface RenderHookOptions {
  states?: MockRecoilState[];
  wrapper?: React.FunctionComponent<any>;
}

function recoilStateWrapper(options?: RenderHookOptions) {
  return (props: { children?: React.ReactNode }) => {
    const renderChildren = options?.wrapper ? (
      <options.wrapper {...props} />
    ) : (
      props.children
    );

    return (
      <RecoilRoot
        initializeState={({ set }) => {
          options?.states?.forEach(({ recoilState, initialValue }) => {
            set(recoilState, initialValue);
          });
        }}
      >
        {renderChildren}
      </RecoilRoot>
    );
  };
}

function renderRecoilHook<P, R>(
  callback: (props: P) => R,
  options?: RenderHookOptions & {
    initialProps?: P;
    wrapper?: React.ComponentType<P> | React.ComponentType;
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
