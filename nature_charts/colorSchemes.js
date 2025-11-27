const ColorSchemes = {
    npg: {
        red: "#E64B35",
        blue: "#4DBBD5",
        green: "#00A087",
        darkBlue: "#3C5488",
        orange: "#F39B7F",
        teal: "#4DBBD5", // Using blue as teal for consistency with prompt
        bg: "#ffffff",
        text: "#333333",
        grid: "#F0F0F0",
        headerBg: "#E5E7EB"
    },
    nature: {
        red: "#D95F02",
        blue: "#7570B3",
        green: "#1B9E77",
        darkBlue: "#333333",
        orange: "#E7298A",
        teal: "#66A61E",
        bg: "#ffffff",
        text: "#000000",
        grid: "#eeeeee",
        headerBg: "#f0f0f0"
    },
    science: {
        red: "#C0392B",
        blue: "#2980B9",
        green: "#27AE60",
        darkBlue: "#2C3E50",
        orange: "#D35400",
        teal: "#16A085",
        bg: "#ffffff",
        text: "#2C3E50",
        grid: "#ecf0f1",
        headerBg: "#bdc3c7"
    },
    custom: {
        red: "#E64B35",
        blue: "#4DBBD5",
        green: "#00A087",
        darkBlue: "#3C5488",
        orange: "#F39B7F",
        teal: "#4DBBD5",
        bg: "#ffffff",
        text: "#333333",
        grid: "#F0F0F0",
        headerBg: "#E5E7EB"
    }
};

let currentScheme = 'npg';

function getColor(key) {
    return ColorSchemes[currentScheme][key];
}

function setColorScheme(schemeName) {
    if (ColorSchemes[schemeName]) {
        currentScheme = schemeName;
        updateCSSVariables();
        return true;
    }
    return false;
}

function updateCSSVariables() {
    const colors = ColorSchemes[currentScheme];
    document.documentElement.style.setProperty('--npg-red', colors.red);
    document.documentElement.style.setProperty('--npg-blue', colors.blue);
    document.documentElement.style.setProperty('--npg-green', colors.green);
    document.documentElement.style.setProperty('--npg-dark-blue', colors.darkBlue);
    document.documentElement.style.setProperty('--npg-bg', colors.bg);
    document.documentElement.style.setProperty('--npg-text', colors.text);
}

function setCustomColors(colors) {
    ColorSchemes.custom = { ...ColorSchemes.custom, ...colors };
    setColorScheme('custom');
}
