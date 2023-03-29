// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const config = {
    presets: [
        ['@babel/preset-env', {
            targets: 'defaults', // > 0.5%, last 2 versions, Firefox ESR, not dead
            modules: 'auto',
            corejs: '3.29', // keep in sync w/ package.json core-js dependency
            debug: false,
            useBuiltIns: 'usage',
            shippedProposals: true,
        }],
        ['@babel/preset-react', {
            useBuiltIns: true,
        }],
    ],
    plugins: [
    ],
};

// Jest needs module transformation
config.env = {
    test: {
        presets: config.presets,
        plugins: config.plugins,
    },
};
config.env.test.presets[0][1] = {...config.env.test.presets[0][1], modules: 'auto'};

module.exports = config;
