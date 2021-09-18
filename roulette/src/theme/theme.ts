import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    initialColorMode: "dark",
    useSystemColorMode: false,
    fonts: {
        heading: "Open Sans",
        body: "Roboto",
        time: "Sora",
    },

    textStyles: {
        title: {
            fontFamily: "time",
            fontSize: "24px",
            fontWeight: "600",
            lineHeight: "30px",
        },
        emphasis: {
            fontFamily: "body",
            fontSize: "20px",
            fontWeight: "bold",
            lineHeight: "23px",
        },
        accent: {
            fontFamily: "body",
            fontSize: "16px",
            fontWeight: "bold",
            lineHeight: "28px",
        },
        regular: {
            fontFamily: "body",
            fontSize: "16px",
            fontWeight: "400",
            lineHeight: "28px",
        },
        small: {
            fontFamily: "body",
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "24px",
        },
        caption: {
            fontFamily: "body",
            fontSize: "12px",
            fontWeight: "400",
            lineHeight: "18px",
        },
        heading: {
            fontFamily: "heading",
            fontSize: "11px",
            fontWeight: "600",
            lineHeight: "18px",
        },
        table: {
            fontFamily: "body",
            fontSize: "11px",
            fontWeight: "400",
            lineHeight: "18px",
        },
        timer: {
            fontFamily: "time",
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "18px",
        },
    },
    colors: {
        brand: {
            50: "#616162",
            100: "#1e1e20",
            200: "#131315",
            300: "#323234",
            400: "#141c29",
            500: "#1a2029",
            600: "#202734",
            700: "#0F1724",
        },
        gray: {
            50: "#808080",
            100: "#f1f1f1",
            200: "#f2f2f2",
            250: "#cfcfcf",
            260: "#c9c9c9",
            300: "#e5e5e5",
            400: "#969696",
            500: "#434343",
            600: "#464647",
        },
        blue: { 300: "#0085ff" },
        teal: { 300: "#29bdd2" },
        green: {
            200: "#1f5e39",
            300: "#00ff00",
            400: "#33cf71",
        },
        red: {
            300: "#ed2939",
        },
        purple: {
            200: "#a5a6f6",
            300: "#7b61ff",
        },
    },
});

export default theme;
