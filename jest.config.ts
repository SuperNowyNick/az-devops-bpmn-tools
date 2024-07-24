module.exports = {
    preset: 'ts-jest',
    transform: {
      '^.+\\.(bpmn)?$': '@glen/jest-raw-loader',
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    }
  };