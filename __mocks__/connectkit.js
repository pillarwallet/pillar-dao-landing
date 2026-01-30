const React = require('react')

const ConnectKitButton = jest.fn((props = {}) =>
  React.createElement('button', {
    type: 'button',
    'data-testid': props?.['data-testid'] || 'connectkit-button',
    ...props,
    children: props?.children || 'Open ConnectKit',
  })
)

ConnectKitButton.Custom = jest.fn(({ children, onClick }) =>
  React.createElement(
    'button',
    {
      type: 'button',
      'data-testid': 'connectkit-custom-button',
      onClick,
    },
    children || 'Custom ConnectKit'
  )
)

const ConnectKitProvider = jest.fn(({ children }) =>
  React.createElement(React.Fragment, null, children)
)

const getDefaultConfig = jest.fn((config = {}) => ({
  ...config,
  connectors: config?.connectors || [],
  publicClient: config?.publicClient || {},
  webSocketPublicClient: config?.webSocketPublicClient || {},
}))

module.exports = {
  __esModule: true,
  ConnectKitButton,
  ConnectKitProvider,
  getDefaultConfig,
}
