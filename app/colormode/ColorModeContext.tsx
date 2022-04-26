import type { ColorMode } from "@chakra-ui/react";
import { createContext } from "react";

export type ColorModeContextData = ColorMode | undefined;
/**
 * Stores the initial and current color mode on the server
 */
export const ColorModeContext = createContext<ColorModeContextData>(undefined);
