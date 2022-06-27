module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './views/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    safelist: [
        'outline',
        'outline-4',
        'outline-main-red',
        'outline-olive-400',
        'ring-2',
        'ring-olive-900',
        'ring-deep-red',
        'ring-olive-200',
        'hover:scale-[2.5]',
        'hover:scale-[1.4]'
    ],
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
        fontSize: {
            'xs': ['24px', '16px'],
            'sm': ['28px', '20px'],
            'base': ['32px', '24px'],
            'lg': ['38px', '30px'],
            'xl': ['40px', '32px'],
            '2xl': ['48px', '36px'],
            '3xl': ['60px', '42px'],
            '4xl': ['72px', '56px'],
            '5xl': ['96px', 1],
            '6xl': ['120px', 1],
        },
        extend: {
            fontFamily: {
                'dokdo': ['Dokdo'],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}