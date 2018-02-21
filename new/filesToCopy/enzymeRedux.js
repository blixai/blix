import React from 'react';
import { mount, shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import HomeContainer from '../src/containers/Home/HomeContainer';
import Home from '../src/containers/Home/Home';

describe('HomeContainer', () => {
  const mockFn = jest.fn()
  const mockStore = configureMockStore()({})


  it('Home Container Mounts without Crashing', () => {
    const Container = mount(<Provider store={mockStore}><HomeContainer /></Provider>)
  })
})