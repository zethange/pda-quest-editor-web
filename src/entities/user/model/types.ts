export interface User {
  id: string;
  login: string;
  email: string;
  name: string;
  nickname: string;
  avatar: string;
  pdaId: number;
  role: string;
  gang: string;
  xp: number;
  registration: string;
  lastLoginAt: string;
}

export interface UserSettings {
  danyaMod: boolean;
  showMiniMap: boolean;
  onlyRenderVisibleElements: boolean;
  useAlternativeDagre: boolean;
  enableUtilities: boolean;
  drawerEditStageWidth: string;
  alternativeMapViewer: boolean;
  nodeWidth: string;
  nodeHeight: string;
}
