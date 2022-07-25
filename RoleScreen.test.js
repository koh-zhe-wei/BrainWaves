import React from 'react';
import renderer from 'react-test-renderer';
import RoleScreen from './RoleScreen';

test('renders correctly', () => {
  const tree = renderer.create(<RoleScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});