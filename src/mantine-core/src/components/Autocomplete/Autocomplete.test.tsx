import React from 'react';
import { mount, shallow } from 'enzyme';
import {
  checkAccessibility,
  itSupportsClassName,
  itSupportsRef,
  itSupportsStyle,
  itSupportsStylesApi,
} from '@mantine/tests';
import { InputWrapper } from '../InputWrapper/InputWrapper';
import { Input } from '../Input/Input';
import { Autocomplete } from './Autocomplete';
import { Autocomplete as AutocompleteStylesApi } from './styles.api';

const defaultProps = {
  initiallyOpened: true,
  label: 'Test',
  data: [{ value: 'test-1' }, { value: 'test-2' }],
};

const data = Array(50)
  .fill(0)
  .map((_, index) => ({ value: index.toString() }));

describe('@mantine/core/Autocomplete', () => {
  itSupportsClassName(Autocomplete, defaultProps);
  itSupportsStyle(Autocomplete, defaultProps);
  itSupportsRef(Autocomplete, defaultProps, HTMLInputElement, 'elementRef');

  checkAccessibility([
    mount(<Autocomplete {...defaultProps} />),
    mount(<Autocomplete {...defaultProps} initiallyOpened={false} />),
  ]);

  itSupportsStylesApi(
    Autocomplete,
    {
      ...defaultProps,
      icon: '$',
      rightSection: '$',
      label: 'test-label',
      error: 'test-error',
      description: 'test-description',
      required: true,
    },
    Object.keys(AutocompleteStylesApi).filter((key) => key !== 'hovered'),
    'autocomplete'
  );

  it('does not render dropdown when value is exact same as any of items', () => {
    const withExactValue = shallow(<Autocomplete data={data} value="2" initiallyOpened />);
    const withoutExactValue = shallow(<Autocomplete data={data} value="" initiallyOpened />);
    expect(withExactValue.render().find('.mantine-autocomplete-dropdown')).toHaveLength(0);
    expect(withoutExactValue.render().find('.mantine-autocomplete-dropdown')).toHaveLength(1);
  });

  it('renders correct amount of items based on data prop', () => {
    const element = shallow(<Autocomplete data={data.slice(0, 5)} initiallyOpened limit={10} />);
    expect(element.render().find('.mantine-autocomplete-item')).toHaveLength(5);
  });

  it('renders correct amount of items based on filter prop', () => {
    const element = shallow(
      <Autocomplete
        data={data}
        initiallyOpened
        limit={10}
        filter={(query, item) => item.value.includes('2')}
      />
    );

    // Numbers 0-50 which include 2
    expect(element.render().find('.mantine-autocomplete-item')).toHaveLength(10);
  });

  it('limits amount of shown items based on limit prop', () => {
    const element = shallow(<Autocomplete data={data} initiallyOpened limit={10} />);
    expect(element.render().find('.mantine-autocomplete-item')).toHaveLength(10);
  });

  it('passes wrapperProps to InputWrapper', () => {
    const element = shallow(
      <Autocomplete {...defaultProps} wrapperProps={{ 'aria-label': 'test' }} />
    );
    expect(element.render().attr('aria-label')).toBe('test');
  });

  it('passes required, id, label, error and description props to InputWrapper component', () => {
    const element = shallow(
      <Autocomplete
        {...defaultProps}
        id="test-id"
        required
        label="test-label"
        error="test-error"
        description="test-description"
      />
    );

    expect(element.find(InputWrapper).prop('id')).toBe('test-id');
    expect(element.find(InputWrapper).prop('required')).toBe(true);
    expect(element.find(InputWrapper).prop('label')).toBe('test-label');
    expect(element.find(InputWrapper).prop('error')).toBe('test-error');
    expect(element.find(InputWrapper).prop('description')).toBe('test-description');
  });

  it('passes required, id, invalid, icon and radius props to Input component', () => {
    const element = shallow(
      <Autocomplete
        {...defaultProps}
        required
        id="test-id"
        type="number"
        error="test-error"
        icon="$"
        radius="sm"
      />
    );

    expect(element.find(Input).prop('id')).toBe('test-id');
    expect(element.find(Input).prop('required')).toBe(true);
    expect(element.find(Input).prop('invalid')).toBe(true);
    expect(element.find(Input).prop('icon')).toBe('$');
    expect(element.find(Input).prop('radius')).toBe('sm');
  });

  it('has correct displayName', () => {
    expect(Autocomplete.displayName).toEqual('@mantine/core/Autocomplete');
  });
});
