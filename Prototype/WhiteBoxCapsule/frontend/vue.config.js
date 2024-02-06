module.exports = {
    publicPath: '',
    transpileDependencies: true,
    devServer: {
        port: 8000,
        proxy: 'https://localhost/',
    }
}