import { render, screen } from '@testing-library/react';
import Button from './Button.tsx';

describe('Button 组件', () => {
  test('正确渲染文本内容', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Test Button');
  });
});
