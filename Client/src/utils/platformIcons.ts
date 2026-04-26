export const getPlatformIcons = (platforms: { name: string }[]): string[] => {
    if (!platforms?.length) return [];
    const names = platforms.map((p) => p.name?.toLowerCase() ?? "");
    const icons: string[] = [];
    if (names.some((n) => n.includes("playstation"))) icons.push("fa-brands fa-playstation");
    if (names.some((n) => n.includes("xbox")))        icons.push("fa-brands fa-xbox");
    if (names.some((n) => n.includes("pc")))          icons.push("fa-brands fa-steam");
    if (names.some((n) => n === "ios" || n === "macos" || n.includes("apple") || n.includes("mac")))
                                                      icons.push("fa-brands fa-apple");
    if (names.some((n) => n.includes("android")))     icons.push("fa-brands fa-android");
    if (names.some((n) => n.includes("mobile") && !n.includes("android") && !n.includes("ios")))
                                                      icons.push("fa-solid fa-mobile-screen");
    return icons;
};
