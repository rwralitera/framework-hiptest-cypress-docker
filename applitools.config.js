module.exports = {
    concurrency: 1,
    apiKey: 'QRlZY102B3NE5PZAH974z4r9VDUuWB109ko0jb96L6tBWxvQ110',
    //
    browser: [
        // Add browsers with different viewports
        {width: 1024, height: 768, name: 'chrome'},
        // {width: 700, height: 500, name: 'firefox'},
        // {width: 1600, height: 1200, name: 'ie11'},
        // {width: 800, height: 600, name: 'edgechromium'},
        // {width: 800, height: 600, name: 'safari'},
        // Add mobile emulation devices in Portrait mode
        // {deviceName: 'iPhone X', screenOrientation: 'portrait'},
        // {deviceName: 'Pixel 2', screenOrientation: 'portrait'}
    ],
    // set batch name to the configuration
    batchName: 'Applitools test with cypress (Gitlab-CI + CircleCI)'
}