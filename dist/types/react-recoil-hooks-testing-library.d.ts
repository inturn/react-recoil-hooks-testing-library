import { act, cleanup } from '@testing-library/react-hooks';
import React from 'react';
import { RecoilState } from 'recoil';
interface MockRecoilState {
    recoilState: RecoilState<any>;
    initialValue: any;
}
interface RenderHookOptions {
    states?: MockRecoilState[];
    wrapper?: React.FunctionComponent<any>;
}
declare function renderRecoilHook<P, R>(callback: (props: P) => R, options?: RenderHookOptions & {
    initialProps?: P;
    wrapper?: React.ComponentType<P> | React.ComponentType;
}): {
    readonly result: {
        readonly current: R;
        readonly error: Error;
    };
    readonly waitForNextUpdate: () => Promise<void>;
    readonly unmount: () => boolean;
    readonly rerender: (hookProps?: P) => void;
};
export { renderRecoilHook, act, cleanup };
