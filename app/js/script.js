const dark = document.getElementById("dark");
const light = document.getElementById("light");

// Function to apply the theme based on the saved value in localStorage
const checkTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList = "dark";
        dark.checked = true; // Set dark radio as checked
    } else {
        document.body.classList = "light";
        light.checked = true; // Set light radio as checked
    }
}

// Check if there's a saved theme in localStorage when the page loads
const savedTheme = localStorage.getItem('theme');

// If no saved theme, use system preference as a fallback
if (!savedTheme) {
    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (preference) {
        localStorage.setItem('theme', 'dark');
        document.body.classList = "dark";
        dark.checked = true;
    } else {
        localStorage.setItem('theme', 'light');
        document.body.classList = "light";
        light.checked = true;
    }
} else {
    checkTheme(); // Apply the saved theme
}

// Add event listener for dark mode
dark.addEventListener("change", () => {
    if (dark.checked) {
        localStorage.setItem('theme', 'dark'); // Store the theme preference in localStorage
        document.body.classList = "dark";
    }
});

// Add event listener for light mode
light.addEventListener("change", () => {
    if (light.checked) {
        localStorage.setItem('theme', 'light'); // Store the theme preference in localStorage
        document.body.classList = "light";
    }
});
