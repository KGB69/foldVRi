import React from 'react';

export enum GameState {
  START,
  EXPLORING,
  MENU,
  PAGE_VIEW,
  VR_MODE,
}

export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface PageContent {
  id: string;
  title: string;
  menuLabel: string;
  Icon: IconType; // For the radial menu
}
