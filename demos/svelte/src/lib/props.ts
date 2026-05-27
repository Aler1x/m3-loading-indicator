export type PropType = "number" | "string" | "boolean";

export interface PropDoc {
  name: string;
  type: PropType;
  default: string;
  description: string;
}

export const PROP_DOCS: PropDoc[] = [
  {
    name: "size",
    type: "number",
    default: "48",
    description: "CSS pixel size of the indicator canvas.",
  },
  {
    name: "color",
    type: "string",
    default: '"currentColor"',
    description: "Fill color for the morphing shape.",
  },
  {
    name: "sizeRatio",
    type: "number",
    default: "0.79",
    description: "Shape-to-container ratio (38dp inside 48dp on Android).",
  },
  {
    name: "speed",
    type: "number",
    default: "1",
    description: "Animation speed multiplier.",
  },
  {
    name: "paused",
    type: "boolean",
    default: "false",
    description: "Pause the animation loop.",
  },
  {
    name: "contained",
    type: "boolean",
    default: "false",
    description: "Draw a circular container background behind the shape.",
  },
  {
    name: "containerColor",
    type: "string",
    default: '"rgba(0,0,0,0.08)"',
    description: "Container fill when contained is true.",
  },
];

export type PlaygroundState = {
  size: number;
  color: string;
  sizeRatio: number;
  speed: number;
  paused: boolean;
  contained: boolean;
  containerColor: string;
};

export const DEFAULT_PLAYGROUND: PlaygroundState = {
  size: 48,
  color: "#6442D6",
  sizeRatio: 0.79,
  speed: 1,
  paused: false,
  contained: false,
  containerColor: "rgba(0,0,0,0.08)",
};
