module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // debug: true,
        // useBuiltIns: 'usage',
        useBuiltIns: 'entry',
        corejs: 3,
        loose: true,
      },
    ],
  ],
};
