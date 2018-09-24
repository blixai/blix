import React from 'react';
import { mount, shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import Router from '../src/Router';

describe('Router', () => {
  const mockFn = jest.fn()


  it('Router Mounts without Crashing', () => {
    const Container = shallow(<Router/>)
  })
})