import { Chapter } from './types';
import { intro } from './data/chapters/intro';
import { section1 } from './data/chapters/section-1';
import { section2 } from './data/chapters/section-2';
import { section3 } from './data/chapters/section-3';
import { section4 } from './data/chapters/section-4';
import { section5 } from './data/chapters/section-5';
import { section6 } from './data/chapters/section-6';
import { section7 } from './data/chapters/section-7';
import { section8 } from './data/chapters/section-8';
import { section9 } from './data/chapters/section-9';
import { section10 } from './data/chapters/section-10';
import { section11 } from './data/chapters/section-11';
import { section12 } from './data/chapters/section-12';

export const APP_TITLE = "WANNA EAT MORE";
export const APP_SUBTITLE = "无尽食欲";
export const AUTHOR_INFO = "著：内山靖二郎 译：艾德琳";
export const SCENARIO_STATS = {
  players: "2~4 名玩家",
  duration: "3~4 小时"
};

export const CONTENT: Chapter[] = [
  intro,
  section1,
  section2,
  section3,
  section4,
  section5,
  section6,
  section7,
  section8,
  section9,
  section10,
  section11,
  section12
];