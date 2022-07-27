export interface IThemeOptions{
    primary: string;
    secondary: string;
    default: string;
    textBase: string;
}

export interface ITheme{
  "--theme-primary": string;
  "--theme-secondary": string;
  "--theme-default": string;
  "--theme-text-base": string;
}

export function applyTheme(theme:ITheme) {
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([cssVar, value]) => {
      root.style.setProperty(cssVar, value);
    });
}
  
export function createTheme(props:IThemeOptions) {
    return {
      "--theme-primary": props.primary,
      "--theme-secondary": props.secondary,
      "--theme-text-base": props.textBase,
      "--theme-default": props.default,
    } as ITheme;
}