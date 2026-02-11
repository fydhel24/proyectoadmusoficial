import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-brand text-white flex aspect-square size-8 items-center justify-center rounded-md shadow-lg shadow-brand/20">
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-bold tracking-tight text-foreground">ADMUS PRODUCTIONS</span>
            </div>
        </>
    );
}
