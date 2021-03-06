// tslint:disable max-classes-per-file

import * as React from 'react';
import { fromJS } from 'immutable';
import StoreProvider from "../../StoreProvider";
import { Provider } from "react-redux";
import withReducer from "../../withReducer";
import { mount } from "enzyme";
import { Store, IReduxicleConfig } from '../../types';

describe("withReducer", () => {
  interface ISetup { key: string; reducerState: any; config?: IReduxicleConfig; }
  const setup = ({ key, reducerState, config }: ISetup) => {
    class UnwrapepdComponent extends React.PureComponent {
      public render() {
        return <div>my content</div>;
      }
    }

    const fakeReducer = (state = {}, action: { type: string }) => {
      if (action.type === "FAKE_ACTION") {
        return reducerState;
      }

      return state;
    };

    const WrappedComponent = withReducer({ key, reducer: fakeReducer })(UnwrapepdComponent);
    expect(WrappedComponent.key).toEqual(key);

    const wrapper = mount(<StoreProvider config={config}><WrappedComponent /></StoreProvider>);
    const store = wrapper.find(Provider).prop("store") as Store;
    store.dispatch({ type: "FAKE_ACTION" });
    return { store };
  };

  // it("should inject the reducer", () => {
  //   const key = "myReducerKey";
  //   const state = { fakeResult: 23 };
  //   const { store } = setup({ key, reducerState: state });
  //   store.dispatch({ type: "FAKE_ACTION" });
  //   expect(store.getState()).toEqual({
  //     [key]: state,
  //   });
  // });

  it("should inject the reducer using a complex key", () => {
    const key = "myDomain.myReducerKey";
    const state = { fakeResult: 23 };
    const { store } = setup({ key, reducerState: state });
    store.dispatch({ type: "FAKE_ACTION" });
    expect(store.getState()).toEqual({
      myDomain: {
        myReducerKey: state,
      },
    });
  });

  it("should inject the reducer using immutable", () => {
    const key = "myReducerKey";
    const state = fromJS({ fakeResult: 23 });
    const { store } = setup({ key, reducerState: state, config: { useImmutableJS: true } });
    store.dispatch({ type: "FAKE_ACTION" });
    expect(store.getState()).toEqual(fromJS({
      [key]: state,
    }));
  });

  it("should inject the reducer using a complex key with immutable", () => {
    const key = "myDomain.myReducerKey";
    const state = fromJS({ fakeResult: 23 });
    const { store } = setup({ key, reducerState: state, config: { useImmutableJS: true } });
    store.dispatch({ type: "FAKE_ACTION" });
    expect(store.getState()).toEqual(fromJS({
      myDomain: {
        myReducerKey: state,
      },
    }));
  });
});
