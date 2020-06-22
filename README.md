# react-recoil-hooks-testing-library

Simple and complete React hooks testing utilities that encourage good testing practices... with Recoil!

Takes the api of [@testing-library/react-hooks](https://github.com/testing-library/react-hooks-testing-library) and adds a `<RecoilRoot/>` component as a wrapper and lets you switch up existing state defaults by passing in a new `states` array to the options object.

## Example

```typescript
// count.ts
export const countState = atom({
  key: 'count',
  default: 0,
});

export const useRecoilCounter = (initialProps: string) => {
  const [count, setCount] = useRecoilState(countState);

  const increment = () => {
    setCount(count => count + 1);
  };

  return { increment, count };
};

// count.test.ts
import { act, renderRecoilHook } from 'react-recoil-hooks-testing-library';
import { countState, useRecoilCounter } from './count';

describe('useRecoilCounter', () => {
  it('returns the default count value', () => {
    const { result } = renderRecoilHook(useRecoilTestHook);
    expect(result.current.count).toBe(0);
  });

  it('updates the counter when increment is called', () => {
    const { result } = renderRecoilHook(useRecoilTestHook);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('returns updated default atom state', () => {
    const { result } = renderRecoilHook(useRecoilTestHook, {
      states: [{ recoilState: countState, initialValue: 42 }],
    });

    expect(result.current.count).toBe(42);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(43);
  });
});
```

## API

This library exposes all of the same api surfaces as the hooks testing library. The only difference is `renderHook` is renamed to `renderRecoilHook` for clarity and a new option, `states`, has been added.
See the [offical api docs](https://react-hooks-testing-library.com/reference/api) for a full explanation of the api

## `renderRecoilHook`

```
function renderRecoilHook(
  callback: function(props?: any): any,
  options?: RenderHookOptions
): RenderHookResult
```

### `renderRecoilHook Options`

##### `states`

```
states?: { recoilState: RecoilState, initialValue: RecoilValue<any> }[]
```

An array of state objects that can be used to override the default state of an atom or selector. This can be useful when testing hooks that use derived state from another source and that state value needs to be mocked.

##### `initialProps`

The initial values to pass as props to the callback function of renderRecoilHook.

##### `wrapper`

A React component to wrap the test component in when rendering. This is usually used to add context providers from React.createContext for the hook to access with useContext. initialProps and props subsequently set by rerender will be provided to the wrapper.

**Note**: `<RecoilRoot />` is the top level component, and anything passed to `wrapper` will be a child of it.
