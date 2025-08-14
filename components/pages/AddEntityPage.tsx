import React from 'react';
import { PageContainer } from './PageContainer';
import { UIButton } from './ui/UIButton';
import { UIInput } from './ui/UIInput';
import { Search } from '../icons';

export const AddEntityPage: React.FC<{onClose: () => void}> = ({ onClose }) => {
    return (
        <PageContainer title="Add Entity" breadcrumbs={['Home', 'Visualise']} onClose={onClose}>
             <div className="w-full max-w-2xl flex flex-col items-center p-4 bg-slate-800/50 rounded-xl space-y-6">
                <h3 className="text-xl text-sky-200">Protein Library</h3>
                
                <div className="relative w-full max-w-sm">
                    <UIInput placeholder="Search Database..." className="pl-10" />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400">
                      <Search />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <hr className="w-24 border-slate-600" />
                    <span className="text-slate-400">OR</span>
                    <hr className="w-24 border-slate-600" />
                </div>
                
                <div className="flex items-center space-x-4">
                    <UIInput placeholder="Enter PDB" />
                    <UIButton>Load</UIButton>
                </div>
                
                <div className="w-full h-48 mt-4 bg-slate-900/50 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500">Model list placeholder</p>
                </div>

             </div>
        </PageContainer>
    );
};