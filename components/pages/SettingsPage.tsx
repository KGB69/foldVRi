import React from 'react';
import { PageContainer } from './PageContainer';

interface SettingsPageProps {
    onClose: () => void;
    distance: number;
    setDistance: (distance: number) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onClose, distance, setDistance }) => {
    return (
        <PageContainer title="Settings" breadcrumbs={['Home', 'Settings']} onClose={onClose}>
            <div className="w-full max-w-md flex flex-col items-center space-y-6 p-4">
                <div className="w-full">
                    <label htmlFor="distance-slider" className="text-xl text-slate-200 block text-center mb-2">
                        Page Distance: <span className="font-bold text-sky-400 tabular-nums">{distance.toFixed(1)}</span>
                    </label>
                    <input
                        id="distance-slider"
                        type="range"
                        min="2"
                        max="8"
                        step="0.1"
                        value={distance}
                        onChange={(e) => setDistance(parseFloat(e.target.value))}
                        className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:bg-sky-400"
                    />
                </div>
                <p className="text-sm text-slate-400 text-center">
                    Adjust how far the UI panels appear from your viewpoint.
                </p>
            </div>
        </PageContainer>
    );
};