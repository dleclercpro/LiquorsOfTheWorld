import { render } from '@testing-library/react';
import Spinner from '../components/Spinner';

test('renders Spinner component', () => {
  const { container } = render(
    <Spinner />
  );

  const element = container.querySelector('.spinner');

  expect(element).toBeInTheDocument();
});
