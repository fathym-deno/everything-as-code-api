import {
  EverythingAsCode,
  EverythingAsCodeClouds,
  EverythingAsCodeGitHub,
  EverythingAsCodeIoT,
  EverythingAsCodeSources,
} from "./src.deps.ts";

export type FathymEaC =
  & EverythingAsCode
  & EverythingAsCodeClouds
  & EverythingAsCodeIoT
  & EverythingAsCodeGitHub
  & EverythingAsCodeSources;
