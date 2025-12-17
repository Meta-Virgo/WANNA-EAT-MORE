export type ContentCategory = '模组背景&导入' | '故事开始' | '结局与结算' | '前言';

export interface Chapter {
  id: string;
  title: string;
  category: ContentCategory;
  content: (
    | string 
    | { type: 'statblock', data: string } 
    | { type: 'list', items: string[] }
    | { type: 'collapsible', title: string, content: string[] }
  )[];
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  category: ContentCategory;
}