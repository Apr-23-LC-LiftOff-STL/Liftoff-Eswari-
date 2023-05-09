export interface WeatherData {
    main: {
        temp: number,
        feels_like: number,
        humidity: number,
        pressure: number
    },
    weather: {
        main: string,
        icon: string
    }[],
    name: string
}