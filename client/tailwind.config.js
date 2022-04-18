// tailwind.config.js
module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors: {
            'olive': {
                50: '#F9FAE3',
                200: '#F7FAB7',
                400: '#CDD26B',
                600: '#CDD26B',
                900: '#959A31',
            },
            'main-bg': '#EED29B',
            'deep-bg': '#D4B26C',
            'dark-bg': '#9C7931',
            'grey-bg': '#AC9568',
            'light-bg': '#FBF3E3',
            'main-blue': '#50628E',
            'dark-blue': '#4A5674',
            'deep-blue': '#253869',
            'light-blue': '#B9CAF4',
            'light-light-blue': '#DFE5F4',
            'main-red': '#D06A6F',
            'deep-red': '#993036',
            'dark-red': '#A96669',
            'light-red': '#FAB7BA',
            'light-light-red': '#FAE3E4',
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}