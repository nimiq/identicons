export type Section = 'face' | 'sides' | 'top' | 'bottom'
export type ColorType = 'accent' | 'background' | 'main'
export type Colors = Record<ColorType, string>
export type Sections = Record<Section, string>
export interface IdenticonParams { colors: Colors, sections: Sections }

export type IdenticonFormat = 'svg' | 'image/svg+xml'
