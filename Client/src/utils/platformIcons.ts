export const getPlatformIcons = (platforms: { name: string }[]): string[] => {
    if (!platforms?.length) return [];
    const names = platforms.map((p) => p.name?.toLowerCase() ?? "");
    const icons: string[] = [];
    if (names.some((n) => n.includes("playstation")))  icons.push("fa-brands fa-playstation");
    if (names.some((n) => n.includes("xbox")))         icons.push("fa-brands fa-xbox");
    if (names.some((n) => n.includes("pc") || n.includes("linux") || n.includes("mac")))
                                                       icons.push("fa-brands fa-steam");
    if (names.some((n) => n.includes("nintendo") || n.includes("switch") || n.includes("wii")
        || n.includes("nes") || n.includes("game boy") || n.includes("gameboy") || n.includes("3ds")))
                                                       icons.push("fa-solid fa-gamepad");
    if (names.some((n) => n.includes("ios") || n.includes("android") || n.includes("mobile")
        || n.includes("apple")))                       icons.push("fa-solid fa-mobile-screen");
    return icons;
};
