// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    // Add other methods as necessary
}));

// jest.mock('axios');