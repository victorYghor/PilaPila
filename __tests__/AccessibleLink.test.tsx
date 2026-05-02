// import React from 'react';
// import jest from 'jest-mock';
// import { describe, expect, it ,render } from '@jest/globals';

// describe('AccessibleLink', () => {
//   it('renders children and has accessibilityRole link', () => {
//     const onPress = jest.fn();
//     const { getByA11yRole, getByText } = render(
//       <AccessibleLink onPress={onPress} accessibilityLabel="my-link">
//         Clique aqui
//       </AccessibleLink>
//     );

//     const link = getByA11yRole('link');
//     expect(link).toBeTruthy();
//     expect(getByText('Clique aqui')).toBeTruthy();
//     fireEvent.press(link);
//     expect(onPress).toHaveBeenCalled();
//   });
// });
