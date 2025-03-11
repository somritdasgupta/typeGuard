module.exports = {
  compress: {
    pure_funcs: ['console.log', 'console.debug', 'console.error'],
    passes: 3,
    unsafe: true,
    unsafe_arrows: true,
    unsafe_methods: true,
    unsafe_proto: true,
    unsafe_regexp: true,
    unsafe_undefined: true,
  },
  mangle: {
    properties: {
      regex: /^_/,
    },
  },
  format: {
    comments: false,
  },
};
