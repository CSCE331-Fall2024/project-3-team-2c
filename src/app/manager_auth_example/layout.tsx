import "~/styles/globals.css";


import { TRPCReactProvider } from "~/trpc/react";


export default function ManagerAuthExampleLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        {children}
    );
}
