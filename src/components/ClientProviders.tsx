"use client";

import { ReactNode } from 'react';
import SmoothScroll from './SmoothScroll';
import CustomCursor from './CustomCursor';
import AudioProvider, { SoundToggle } from './AudioProvider';

interface ClientProvidersProps {
    children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
    return (
        <AudioProvider>
            <SmoothScroll>
                <CustomCursor />
                {children}
                <SoundToggle />
            </SmoothScroll>
        </AudioProvider>
    );
}
